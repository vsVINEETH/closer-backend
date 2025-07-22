import { Filter } from "../../../../types/express";
import { UserUseCaseResponseType } from "../../../infrastructure/types/UserType";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { UserDashBoardData } from "../../dtos/UserDTO";

export interface IUserManagementUseCase {
    fetchData(options: SearchFilterSortParams): Promise<UserUseCaseResponseType| null>
    blockUser(userId: string, query: SearchFilterSortParams): Promise<UserUseCaseResponseType| null>
    banUser(userId: string, duration: string, query: SearchFilterSortParams): Promise<UserUseCaseResponseType | null>
    unBanUser(userId: string, query: SearchFilterSortParams): Promise<UserUseCaseResponseType| null>
    dashboardUserData(filterConstraints: Filter ): Promise<UserDashBoardData>
};