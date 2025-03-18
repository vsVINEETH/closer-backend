import { IAdminRepository } from "../../../domain/repositories/IAdminRepository";
import { AdminDTO } from "../../dtos/AdminDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IToken } from "../../interfaces/IToken";

export class LogAdmin {
    private role: string;
    constructor(
        private adminRepository: IAdminRepository,
        private token: IToken,
        private bcrypt: IBcrypt,
    ) { this.role = 'admin' }

    generateToken(userId: string, role: string): { accessToken: string, refreshToken: string } {
        try {
            return this.token.generateTokens(userId, role);
        } catch (error) {
            throw new Error('something in generateToken')
        }
    }


    async login(email: string, password: string): Promise<{ admin: AdminDTO | null, tokens: { accessToken: string, refreshToken: string } | null }> {
        try {
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) { return { admin: null, tokens: null } }

            const result = admin.password ? await this.bcrypt.compare(password, admin.password) : false;
            if (result) {
                const tokens = this.generateToken(admin.id, this.role);
                return {
                    admin: {
                        id: admin.id,
                        email: admin.email,
                    },
                    tokens: tokens
                }
            }

            return { admin: null, tokens: null }
        } catch (error) {
            throw new Error('something happend in login')
        }
    }

}
