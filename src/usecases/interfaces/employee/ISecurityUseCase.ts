import { passwordDTO } from "../../dtos/EmployeeDTO";

export interface IEmployeeSecurityUseCase {
   changePassword(employeeId: string, newPasswordData: passwordDTO): Promise<boolean | null> 
};