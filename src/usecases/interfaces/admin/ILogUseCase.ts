import { AdminLogDTO } from "../../dtos/AdminDTO";

export  interface IAdminLogUseCase {
 login(email: string, password: string): Promise<AdminLogDTO>    
}