import { EmployeeDocument } from "../persistence/interfaces/IEmployeeModel";

export type EmployeePersistanceType = Pick <EmployeeDocument, "name" | "email" | "password">