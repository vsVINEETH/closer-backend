import { Admin } from "../../../domain/entities/Admin";
import { IAdminRepository } from "../../../domain/repositories/IAdminRepository";
import { AdminDTO } from "../../dtos/AdminDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IToken } from "../../interfaces/IToken";
import { toAdminEntity, toAdminDTO } from "../../mappers/AdminMapper";


export class LogAdmin {
    private role: string;
    constructor(
        private _adminRepository: IAdminRepository,
        private _token: IToken,
        private _bcrypt: IBcrypt,
    ) { this.role = 'admin' }

    generateToken(userId: string, role: string): { accessToken: string, refreshToken: string } {
        try {
            return this._token.generateTokens(userId, role);
        } catch (error) {
            throw new Error('something in generateToken')
        };
    };

    async login(email: string, password: string): Promise<{ admin: Admin | null, tokens: { accessToken: string, refreshToken: string } | null }> {
        try {
            const admin = await this._adminRepository.findByEmail(email);
            
            if(admin){
                const result = admin.password ? await this._bcrypt.compare(password, admin.password) : false;
                if (result) {
                    const tokens = this.generateToken(admin.id, this.role);
                    return {
                        admin: admin,
                        tokens: tokens
                    };
                };
            };

            return { admin: null, tokens: null }
        } catch (error) {
            throw new Error('something happend in login')
        }
    }

}
