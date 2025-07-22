import { Preferences } from "../../../../types/express";
import { forgotPasswordDTO, MatchedUserDTO, OtpDTO, passwordDTO, UserDTO } from "../../dtos/UserDTO";

export interface IUserSecurityUseCase {
    changePassword(userId: string, newPasswordData: passwordDTO): Promise<boolean | null>
    blockUser(blockedId: string, userId:string, userPreferences: Preferences): Promise<MatchedUserDTO[] | null>
    blockList(userId: string): Promise<UserDTO[] | null>
    unblockUser(unblockId: string, userId: string): Promise<UserDTO[] | null>
    reportUser(reportedId: string, userId: string, userPreferences: Preferences): Promise<MatchedUserDTO[] | null>
    forgotPassword(forgotPasswordData: forgotPasswordDTO): Promise<boolean| null>
    verifyOTP(otpData: OtpDTO): Promise<boolean | null>;
    resendOTP(email: string): Promise<boolean | null>;
}