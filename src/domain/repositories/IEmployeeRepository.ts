import { Employee } from "../entities/Employee";
import { EmployeeAccessDTO, EmployeeCreate, EmployeeStats } from "../../usecases/dtos/EmployeeDTO";
import {Filter, SortOrder} from '../../../types/express/index'
export interface IEmployeeRepository {
    findByEmail(email: string): Promise<EmployeeAccessDTO | null>;
    findById(employeeId: string): Promise<EmployeeAccessDTO | null>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<{employee:Employee[], total: number} | null>;
    blockById(employeeId: string, status:boolean): Promise<boolean | null>;
    create(employeeData: EmployeeCreate): Promise<void>;
    updatePassword(employeeId: string, newPssword: string): Promise<boolean | null>
    dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null>
}