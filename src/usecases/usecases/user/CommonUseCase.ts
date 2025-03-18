import { Preferences } from "../../../../types/express";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserDetails } from "../../dtos/ChatDTO";
import { UserDTO } from "../../dtos/UserDTO";
import { IS3Client } from "../../interfaces/IS3Client";

export class CommonOperations {
    constructor(
        private userRepository: IUserRepository,
        private s3: IS3Client,
    ) { }


    private  objectFormatter = async (userPreferences: Preferences): Promise<Preferences> => {
        try {
            let ageRange;

            if(Array.isArray(userPreferences.ageRange)){
                ageRange = userPreferences.ageRange.map(Number) as [number, number]
            }else{
                ageRange = userPreferences.ageRange?.split(',').map(Number) as [number, number] 
            }
            
            userPreferences = {
                ...userPreferences, 
                distance: Number(userPreferences.distance),
                ageRange: ageRange,
            }

            return userPreferences;
        } catch (error) {
            throw new Error('something happend in objectFormatter')
        }
    }

    async fetchUserData(userPreferences: Preferences): Promise<UserDTO[] | [] | null> {
        try {
            userPreferences = await this.objectFormatter(userPreferences);
            const users = await this.userRepository.findMatches(userPreferences);
            if(users){
                await Promise.all(
                    users.map(async (doc) => {
                        if (doc.image && Array.isArray(doc.image)) {// there chance image can be undefined
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        }
                    })
                );
            }
            return users ? users : [];
        } catch (error) {
            throw new Error('something happend in fetchUserData');
        };

    };

    async updateProfile(field: string, value: string, userId: string): Promise<UserDTO | null> {
        try {
            const user = await this.userRepository.updateProfileById(field, value, userId);
            if (user) {
                const user = await this.userRepository.findById(userId);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                    );
                };

                return user;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in updateProfile');
        };
    };

    async updateProfileImageURL(userId: string): Promise<{image:string[] , imageExpiry: number} | null> {
        try {
           const user = await this.userRepository.findById(userId);
           if (user?.image) {
            user.image = await Promise.all(
                user.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
            );

            return {image: user.image, imageExpiry: this.s3.urlExpiry}
        }
        return null;
        
        } catch (error) {
          throw new Error('something happend in updateProfileImageURL')  
        }
    }

    async profile(userId: string): Promise<UserDTO | null> {
        try {
            const user = await this.userRepository.findById(userId);
            if (user?.image) {
                user.image = await Promise.all(
                    user.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                );
            }
            return user;
        } catch (error) {
            throw new Error('something happend in profile');
        };

    };

    async removeImage(userId: string, imageSource: string): Promise<UserDTO | null> {
        try {

            const urlObj = new URL(imageSource);
            const imageKey = decodeURIComponent(urlObj.pathname.substring(1));

            await this.s3.deleteFromS3(imageKey);

            const result = await this.userRepository.deleteImageById(userId, imageKey);
            if (result) {
                const user = await this.userRepository.findById(userId);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                    );
                };
                return user;
            }
            return null;
        } catch (error) {
            throw new Error('something happend in removeImage');
        };

    };

    async addImage(userId: string, imageSource: Express.Multer.File[]): Promise<UserDTO | null> {
        try {
            const image: string[] = [];
            for(let post of imageSource){
               const fileName = await this.s3.uploadToS3(post);
               image.push(fileName);
            };
            
            const result = await this.userRepository.addImageById(userId, image);
            if (result) {
                const user = await this.userRepository.findById(userId);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                    );
                };

                return user;
            }
            return null;
        } catch (error) {
            throw new Error('something happend in addImage');
        };

    };

    async handleInterest(userId: string, interactorId: string): Promise<boolean | null> {
        try {
            const result = await this.userRepository.addMatches(userId, interactorId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in handleInterest');
        };

    };

    async changeProfileImage(imageIndex: number, userId: string): Promise<boolean> {
        try {
           const result = await this.userRepository.changeImageById(imageIndex, userId);
           return result !== null; 
        } catch (error) {
          throw new Error('something happend in changeProfileImage')  
        }
    };

    async fetchMatches(userId: string): Promise<UserDetails | null> {
        try {
            const users = await this.userRepository.findMatchedUsers(userId);
            if (!users) { return null };
            if (users.matches && Array.isArray(users.matches)) {
                await Promise.all(
                    users.matches.map(async (match) => {
                        if (match.image && Array.isArray(match.image)) {
                            match.image = await Promise.all(
                                match.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        }
                    })
                );
            };
            return users;
        } catch (error) {
            throw new Error('something happend in fetchMatches');
        };
    };

    async unmatchUser(userId: string, interactorId: string): Promise<boolean> {
        try {
            const result = await this.userRepository.unmatchById(userId, interactorId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in unmatchUser');
        };

    };

    async interestedUsers(userId: string, interactorId: string): Promise<boolean> {
        try {
            const result = await this.userRepository.addInterests(userId, interactorId);
            return result;
        } catch (error) {
            throw new Error('something happend in interestedUsers');
        };
    };

    async fetchUserById(userId: string): Promise<UserDTO | null> {
        try {
            const result = await this.userRepository.findById(userId);
            if(result?.image){
                result.image = await Promise.all(
                    result.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                );
            };
            return result
        } catch (error) {
            throw new Error('somethig happend in fetchUserById')
        }
    }

    async updateUserLocation(userId: string, locationData:{latitude: number, longitude: number, city: string, state: string, country:string}): Promise<User | null> {
        const {latitude, longitude, city, state, country} = locationData;
        try {
           const result = await this.userRepository.updateUserLocation(userId, latitude, longitude, state, country , city);
            if(result?.image){
                result.image = await Promise.all(
                    result.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                );
            };
           return result ? result : null;
        } catch (error) {
           throw new Error('something happend in updateUserLocation') 
        }
    }
};