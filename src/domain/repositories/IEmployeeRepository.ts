import { Employee } from "../entities/Employee";
import { EmployeeAccessDTO, EmployeeCreate, EmployeeStats } from "../../usecases/dtos/EmployeeDTO";
import {Filter, SortOrder} from '../../../types/express/index'
import { EmployeeDocument } from "../../infrastructure/persistence/interfaces/IEmployeeModel";
export interface IEmployeeRepository {
    findByEmail(email: string): Promise<EmployeeDocument | null>;
    findById(employeeId: string): Promise<EmployeeDocument | null>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<EmployeeDocument[]| null>;
    countDocs<T>(query: Record<string, T>): Promise<number>;
    blockById(employeeId: string, status:boolean): Promise<boolean | null>;
    create(employeeData: EmployeeCreate): Promise<void>;
    updatePassword(employeeId: string, newPssword: string): Promise<boolean | null>
    dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null>
}