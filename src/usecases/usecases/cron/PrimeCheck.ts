import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class PrimeCheck {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    try {
      const now = new Date();
      const validityExpireUsers = await this.userRepository.primeValidityCheck(now)
      console.log(validityExpireUsers)
      console.log(`prime expired ${validityExpireUsers.modifiedCount} users.`);
    } catch (error) {
      throw new Error('something happend in execute')
    }

  }

}