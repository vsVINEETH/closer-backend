import { IEmployeeDocument } from "../persistence/interfaces/IEmployeeModel";
import { Employee } from "../../domain/entities/Employee";
import { EmployeeCreate } from "../../usecases/dtos/EmployeeDTO";
import { EmployeePersistanceType } from "../types/EmployeeTypes";

export function toEmployeeEntityFromDoc(doc: IEmployeeDocument): Employee {
    try {
        return new Employee({
            id: doc.id,
            name: doc.name,
            email: doc.email,
            isBlocked: doc.isBlocked,
            password: doc.password,
            createdAt: doc.createdAt.toLocaleDateString(),
        });  
    } catch (error) {
       throw new Error('Something happend in toEmployeeEntityFromDoc') 
    };
};

export function toEmployeeEntitiesFromDoc(doc: IEmployeeDocument[]): Employee[] {
    try {
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
    } catch (error) {
      throw new Error('Something happend in toEmployeeEntitiesFromDoc')  
    };
};

export function toEmployeePersistance(employee: EmployeeCreate): EmployeePersistanceType{
    try {
     return {
        name: employee.name,
        email: employee.email,
        password: employee.password,
     }; 
    } catch (error) {
      throw new Error('Something happend in toEmployeePersistance')  
    };
};