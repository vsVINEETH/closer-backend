import { Filter } from "../../../../types/express";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { EmployeeStats } from "../../dtos/EmployeeDTO";
import { EmployeeUseCaseResponse } from "../../types/EmployeeTypes";

export interface IEmployeeManagementUseCase {
    fetchData(options: SearchFilterSortParams): Promise<EmployeeUseCaseResponse | null>;
    createEmployee(employeeName: string, email: string, query: SearchFilterSortParams): Promise<EmployeeUseCaseResponse| null>
    blockEmployee(employeeId: string, query: SearchFilterSortParams): Promise<EmployeeUseCaseResponse | null>
    dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null>;
};