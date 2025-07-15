import { Category } from "../../domain/entities/Category";
import { CategoryDTO } from "../../usecases/dtos/CategoryDTO";

export function toCategoryDTO(entity: Category): CategoryDTO {
    return {
        id: entity.id,
        name: entity.name,
        isListed: entity.isListed,
        createdAt: entity.createdAt
    };
};

export function toCategoryDTOs(entities: Category[]): CategoryDTO[]{
    return entities.map((en) =>({
            id: en.id,
            name: en.name,
            isListed: en.isListed,
            createdAt: en.createdAt
        }));
};