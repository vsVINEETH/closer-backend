import { UserLogDTO } from "../../dtos/UserDTO";

export interface IUserLogUseCase {
    login(email: string, password: string): Promise<UserLogDTO>
    loginAuth(name: string, email: string): Promise<UserLogDTO>
    checkUserStatus(userId: string): Promise<boolean>
}