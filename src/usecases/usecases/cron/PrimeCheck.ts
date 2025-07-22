import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class PrimeCheck {

  constructor(
    private _userRepository: IUserRepository
  ){}

  async execute() {
    try {
      const now = new Date();
      const validityExpireUsers = await this._userRepository.primeValidityCheck(now)
      console.log(validityExpireUsers)
      console.log(`prime expired ${validityExpireUsers.modifiedCount} users.`);
    } catch (error) {
      throw new Error('something happend in execute')
    }

  }

}