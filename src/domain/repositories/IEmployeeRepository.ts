import { Employee } from "../entities/Employee";
import { EmployeeStats } from "../../usecases/dtos/EmployeeDTO";
import {Filter, SortOrder} from '../../../types/express/index'
import { EmployeePersistanceType } from "../../infrastructure/types/EmployeeTypes";
export interface IEmployeeRepository {
    findByEmail(email: string): Promise<Employee | null>;
    findById(employeeId: string): Promise<Employee | null>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<Employee[]| null>;
    countDocs<T>(query: Record<string, T>): Promise<number>;
    blockById(employeeId: string, status:boolean): Promise<boolean | null>;
    create(employeeData: EmployeePersistanceType): Promise<Employee>;
    update(employeeId: string, password:{password: string}): Promise<Employee | null>
    dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null>
};