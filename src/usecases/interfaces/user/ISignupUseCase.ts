import { CreateUserDTO, OtpDTO, SetupUserDTO, SingupDTO, UserLogDTO, VerifyDTO } from "../../dtos/UserDTO";

export interface IUserSignupUseCase {
   signup(signupData: CreateUserDTO): Promise<SingupDTO | null> 
   verifyOTP(otpData: OtpDTO): Promise<VerifyDTO | null>;
   resendOTP(email: string): Promise<boolean | null>;
   setupAccount(accountSetupData: SetupUserDTO, imageFiles: Express.Multer.File[]): Promise<UserLogDTO>
}