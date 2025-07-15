import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class UnbanUser {
  constructor(
    private _userRepository: IUserRepository
  ){}
  async execute() {
    try {
      const now = new Date();
      const usersToUnban = await this._userRepository.unbanExpiredUsers(now);
      console.log(usersToUnban)
      console.log(`Unbanned ${usersToUnban.modifiedCount} users.`);
    } catch (error) {
      throw new Error('somethig happend in execute')
    }

  }
}
