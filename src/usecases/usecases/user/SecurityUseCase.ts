import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { MatchedUserDTO, OtpDTO, UserDTO, forgotPasswordDTO, passwordDTO } from "../../dtos/UserDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IOtp } from "../../interfaces/IOtp";
import { IMailer } from "../../interfaces/IMailer";
import { Preferences} from "../../../../types/express";
import { tempUserStore } from "../../dtos/CommonDTO";
import { IS3Client } from "../../interfaces/IS3Client";
import { toMatchedUsersDTOs, toUserBlockedListDTO, toUserDTO } from "../../../interfaces/mappers/userDTOMapper";
import { dobRangeFinder } from "../../../interfaces/utils/dobRangeFinder";
import { IUserSecurityUseCase } from "../../interfaces/user/ISecurityUseCase";

export class Security implements IUserSecurityUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _bcrypt: IBcrypt,
        private _OTP: IOtp,
        private _mailer: IMailer,
        private _s3: IS3Client,
    ){}

   private _otpExpireation(email: string){
        try {
            setTimeout(() => {
                if (tempUserStore[email]) {
                    delete tempUserStore[email].otp;
                    console.log(`OTP for ${email} has expired and been removed.`);
                }
            }, 60000);  
        } catch (error) {
            throw new Error('something happend in otpExpireation')
        };
    };

    private  _objectFormatter = async (userPreferences: Preferences): Promise<Preferences> => {
        try {

            let ageRange;
            if(Array.isArray(userPreferences.ageRange)){
                ageRange = userPreferences.ageRange.map(Number) as [number, number]
            }else{
                ageRange = userPreferences.ageRange?.split(',').map(Number) as [number, number] 
            };
            
            userPreferences = {
                ...userPreferences, 
                distance: Number(userPreferences.distance),
                ageRange: ageRange,
            };
         
            return userPreferences;
        } catch (error) {
            throw new Error('something happend in objectFormatter')
        };
    };

    async changePassword(userId: string, newPasswordData: passwordDTO): Promise<boolean | null> {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) return null;

            const result = user.password ? await this._bcrypt.compare(newPasswordData.currentPassword, user.password): false;
            if(result) {
                const hashedPassword = await this._bcrypt.Encrypt(newPasswordData.newPassword);
                await this._userRepository.updatePassword(userId, hashedPassword);
                return true;
            };
    
            return null;  
        } catch (error) {
            throw new Error('something happend in changePassword')
        };
    };

    async blockUser(blockedId: string, userId:string, userPreferences: Preferences): Promise<MatchedUserDTO[] | null> {
        try {
            const user = await this._userRepository.blockUserById(blockedId, userId);
            if(user){
               userPreferences = await this._objectFormatter(userPreferences);
               const matches = await this._userRepository.findMatches(userPreferences, user, dobRangeFinder(userPreferences));
               return matches ? toMatchedUsersDTOs(matches): null;
            };
            return null; 
        } catch (error) {
            throw new Error('something happend in blockUser')
        };
    };

    async blockList(userId: string): Promise<UserDTO[] | null> {
        try {
            const user = await this._userRepository.findById(userId);
            if (user){

                 const blockedUsersIds = user.blockedUsers ?
                 user.blockedUsers.map((userId) => userId) : [];

                 const blockedUsers = await this._userRepository.findBlocked( blockedUsersIds);

                if (blockedUsers) {
                    await Promise.all(
                        blockedUsers.map(async (doc) => {
                            if (doc.image) {
                                doc.image = await Promise.all(
                                    doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                                );
                            };
                        })
                    );
                };
                return blockedUsers ? toUserBlockedListDTO(blockedUsers) : [];
            };
            return null; 
        } catch (error) {
           throw new Error('something happend in blockList') 
        };
    };

    async unblockUser(unblockId: string, userId: string): Promise<UserDTO[] | null> {
        try {
            const result = await this._userRepository.unblockById(unblockId, userId);
            const user = await this._userRepository.findById(userId)

            if(result && user){
                 const blockedUsersIds = user.blockedUsers ?
                 user.blockedUsers.map((userId) => userId) : [];

                const blockedUsers = await this._userRepository.findBlocked(blockedUsersIds);
                return blockedUsers ? toUserBlockedListDTO(blockedUsers) : [];
            };
            return null;  
        } catch (error) {
            throw new Error('something happend in unblockUser');
        };
    };

    async reportUser(reportedId: string, userId: string, userPreferences: Preferences): Promise<MatchedUserDTO[] | null> {
        try {
            const user = await this._userRepository.reportUseById(reportedId, userId);
            if(user){
                userPreferences = await this._objectFormatter(userPreferences);
                const matches = await this._userRepository.findMatches(userPreferences, user, dobRangeFinder(userPreferences));
                return matches ? toMatchedUsersDTOs(matches) : null;
            };
            return null;   
        } catch (error) {
            throw new Error('something happend in reportUser');
        };
    };

    async forgotPassword(forgotPasswordData: forgotPasswordDTO): Promise<boolean| null> {
        try {
            const user = await this._userRepository.findByEmail(forgotPasswordData.email);
            
            if(user){
                const OTP = this._OTP.GenerateOTP();
                const password = await this._bcrypt.Encrypt(forgotPasswordData.newPassword);
                const htmlOTP = this._mailer.generateOtpEmailContent(OTP);
                
                this._mailer.SendEmail(forgotPasswordData.email, 'One Time Password', htmlOTP);
    
                tempUserStore[forgotPasswordData.email] = {
                    id: user.id,
                    email: forgotPasswordData.email,
                    password,
                    otp: OTP,
                };

                this._otpExpireation(forgotPasswordData.email);
                return true;
            }
            return null;  
        } catch (error) {
            throw new Error('something happend in forgotPassword')
        };
    };

    async verifyOTP(otpData: OtpDTO): Promise<boolean | null> {
        try {
            const result = this._OTP.ValidateOTP(otpData.otp.join("") ,tempUserStore[otpData.email].otp);
            if(result){
              await this._userRepository.updatePassword(tempUserStore[otpData.email].id, tempUserStore[otpData.email].password)
              delete tempUserStore[otpData.email];
              return true;
            };
            return null; 
        } catch (error) {
           throw new Error('something happend in verifyOTP') 
        };
    };

    async resendOTP(email: string): Promise<boolean | null>{
        try {

            const userData = tempUserStore[email];
            if(!userData){return null};
    
            const newOTP = this._OTP.GenerateOTP();
            tempUserStore[email].otp = newOTP;
    
            const htmlOTP = this._mailer.generateOtpEmailContent(newOTP);
            this._mailer.SendEmail(email, 'One Time Password', htmlOTP);
            this._otpExpireation(email);

            return true;
        } catch (error) {
            throw new Error('somethign happend in resendOTP')
        };
    };

};