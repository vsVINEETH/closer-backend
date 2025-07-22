import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IToken } from "../../interfaces/IToken";
import { UserLogDTO } from "../../dtos/UserDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { User } from "../../../domain/entities/User";
import { IS3Client } from "../../interfaces/IS3Client";
import { toUserDTO } from "../../../interfaces/mappers/userDTOMapper";
import { IUserLogUseCase } from "../../interfaces/user/ILogUseCase";

export class LogUser implements IUserLogUseCase {
    private role: string;
    constructor(
        private _userRepository: IUserRepository,
        private _token: IToken,
        private _bcrypt: IBcrypt,
        private _s3: IS3Client
    ) { this.role = "user" };

   private _generateToken(userId: string, role: string): { accessToken: string; refreshToken: string } {
        try {
            return this._token.generateTokens(userId, role);
        } catch (error) {
            throw new Error("something happend in generateToken");
        };
    };

    async login(email: string, password: string): Promise<UserLogDTO> {
        try {
            const user = await this._userRepository.findByEmail(email);
            if (!user) return { user: null, tokens: null, status: null };
            if(user.isBlocked || user.isBanned) return { user: null, tokens: null, status: true };

            const result = user.password
                ? await this._bcrypt.compare(password, user.password)
                : false;

            if (result) {
                const tokens = this._generateToken(user.id, this.role);

                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };

                return {
                    user: {...toUserDTO(user),imageExpiry: this._s3.urlExpiry},
                    tokens: tokens,
                    status: false,
                };
            };

            return { user: null, tokens: null, status: false };
        } catch (error) {
            throw new Error("something happend in login");
        };
    };

    async loginAuth(name: string, email: string): Promise<UserLogDTO> {
        try {
            const user = await this._userRepository.findByEmail(email);
            if (!user) {
              
                const createdUser = await this._userRepository.createAuthUser(name, email);
                const tokens = this._generateToken(createdUser.id, this.role);
                
                if(createdUser?.image){

                    createdUser.image = await Promise.all(
                        createdUser.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };

                return {
                    user: {...toUserDTO(createdUser),imageExpiry: this._s3.urlExpiry},
                    tokens: tokens,
                    status: false,
                };
            };

            if (user) {

                if (user.isBlocked || user.isBanned) {
                    return { user: null, tokens: null, status: true };
                };

                const tokens = this._generateToken(user.id, this.role);
                if(user?.image){
                    user.image = await Promise.all(
                        user.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                };
                return {
                    user: {...toUserDTO(user), imageExpiry: this._s3.urlExpiry},
                    tokens: tokens,
                    status: false,
                };
            };
            return { user: null, tokens: null, status: false };
        } catch (error) {
            throw new Error("something happend in loginAuth");
        };
    };

    async checkUserStatus(userId: string): Promise<boolean> {
        try {
           const userData = await this._userRepository.findById(userId);
           return (userData?.isBlocked === true) || (userData?.isBanned === true)
        } catch (error) {
           throw new Error("Something happend in ChekUserStatus") 
        };
    };
};
