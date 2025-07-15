import { Filter } from "../../../../types/express/index";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { UserDTO } from "../../dtos/UserDTO";
import { paramToQueryUsers } from "../../../interfaces/utils/paramToQuery";
export class UserManagement {
  constructor(
    private _userRepository: IUserRepository
  ) { }

  async fetchData(options: SearchFilterSortParams): Promise<{users: UserDTO[], total: number }| null> {
    try {
       const queryResult = await paramToQueryUsers(options);
       const usersData = await this._userRepository.findAll(
        queryResult.query,
        queryResult.sort,
        queryResult.skip,
        queryResult.limit
       );

      return usersData ? {users: usersData.users, total: usersData.total } : null;
    } catch (error) {
      throw new Error('something happend in fetchData')
    }

  }

  async blockUser(userId: string, query: SearchFilterSortParams): Promise<{users: UserDTO[], total: number }| null> {
    try {
      const user = await this._userRepository.findById(userId);
      if (user) {
        const status: boolean = !user.isBlocked;

        const result = await this._userRepository.blockById(userId, status);
        if (result) {
          const queryResult = await paramToQueryUsers(query);
          const usersData = await this._userRepository.findAll(
            queryResult.query,
            queryResult.sort,
            queryResult.skip,
            queryResult.limit
          );

          return usersData ?  {users: usersData.users, total: usersData.total } : null;
        }

      }

      return null;
    } catch (error) {
      throw new Error('something happend blockUser')
    }

  }

  async banUser(userId: string, duration: string, query: SearchFilterSortParams): Promise<{users: UserDTO[], total: number } | null> {
    try {
      const banExpireAt = new Date();
      banExpireAt.setDate(banExpireAt.getDate() + parseInt(duration));
      const result = await this._userRepository.banById(userId, banExpireAt);
      if (result) {
        const queryResult = await paramToQueryUsers(query);
        const usersData = await this._userRepository.findAll(
          queryResult.query,
          queryResult.sort,
          queryResult.skip,
          queryResult.limit
        );

        return usersData ?  {users: usersData.users, total: usersData.total } : null;
      }

      return null
    } catch (error) {
      throw new Error('something happend in banUser')
    }

  }

  async unBanUser(userId: string, query: SearchFilterSortParams): Promise<{users: UserDTO[], total: number }| null> {
    try {
      const user = await this._userRepository.unBanById(userId);
      if (user) {
        const queryResult = await paramToQueryUsers(query);
        const usersData = await this._userRepository.findAll(
          queryResult.query,
          queryResult.sort,
          queryResult.skip,
          queryResult.limit
        );

        return usersData ?  {users: usersData.users, total: usersData.total } : null;
      }
      return null
    } catch (error) {
      throw new Error('something happend in unBanUser')
    }

  }

  async dashboardUserData(filterConstraints: Filter ): Promise<unknown> {
    try {
      
      const result = await this._userRepository.dashboardData(filterConstraints);
      if(!result){ return null}
      return result;
    } catch (error) {
      throw new Error('something happend in dashboardUserData')
    }
  }
}
