import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserDTO, CreateUserDTO, SingupDTO, OtpDTO, VerifyDTO, SetupUserDTO } from "../../dtos/UserDTO";
import { User } from "../../../domain/entities/User";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IMailer } from "../../interfaces/IMailer";
import { IOtp } from "../../interfaces/IOtp";
import { IToken } from "../../interfaces/IToken";
import { tempUserStore } from "../../dtos/CommonDTO";
import { IS3Client } from "../../interfaces/IS3Client";

export class SignupUser {
    private role: string;
    constructor(
        private userRepository: IUserRepository,
        private mailer: IMailer,
        private bcrypt: IBcrypt,
        private OTP: IOtp,
        private token: IToken,
        private s3: IS3Client,
    ) { this.role = 'user' }

    generateToken(userId: string): { accessToken: string, refreshToken: string } {
        try {
            return this.token.generateTokens(userId, this.role)
        } catch (error) {
            throw new Error('something happend in generateToken')
        }

    }

    otpExpireation(email: string) {
        try {
            setTimeout(() => {
                if (tempUserStore[email]) {
                    delete tempUserStore[email].otp;
                    console.log(`OTP for ${email} has expired and been removed.`);
                }
            }, 60000);
        } catch (error) {
            throw new Error('something happend in otpExpireation')
        }

    }

    async signup(signupData: CreateUserDTO): Promise<SingupDTO | null> {
        try {
            const existingUser = await this.userRepository.findByEmail(signupData.email);
            if (existingUser) { return null };

            const OTP = this.OTP.GenerateOTP()
            console.log(OTP)
            const password = await this.bcrypt.Encrypt(signupData.password);
            const htmlOTP = this.mailer.generateOtpEmailContent(OTP);
            this.mailer.SendEmail(signupData.email, 'One Time Password', htmlOTP);

            tempUserStore[signupData.email] = {
                username: signupData.username,
                email: signupData.email,
                password,
                phone: signupData.phone,
                otp: OTP,
            };

            this.otpExpireation(signupData.email);

            return { username: tempUserStore[signupData.email].username, email: tempUserStore[signupData.email].email };
        } catch (error) {
            throw new Error('something happend in signup')
        }

    }


    async verifyOTP(otpData: OtpDTO): Promise<VerifyDTO | null> {
        try {
            const result = this.OTP.ValidateOTP(otpData.otp.join(""), tempUserStore[otpData.email].otp);
            if (result) {
                const newUser = new User(
                    crypto.randomUUID(),
                    tempUserStore[otpData.email].username,
                    tempUserStore[otpData.email].email,
                    tempUserStore[otpData.email].password,
                    tempUserStore[otpData.email].phone,
                );

                await this.userRepository.create(newUser);
                delete tempUserStore[otpData.email];
                return { username: newUser.username, email: newUser.email }
            }
            return null;
        } catch (error) {
            throw new Error('something happend in verifyOTP')
        }

    };

    async resendOTP(email: string): Promise<boolean | null> {
        try {
            const userData = tempUserStore[email];
            if (!userData) {
                return null; // No such user data exists
            }

            const newOTP = this.OTP.GenerateOTP();
            tempUserStore[email].otp = newOTP;
            console.log(newOTP);


            const htmlOTP = this.mailer.generateOtpEmailContent(newOTP)
            this.mailer.SendEmail(email, 'One Time Password', htmlOTP);
            this.otpExpireation(email);
            return true
        } catch (error) {
            throw new Error('something happend in resendOTP')
        }

    }

    async setupAccount(accountSetupData: SetupUserDTO, imageFiles: Express.Multer.File[]): Promise<{ user: UserDTO | null, tokens: { accessToken: string, refreshToken: string } | null }> {
        try {
            const image: string[] = [];
            for(let post of imageFiles){
               const fileName = await this.s3.uploadToS3(post);
               image.push(fileName);
            };

            const user = await this.userRepository.update({...accountSetupData, image});
            if (user && user.image) {
               user.image = await Promise.all (user.image.map(async (val) => await this.s3.retrieveFromS3(val as string)) )
                const tokens = this.generateToken(user.id);
                return {
                    user: {
                        id: user.id,
                        username: user.username,
                        image: user.image,
                        email: user.email,
                        setupCompleted: user.setupCompleted,
                        prime: user.prime,
                    },
                    tokens: tokens
                }
            };
            return { user: null, tokens: null };
        } catch (error) {
            throw new Error('something happend in setupAccount')
        };
    };
}