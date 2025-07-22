import { Request } from "express";
import { User } from "../../domain/entities/User";
import { UserListingDTO, UserDTO, UserDashBoardData, UserDashBoardDTO, MatchedUserDTO, UserProfileDTO } from "../../usecases/dtos/UserDTO";
import { paramsNormalizer } from "../utils/filterNormalizer";
import { Match, MatchDTO, UserDetails } from "../../usecases/dtos/ChatDTO";

export function toUserListingDTO(entities: User[]): UserListingDTO[] {
    try {
    return entities.map((en) => ({
        id: en.id,
        username: en.username,
        email: en.email,
        isBlocked: en.isBlocked,
        isBanned:en.isBanned,
        banExpiresAt: en.banExpiresAt,
        setupCompleted: en.setupCompleted,
        createdAt: en.createdAt,
        reportedUsers:en.reportedUsers,
    }));   
    } catch (error) {
       throw new Error('Something happend in toUserListingDTO') 
    };
};

export function toUserBlockedListDTO(entities: User[]): UserListingDTO[] {
    try {
        return entities.map((en) => ({
            id: en.id,
            username: en.username,
            email: en.email,
            isBlocked: en.isBlocked,
            image: en.image,
        }));  
    } catch (error) {
      throw new Error('Something happend in toUserBlockedListDTO');
    };
};

export function toMatchedUsersDTOs(entities: User[]): MatchedUserDTO[] {
    try {

        return entities.map((en) => ({
            
            id: en.id,
            username: en.username,
            dob: en.dob,
            gender: en.gender,
            interestedIn: en.interestedIn,
            lookingFor: en.lookingFor,
            image: en.image,
        }));   
    } catch (error) {
      throw new Error('Something happend in toMatchedUsersDTOs')  
    };
};

export function toPairedDTOs(data: UserDetails): MatchDTO[] {
    try {
       return data.matches.map((key) => ({
         _id: key._id,
         email: key.email,
         username: key.username,
         image: key.image
       })) 
    } catch (error) {
      throw new Error('Something happend in toPairedDTOs')  
    };
}

export function toUserDTO(entity: User): UserDTO {
    try {
     return {
        id: entity.id,
        username: entity.username,
        email: entity.email,
        image: entity.image ?? [],
        phone: entity.phone,
        isBlocked: entity.isBlocked ?? false,
        lookingFor: entity.lookingFor,
        interestedIn: entity.interestedIn,
        dob: entity.dob,
        setupCompleted: entity.setupCompleted,
        prime: entity.prime,
     };  
    } catch (error) {
       throw new Error('Something happend in toUserDTO') 
    };
};

export function toUserProfileDTO(entity: User): UserProfileDTO {
    try {
       return {
        id: entity.id,
        username: entity.username,
        email: entity.email,
        phone: entity.phone,
        dob:entity.dob,
        gender:entity.gender,
        interestedIn: entity.interestedIn,
        lookingFor: entity.lookingFor,
        image:entity.image,
        createdAt:entity.createdAt,
        prime:{
            type: entity.prime?.type,
            isPrime: entity.prime?.isPrime,
            primeCount: entity.prime?.primeCount,
            endDate: entity.prime?.endDate,
            startDate: entity.prime?.startDate,
        },
        location: entity.location,
       } 
    } catch (error) {
      throw new Error('Something happend in toUserProfileDTO')  
    };
};


export async function toBlockUserDTO(req: Request) {
    try {
        return {
        userId: req.body.id,
        filterOptions: await paramsNormalizer(req.query)
        }
    } catch (error) {
       throw new Error('Something happend in toBlockUserDTO');
    };
};

export async function toBanUserDTO(req: Request) {
    try {
        return {
        userId: req.body.id,
        banDuration: req.body.duration,
        filterOptions: await paramsNormalizer(req.query)
        }
    } catch (error) {
       throw new Error('Something happend in toBlockUserDTO');
    };
};

export async function toUnbanUserDTO(req: Request) {
    try {
        return {
        userId: req.body.id,
        filterOptions: await paramsNormalizer(req.query)
        }
    } catch (error) {
       throw new Error('Something happend in toBlockUserDTO');
    };
};

export function toDashboardDTO(data: UserDashBoardData): UserDashBoardDTO {
    try {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    
        const formattedMonthlyUsers = data.monthlyNewUsers.map((item: any) => ({
            month: monthNames[item._id.month - 1],
            count: item.count,
        }));
    
        return {
            ...data,
            monthlyNewUsers: formattedMonthlyUsers,
        };
        
    } catch (error) {
       throw new Error('Something happend in toDashboardDTO') 
    };
};