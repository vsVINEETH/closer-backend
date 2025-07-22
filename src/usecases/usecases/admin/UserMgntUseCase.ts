import { Filter } from "../../../../types/express/index";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { UserDashBoardData, UserDashBoardDTO } from "../../dtos/UserDTO";
import { paramToQueryUsers } from "../../../interfaces/utils/paramToQuery";
import { UserUseCaseResponseType } from "../../../infrastructure/types/UserType";
import { toDashboardDTO, toUserListingDTO } from "../../../interfaces/mappers/userDTOMapper";
import { dateRangeSetter } from "../../../interfaces/utils/dateRangeSetter";
import { IUserManagementUseCase } from "../../interfaces/admin/IUserMgntUseCase";

export class UserManagement implements IUserManagementUseCase{
  constructor(
    private _userRepository: IUserRepository
  ) { }

    private async _fetchAndEnrich(query: SearchFilterSortParams): Promise<UserUseCaseResponseType> {
        try {
            const queryResult = await paramToQueryUsers(query);
       
            const total = await this._userRepository.countDocs(queryResult.query);
            const users = await this._userRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );

            const userListingData = users ? toUserListingDTO(users) : [];

            return { users: userListingData, total: total ?? 0 };  
        } catch (error) {
            throw new Error('Something happend fetchAndEnrich')
        };
    };

  async fetchData(options: SearchFilterSortParams): Promise<UserUseCaseResponseType| null> {
    try {
       const usersData = await this._fetchAndEnrich(options);
       return usersData ?? null;
    } catch (error) {
      throw new Error('something happend in fetchData')
    }
  };

  async blockUser(userId: string, query: SearchFilterSortParams): Promise<UserUseCaseResponseType| null> {
    try {
       const user = await this._userRepository.findById(userId);
       if (user) {
        const status: boolean = !user.isBlocked;
        const result = await this._userRepository.blockById(userId, status);
        
        if (result) {
          const userData = await this._fetchAndEnrich(query);
          return userData ?? null;
        };
      };
      return null;
    } catch (error) {
      throw new Error('something happend blockUser')
    };
  };

  async banUser(userId: string, duration: string, query: SearchFilterSortParams): Promise<UserUseCaseResponseType | null> {
    try {
     
        const banExpireAt = new Date();
        banExpireAt.setDate(banExpireAt.getDate() + parseInt(duration));
        const result = await this._userRepository.banById(userId, banExpireAt);

        if (result) {
          const usersData = await this._fetchAndEnrich(query);
          return usersData ?? null;
        };

        return null;
    } catch (error) {
      throw new Error('something happend in banUser')
    };
  };

  async unBanUser(userId: string, query: SearchFilterSortParams): Promise<UserUseCaseResponseType| null> {
    try {
      const user = await this._userRepository.unBanById(userId);
      if (user) {
        const usersData = await this._fetchAndEnrich(query);
        return usersData ?? null;
      };
      return null;
    } catch (error) {
      throw new Error('something happend in unBanUser')
    };
  };

  async dashboardUserData(filterConstraints: Filter ): Promise<UserDashBoardDTO> {
    try {
      const formatedDate = dateRangeSetter(filterConstraints);
      const result = await this._userRepository.dashboardData(formatedDate);
      return toDashboardDTO(result);
    } catch (error) {
      throw new Error('something happend in dashboardUserData')
    };
  };

};
