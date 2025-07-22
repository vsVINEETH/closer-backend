import { User } from "../entities/User";
import { SetupUserDTO, UserDashBoardData } from "../../usecases/dtos/UserDTO";
import { SortOrder } from "../../infrastructure/config/database";
import { DateRange, DOBRange, Preferences } from "../../../types/express/index";
import { UserDetails } from "../../usecases/dtos/ChatDTO";
import { Prime } from "../../usecases/dtos/SubscriptionDTO";
import { UpdateWriteOpResult } from "mongoose";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    findAll<T>(query?: Record<string, T>,
           sort?: { [key: string]: SortOrder },
           skip?: number,
           limit?: number): Promise< User[]| null>
    countDocs<T>(query: Record<string, T> ): Promise<number>
    findOtherUser (userId: string): Promise<User[] | null>
    findBlocked(blockedIds: string[]): Promise<User[] | null>;
    findMatches(userPreferences: Preferences, user: User, dobRange: DOBRange): Promise<User[] | null>;

    create(userData: User): Promise<User>;
    createAuthUser(username: string, email: string): Promise<User>;
    updateByEmail(updatedData: SetupUserDTO): Promise <User| null>;
    blockById(userId: string, status: boolean): Promise <boolean | null>
    banById(userId: string, duration: Date): Promise<boolean | null>
    unBanById(userId: string): Promise<boolean | null>;
    updatePassword(userId: string, newPassword: string): Promise<boolean | null>
    unbanExpiredUsers(now: Date): Promise<UpdateWriteOpResult>;
   
    updateProfileById(field: string, value: string, userId: string): Promise<boolean | null>;
    deleteImageById(userId: string, src: string): Promise<boolean | null>
    addImageById(userId: string, src: string[]): Promise<boolean | null>
    changeImageById(imageIndex: number, lastIndex: number ,userId: string, images: string[] | File[]): Promise<boolean | null>

    blockUserById(blockedId: string, userId: string): Promise<User | null>; 
    unblockById(unblockId: string, userId: string): Promise<boolean | null>;
    reportUseById(reportedId: string, userId: string): Promise<User | null>;

    primeValidityCheck(now: Date): Promise<UpdateWriteOpResult>;
    updatePrimeById(userId: string, primeData: Prime): Promise<User | null>;

    addMatches(userId: string, interactorId: string): Promise<boolean>;
    unmatchById(userId: string, interactorId: string): Promise<boolean>
    findMatchedUsers(userId: string): Promise<UserDetails | null>;

    addInterests(userId: string, interactorId: string): Promise<boolean>;
    dashboardData (filterConstraints: DateRange): Promise <UserDashBoardData>
    findNearbyUsers(latitude: number, longitude: number, radius: number): Promise<User[] | null>
    updateUserLocation(userId: string, newLatitude: number, newLongitude: number,  state?: string, country?: string, city?: string ): Promise<User | null>
};
