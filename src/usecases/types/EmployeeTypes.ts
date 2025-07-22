import { Employee } from "../../domain/entities/Employee";
import { EmployeeDTO } from "../dtos/EmployeeDTO";

export type EmployeeUseCaseResponse = { employee: EmployeeDTO[]; total: number };