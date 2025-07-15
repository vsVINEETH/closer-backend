import { Employee } from "../../domain/entities/Employee";
import { EmployeeDTO } from "../../usecases/dtos/EmployeeDTO";

export function toEmployeeDTO(entity: Employee): EmployeeDTO {
    return {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        isBlocked: entity.isBlocked
    };
};

export function toEmployeeDTOs(entities: Employee[]): EmployeeDTO[]{
    return entities.map((en) => ({
        id: en.id,
        name: en.name,
        email: en.email,
        isBlocked: en.isBlocked,
        createdAt: en.createdAt
    }));
};
