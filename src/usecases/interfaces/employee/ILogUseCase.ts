import { EmployeeLogDTO } from "../../dtos/EmployeeDTO";

export interface IEmployeeLogUseCase {
    login(email: string, password: string): Promise<EmployeeLogDTO>;
    checkUserStatus(userId: string): Promise<boolean>;
};