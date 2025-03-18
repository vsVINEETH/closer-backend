import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { OtpDTO, UserDTO, forgotPasswordDTO, passwordDTO } from "../../dtos/UserDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IOtp } from "../../interfaces/IOtp";
import { IMailer } from "../../interfaces/IMailer";
import { Preferences} from "../../../../types/express";
import { tempUserStore } from "../../dtos/CommonDTO";
export class Security {
    constructor(
        private userRepository: IUserRepository,
        private bcrypt: IBcrypt,
        private OTP: IOtp,
        private mailer: IMailer
    ){}

    otpExpireation(email: string){
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

    };


    private  objectFormatter = async (userPreferences: Preferences): Promise<Preferences> => {
        try {

            let ageRange;

            if(Array.isArray(userPreferences.ageRange)){
                ageRange = userPreferences.ageRange.map(Number) as [number, number]
            }else{
                ageRange = userPreferences.ageRange?.split(',').map(Number) as [number, number] 
            }
            
            userPreferences = {
                ...userPreferences, 
                distance: Number(userPreferences.distance),
                ageRange: ageRange,
            }
         
            return userPreferences;
        } catch (error) {
            throw new Error('something happend in objectFormatter')
        }
    }

    async changePassword(userId: string, newPasswordData: passwordDTO): Promise<boolean | null> {
        try {
            const user = await this.userRepository.findById(userId);
    
            if (!user) { return null};
    
            const result = user.password ? await this.bcrypt.compare(newPasswordData.currentPassword, user.password): false;
    
            if(result) {
                const hashedPassword = await this.bcrypt.Encrypt(newPasswordData.newPassword);
                await this.userRepository.updatePassword(userId, hashedPassword);
                return true
            }
    
            return null  
        } catch (error) {
            throw new Error('something happend in changePassword')
        }

    }

    async blockUser(blockedId: string, userId:string, userPreferences: Preferences): Promise<UserDTO[] | null> {
        try {
            const result = await this.userRepository.blockUserById(blockedId, userId);
            if(result){
                userPreferences = await this.objectFormatter(userPreferences);
               const users = await this.userRepository.findMatches(userPreferences);
               return users
            }
            return null; 
        } catch (error) {
            throw new Error('something happend in blockUser')
        }

    }

    async blockList(userId: string): Promise<UserDTO[] | null> {
        try {
            const user = await this.userRepository.findById(userId);
            if (user){
                const result = await this.userRepository.findBlocked(userId, user);
                return result ? result : [];
            }
            return null 
        } catch (error) {
           throw new Error('something happend in blockList') 
        }

        
    }

    async unblockUser(unblockId: string, userId: string): Promise<UserDTO[] | null> {
        try {
            const result = await this.userRepository.unblockById(unblockId, userId);
            const user = await this.userRepository.findById(userId)
            if(result && user){
                const result = await this.userRepository.findBlocked(userId, user);
                return result ? result : [];
            }
            return null;  
        } catch (error) {
            throw new Error('something happend in unblockUser')
        }

    }

    async reportUser(reportedId: string, userId: string, userPreferences: Preferences): Promise<UserDTO[] | null> {
        try {
            const result = await this.userRepository.reportUseById(reportedId, userId);
            if(result){
                userPreferences = await this.objectFormatter(userPreferences);
                const users = await this.userRepository.findMatches(userPreferences);
                return users;
            }
            return null;   
        } catch (error) {
            throw new Error('something happend in reportUser')
        }

    }

    async forgotPassword(forgotPasswordData: forgotPasswordDTO): Promise<boolean| null> {
        try {
            const result = await this.userRepository.findByEmail(forgotPasswordData.email);
            if(result){
                const OTP = this.OTP.GenerateOTP();
                console.log(OTP);
                const password = await this.bcrypt.Encrypt(forgotPasswordData.newPassword);
                const htmlOTP = this.mailer.generateOtpEmailContent(OTP);
                this.mailer.SendEmail(forgotPasswordData.email, 'One Time Password', htmlOTP);
    
                tempUserStore[forgotPasswordData.email] = {
                    id: result.id,
                    email: forgotPasswordData.email,
                    password,
                    otp: OTP,
                };
                this.otpExpireation(forgotPasswordData.email);
                return true
            }
            return null;  
        } catch (error) {
            throw new Error('something happend in forgotPassword')
        }

    }

    async verifyOTP(otpData: OtpDTO): Promise<boolean | null> {
        try {
            const result = this.OTP.ValidateOTP(otpData.otp.join("") ,tempUserStore[otpData.email].otp);
            if(result){
              await this.userRepository.updatePassword(tempUserStore[otpData.email].id, tempUserStore[otpData.email].password)
              delete tempUserStore[otpData.email];
              return true
            }
            return null; 
        } catch (error) {
           throw new Error('something happend in verifyOTP') 
        }

    }

    async resendOTP(email: string): Promise<boolean | null>{
        try {
            const userData = tempUserStore[email];
            if(!userData){return null};
    
            const newOTP = this.OTP.GenerateOTP();
            tempUserStore[email].otp = newOTP;
            console.log(newOTP);
    
            const htmlOTP = this.mailer.generateOtpEmailContent(newOTP);
            this.mailer.SendEmail(email, 'One Time Password', htmlOTP);
            this.otpExpireation(email);
            return true  
        } catch (error) {
            throw new Error('somethign happend in resendOTP')
        }

    }
}