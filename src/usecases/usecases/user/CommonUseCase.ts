import { FormattedLocation, Preferences } from "../../../../types/express";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { MatchDTO, UserDetails } from "../../dtos/ChatDTO";
import { MatchedUserDTO, UserDTO, UserProfileDTO } from "../../dtos/UserDTO";
import { IS3Client } from "../../interfaces/IS3Client";
import { IGeolocation } from "../../interfaces/IGeolocation";
import { dobRangeFinder } from "../../../interfaces/utils/dobRangeFinder";
import { LocationDTO } from "../../dtos/CommonDTO";
import { ICommonUseCase } from "../../interfaces/user/ICommonUseCase";
import { toMatchedUsersDTOs, toPairedDTOs, toUserDTO, toUserProfileDTO } from "../../../interfaces/mappers/userDTOMapper";

export class CommonOperations implements ICommonUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _s3: IS3Client,
        private _geolocation: IGeolocation
    ) { }

    private  _objectFormatter = async (userPreferences: Preferences): Promise<Preferences> => {
        try {
            let ageRange;
            if(Array.isArray(userPreferences.ageRange)){
                ageRange = userPreferences.ageRange.map(Number) as [number, number]
            }else{
                ageRange = userPreferences.ageRange?.split(',').map(Number) as [number, number] 
            };
            
            userPreferences = {
                ...userPreferences, 
                distance: Number(userPreferences.distance),
                ageRange: ageRange,
            };

            return userPreferences;
        } catch (error) {
            throw new Error('something happend in objectFormatter')
        };
    };

    async fetchUserData(userPreferences: Preferences): Promise<MatchedUserDTO[] | [] | null> {
        try {
            userPreferences = await this._objectFormatter(userPreferences);

            const user = await this._userRepository.findById(userPreferences.userId);
            if (!user || !user?.location || !user?.location?.coordinates) {
            return [];
            };
            
            const users = await this._userRepository.findMatches(userPreferences, user, dobRangeFinder(userPreferences));
            if(users){
                await Promise.all(
                    users.map(async (doc) => {
                        if (doc.image && Array.isArray(doc.image)) {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                            );
                        }
                    })
                );
            };
            return users ? toMatchedUsersDTOs(users)  : [];
        } catch (error) {
            throw new Error('something happend in fetchUserData');
        };
    };

    async updateProfile(field: string, value: string, userId: string): Promise<UserProfileDTO | null> {
        try {
            const user = await this._userRepository.updateProfileById(field, value, userId);
            if (user) {
                const user = await this._userRepository.findById(userId);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };

                return user ? toUserProfileDTO(user) : null
            };
            return null;
        } catch (error) {
            throw new Error('something happend in updateProfile');
        };
    };

    async updateProfileImageURL(userId: string): Promise<{image:string[] , imageExpiry: number} | null> {
        try {
           const user = await this._userRepository.findById(userId);
           if (user?.image) {
            user.image = await Promise.all(
                user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
            );

            return {image: user.image, imageExpiry: this._s3.urlExpiry}
        }
        return null;
        
        } catch (error) {
          throw new Error('something happend in updateProfileImageURL')  
        };
    };

    async profile(userId: string): Promise<UserProfileDTO | null> {
        try {
            const user = await this._userRepository.findById(userId);
            if (user?.image) {
                user.image = await Promise.all(
                    user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                );
            }
            return user? toUserProfileDTO(user):null;
        } catch (error) {
            throw new Error('something happend in profile');
        };
    };

    async removeImage(userId: string, imageSource: string): Promise<UserProfileDTO | null> {
        try {

            const urlObj = new URL(imageSource);
            const imageKey = decodeURIComponent(urlObj.pathname.substring(1));

            await this._s3.deleteFromS3(imageKey);

            const result = await this._userRepository.deleteImageById(userId, imageKey);
            if (result) {
                const user = await this._userRepository.findById(userId);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };
                return user ? toUserProfileDTO(user) : null;
            }
            return null;
        } catch (error) {
            throw new Error('something happend in removeImage');
        };

    };

    async addImage(userId: string, imageSource: Express.Multer.File[]): Promise<UserProfileDTO | null> {
        try {
            const image: string[] = [];
            for(let post of imageSource){
               const fileName = await this._s3.uploadToS3(post);
               image.push(fileName);
            };
            
            const result = await this._userRepository.addImageById(userId, image);
            if (result) {
                const user = await this._userRepository.findById(userId);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };

                return user ? toUserProfileDTO(user): null;
            }
            return null;
        } catch (error) {
            throw new Error('something happend in addImage');
        };

    };

    async handleInterest(userId: string, interactorId: string): Promise<boolean | null> {
        try {
            const result = await this._userRepository.addMatches(userId, interactorId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in handleInterest');
        };
    };

    async changeProfileImage(imageIndex: number, userId: string): Promise<boolean> {
        try {
           const user = await this._userRepository.findById(userId);
           if (!user || !user.image|| user.image.length < 2) return false;
           const lastIndex = user.image.length - 1;
      
           if (imageIndex < 0 || imageIndex >= lastIndex) return false;
           const result = await this._userRepository.changeImageById(imageIndex, lastIndex, userId, user.image);
           return result !== null; 
        } catch (error) {
          throw new Error('something happend in changeProfileImage')  
        };
    };

    async fetchMatches(userId: string): Promise<MatchDTO[] | null> {
        try {
            const users = await this._userRepository.findMatchedUsers(userId);
            if (!users) return null;
            
            if (users.matches && Array.isArray(users.matches)) {
                await Promise.all(
                    users.matches.map(async (match) => {
                        if (match.image && Array.isArray(match.image)) {
                            match.image = await Promise.all(
                                match.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                            );
                        }
                    })
                );
            };
            return users ? toPairedDTOs(users): null;
        } catch (error) {
            throw new Error('something happend in fetchMatches');
        };
    };

    async unmatchUser(userId: string, interactorId: string): Promise<boolean> {
        try {
            const result = await this._userRepository.unmatchById(userId, interactorId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in unmatchUser');
        };

    };

    async interestedUsers(userId: string, interactorId: string): Promise<boolean> {
        try {
            const result = await this._userRepository.addInterests(userId, interactorId);
            return result;
        } catch (error) {
            throw new Error('something happend in interestedUsers');
        };
    };

    async fetchUserById(userId: string): Promise<UserDTO | null> {
        try {
            const result = await this._userRepository.findById(userId);
            if(result?.image){
                result.image = await Promise.all(
                    result.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                );
            };
            return result ? toUserDTO(result) : null
        } catch (error) {
            throw new Error('somethig happend in fetchUserById')
        };
    };

    async updateUserLocation(userId: string, locationData:LocationDTO ): Promise<UserProfileDTO | null> {
        const {latitude, longitude, city, state, country} = locationData;
        try {
           const user = await this._userRepository.updateUserLocation(userId, latitude, longitude, state, country , city);
            if(user?.image){
                user.image = await Promise.all(
                  user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                );
            };
           return user ? toUserProfileDTO(user) : null;
        } catch (error) {
           throw new Error('something happend in updateUserLocation') 
        };
    };


    async fetchLocation(latitude: string, longitude: string):Promise<FormattedLocation | null>{
        try {
           const location = await this._geolocation.GetLocation(latitude, longitude);
           return location;
        } catch (error) {
           throw new Error('something happend in fetchLocation') 
        };
    };
};