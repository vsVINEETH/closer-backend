import { IEmployeeDocument } from "../persistence/interfaces/IEmployeeModel";

export type EmployeePersistanceType = Pick <IEmployeeDocument, "name" | "email" | "password">