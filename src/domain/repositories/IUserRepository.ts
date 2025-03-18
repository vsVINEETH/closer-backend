import { User } from "../entities/User";
import { SetupUserDTO, UserDTO } from "../../usecases/dtos/UserDTO";
import { SortOrder } from "../../infrastructure/config/database";
import { Filter, Preferences } from "../../../types/express/index";
import { UserDetails } from "../../usecases/dtos/ChatDTO";
import { Prime } from "../../usecases/dtos/SubscriptionDTO";
import { UpdateWriteOpResult } from "mongoose";
export interface IUserRepository {
    findByEmail(email: string): Promise<UserDTO | null>;
    findById(userId: string): Promise<UserDTO | null>;
    findAll<T>(query?: Record<string, T>,
           sort?: { [key: string]: SortOrder },
           skip?: number,
           limit?: number): Promise<{users: UserDTO[], total: number}| null>
    findOtherUser (userId: string): Promise<UserDTO[] | null>
    findBlocked(userId: string, user:UserDTO): Promise<UserDTO[] | null>;
    findMatches(userPreferences: Preferences): Promise<UserDTO[] | null>;

    create(userData: User): Promise<void>;
    createAuthUser(userData: User): Promise<UserDTO>;
    update(updatedData: SetupUserDTO): Promise <UserDTO | null>;
    blockById(userId: string, status: boolean): Promise <boolean | null>
    banById(userId: string, duration: Date): Promise<boolean | null>
    unBanById(userId: string): Promise<boolean | null>;
    updatePassword(userId: string, newPassword: string): Promise<boolean | null>
    unbanExpiredUsers(now: Date): Promise<UpdateWriteOpResult>;
   
    updateProfileById(field: string, value: string, userId: string): Promise<boolean | null>;
    deleteImageById(userId: string, src: string): Promise<boolean | null>
    addImageById(userId: string, src: string[]): Promise<boolean | null>
    changeImageById(imageIndex: number, userId: string): Promise<boolean | null>

    blockUserById(blockedId: string, userId: string): Promise<boolean | null>; 
    unblockById(unblockId: string, userId: string): Promise<boolean | null>;
    reportUseById(reportedId: string, userId: string): Promise<boolean | null>;

    primeValidityCheck(now: Date): Promise<UpdateWriteOpResult>;
    updatePrimeById(userId: string, primeData: Prime): Promise<UserDTO | null>;

    addMatches(userId: string, interactorId: string): Promise<boolean>;
    unmatchById(userId: string, interactorId: string): Promise<boolean>
    findMatchedUsers(userId: string): Promise<UserDetails | null>;

    addInterests(userId: string, interactorId: string): Promise<boolean>;
    dashboardData (filterConstraints: Filter): Promise <unknown>
    findNearbyUsers(latitude: number, longitude: number, radius: number): Promise<User[] | null>
    updateUserLocation(userId: string, newLatitude: number, newLongitude: number,  state?: string, country?: string, city?: string ): Promise<User | null>
}
