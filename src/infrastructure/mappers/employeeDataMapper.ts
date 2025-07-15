import { EmployeeDocument } from "../persistence/interfaces/IEmployeeModel";
import { Employee } from "../../domain/entities/Employee";
import { EmployeeCreate } from "../../usecases/dtos/EmployeeDTO";
import { EmployeePersistanceType } from "../types/EmployeeTypes";

export function toEmployeeEntityFromDoc(doc: EmployeeDocument): Employee {
    return new Employee({
        id: doc.id,
        name: doc.name,
        email: doc.email,
        isBlocked: doc.isBlocked,
        password: doc.password,
        createdAt: doc.createdAt.toLocaleDateString(),
    });
};

export function toEmployeeEntitiesFromDoc(doc: EmployeeDocument[]): Employee[] {
    return doc.map((d) => (
        new Employee({
            id: d.id,
            name: d.name,
            email: d.email,
            isBlocked: d.isBlocked,
            password: d.password,
            createdAt: d.createdAt.toLocaleDateString()
        })
    ));
};

export function toEmployeePersistance(employee: EmployeeCreate): EmployeePersistanceType{
    return {
        name: employee.name,
        email: employee.email,
        password: employee.password,
    };
};