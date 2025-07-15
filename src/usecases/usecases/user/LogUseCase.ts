import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IToken } from "../../interfaces/IToken";
import { UserAuthDTO, UserDTO } from "../../dtos/UserDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { User } from "../../../domain/entities/User";
import { IS3Client } from "../../interfaces/IS3Client";

export class LogUser {
    private role: string;
    constructor(
        private _userRepository: IUserRepository,
        private _token: IToken,
        private _bcrypt: IBcrypt,
        private _s3: IS3Client
    ) { this.role = "user" };

    generateToken(userId: string, role: string): { accessToken: string; refreshToken: string } {
        try {
            return this._token.generateTokens(userId, role);
        } catch (error) {
            throw new Error("something happend in generateToken");
        }
    }

    async login(email: string, password: string): Promise<{
        user: UserDTO | null;
        tokens: { accessToken: string; refreshToken: string } | null;
        status: boolean | null;
    }> {
        try {
            const user = await this._userRepository.findByEmail(email);

            if (!user) {
                return { user: null, tokens: null, status: null };
            }

            if (user.isBlocked || user.isBanned) {
                return { user: null, tokens: null, status: true };
            }

            const result = user.password
                ? await this._bcrypt.compare(password, user.password)
                : false;
            if (result) {
                const tokens = this.generateToken(user.id, this.role);

                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };
                return {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        imageExpiry: this._s3.urlExpiry,
                        phone: user.phone,
                        lookingFor: user.lookingFor,
                        interestedIn: user.interestedIn,
                        dob: user.dob,
                        setupCompleted: user.setupCompleted,
                        prime: user.prime,
                    },
                    tokens: tokens,
                    status: false,
                };
            }

            return { user: null, tokens: null, status: false };
        } catch (error) {
            throw new Error("something happend in login");
        }
    }

    async loginAuth(name: string, email: string): Promise<{
        user: UserAuthDTO | null;
        tokens: { accessToken: string; refreshToken: string } | null;
        status: boolean;
    }> {
        try {
            const user = await this._userRepository.findByEmail(email);
            if (!user) {
              
                const newUser = new User(crypto.randomUUID(), name, email);
                const createdUser = await this._userRepository.createAuthUser(newUser);
                const tokens = this.generateToken(createdUser.id, this.role);
                if(createdUser?.image){
                    createdUser.image = await Promise.all(
                        createdUser.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };
                return {
                    user: {
                        id: createdUser.id,
                        username: createdUser.username,
                        email: createdUser.email,
                        image: createdUser.image || [],
                        imageExpiry: this._s3.urlExpiry,
                        isBlocked: createdUser.isBlocked ? createdUser.isBlocked : false,
                        setupCompleted: createdUser.setupCompleted,
                    },
                    tokens: tokens,
                    status: false,
                };
            }

            if (user) {
                if (user.isBlocked || user.isBanned) {
                    return { user: null, tokens: null, status: true };
                }
                const tokens = this.generateToken(user.id, this.role);
                
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };
                return {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        dob: user.dob,
                        image: user.image || [],
                        imageExpiry: this._s3.urlExpiry,
                        isBlocked: user.isBlocked ? user.isBlocked : false,
                        interestedIn: user.interestedIn,
                        lookingFor: user.lookingFor,
                        setupCompleted: user.setupCompleted,
                        prime: user.prime,
                    },
                    tokens: tokens,
                    status: false,
                };
            }

            return { user: null, tokens: null, status: false };
        } catch (error) {
            throw new Error("something happend in loginAuth");
        }
    };

    async checkUserStatus(userId: string): Promise<boolean> {
        try {
           const userData = await this._userRepository.findById(userId);
           if(userData?.isBlocked === true || userData?.isBanned === true){
            return true;
           };
           return false;
        } catch (error) {
           throw new Error("Something happend in ChekUserStatus") 
        };
    };
}
