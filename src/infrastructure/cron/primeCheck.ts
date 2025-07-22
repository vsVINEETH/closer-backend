import cron from 'node-cron';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PrimeCheck } from '../../usecases/usecases/cron/PrimeCheck';

const userRepository: IUserRepository = new UserRepository();
const primeCheck = new PrimeCheck(userRepository);

cron.schedule('* * * * *', async () => {
    try {
      console.log('Checking for users prime validity...');
      await primeCheck.execute();
    } catch (error) {
      console.error('Error in unban scheduler:', error);
    }
});