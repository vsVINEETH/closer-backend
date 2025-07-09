import { EmployeeDocument } from "../../infrastructure/persistence/interfaces/IEmployeeModel";
import { Employee } from "../../domain/entities/Employee";
import { EmployeeDTO, EmployeeStats, EmployeeCreate, EmployeeAccessDTO } from "../dtos/EmployeeDTO";

export function toEntities(doc: EmployeeDocument[] | null): Employee[] | null {
    try {
      if (!doc) {return null};
      
      const employees = doc.map(
        (emp) =>
          new Employee(
            emp.id,
            emp.name,
            emp.email,
            '',
            emp.isBlocked,
            emp.createdAt.toLocaleDateString()
          )
      );

      return employees;   
    } catch (error) {
        throw new Error('Something happend in toEntities')
    };

  };

export function toDTOs(employees: Employee[]):{ employee:EmployeeAccessDTO[]}  {
    try {
       return { employee: employees }; 
    } catch (error) {
     throw new Error('Something happend in toDTOs')
    };
 
};

export function toDTO(employeeData: Employee): EmployeeAccessDTO{
    try {
       return {
         id:employeeData.id,
         name: employeeData.name,
         email:employeeData.email,
         password: employeeData.password,
         isBlocked: employeeData.isBlocked,
         createdAt: employeeData.createdAt
       }; 
    } catch (error) {
     throw new Error('Something happend in toDTOs')
    };
};

export function toEntity(employeesDoc: EmployeeDocument ): Employee | null {
    try {
        if(!employeesDoc) return null;
        return new Employee(
            employeesDoc.id,
            employeesDoc.name,
            employeesDoc.email,
            employeesDoc.password,
            employeesDoc.isBlocked,
            employeesDoc.createdAt.toLocaleDateString(),
        );
    } catch (error) {
       throw new Error('Something happend in toEnity');
    };
};

export function toPersistance(emp: EmployeeCreate): EmployeeCreate{
    try {
      return {
        name: emp.name,
        email: emp.email,
        password: emp.password,
        isBlocked: emp.isBlocked ?? false,
      };
    } catch (error) {
     throw new Error('Something happend in toPersistance') 
    };
};