import { FormattedLocation, Preferences } from "../../../../types/express";
import { User } from "../../../domain/entities/User";
import { MatchDTO, UserDetails } from "../../dtos/ChatDTO";
import { LocationDTO } from "../../dtos/CommonDTO";
import { MatchedUserDTO, UserDTO, UserProfileDTO } from "../../dtos/UserDTO";

export interface ICommonUseCase {
 fetchUserData(userPreferences: Preferences): Promise<MatchedUserDTO[] | [] | null>;
 updateProfile(field: string, value: string, userId: string): Promise<UserProfileDTO | null>
 updateProfileImageURL(userId: string): Promise<{image:string[] , imageExpiry: number} | null>;
 profile(userId: string): Promise<UserProfileDTO | null>;
 removeImage(userId: string, imageSource: string): Promise<UserProfileDTO | null>
 addImage(userId: string, imageSource: Express.Multer.File[]): Promise<UserProfileDTO | null>;
 handleInterest(userId: string, interactorId: string): Promise<boolean | null>;
 changeProfileImage(imageIndex: number, userId: string): Promise<boolean> 
 fetchMatches(userId: string): Promise<MatchDTO[] | null>;
 unmatchUser(userId: string, interactorId: string): Promise<boolean>;
 interestedUsers(userId: string, interactorId: string): Promise<boolean>;
 fetchUserById(userId: string): Promise<UserDTO | null>;
 updateUserLocation(userId: string, locationData:LocationDTO ): Promise<UserProfileDTO | null>
 fetchLocation(latitude: string, longitude: string):Promise<FormattedLocation | null>
};