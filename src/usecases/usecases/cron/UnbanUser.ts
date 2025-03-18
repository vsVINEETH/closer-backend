import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class UnbanUser {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    try {
      const now = new Date();
      const usersToUnban = await this.userRepository.unbanExpiredUsers(now);
      console.log(usersToUnban)
      console.log(`Unbanned ${usersToUnban.modifiedCount} users.`);
    } catch (error) {
      throw new Error('somethig happend in execute')
    }

  }
}
