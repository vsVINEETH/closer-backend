import { Employee } from "../../domain/entities/Employee";

export type EmployeeUseCaseResponse = { employee: Employee[]; total: number };