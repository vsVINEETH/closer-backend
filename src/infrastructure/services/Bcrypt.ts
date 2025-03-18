import bcrypt from 'bcryptjs';
import { IBcrypt } from '../../usecases/interfaces/IBcrypt';

export class Bcrypt implements IBcrypt {
    private salteRounds = 10;

    async Encrypt(data: string): Promise<string> {
        return await bcrypt.hash(data, this.salteRounds);
    }

    async compare(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword)
    }
}