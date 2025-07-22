import cron from 'node-cron';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UnbanUser } from '../../usecases/usecases/cron/UnbanUser';

const userRepository: IUserRepository = new UserRepository();
const unbanUser = new UnbanUser(userRepository);

cron.schedule('* * * * *', async () => {
    try {
      console.log('Checking for users to unban...');
      await unbanUser.execute();
    } catch (error) {
      console.error('Error in unban scheduler:', error);
    }
});