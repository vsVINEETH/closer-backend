import { Employee } from "../../domain/entities/Employee";
import { EmployeeDTO } from "../../usecases/dtos/EmployeeDTO";

export function toEmployeeDTO(entity: Employee): EmployeeDTO {
    try {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            isBlocked: entity.isBlocked
        };  
    } catch (error) {
      throw new Error('Something happend in toEmployeeDTO')  
    };
};

export function toEmployeeDTOs(entities: Employee[] | null): EmployeeDTO[] | null{
    try {
      return entities ? entities.map((en) => ({
        id: en.id,
        name: en.name,
        email: en.email,
        isBlocked: en.isBlocked,
        createdAt: en.createdAt
      })) : null;   
    } catch (error) {
      throw new Error('Something happend in toEmployeeDTOs')
    };
};
