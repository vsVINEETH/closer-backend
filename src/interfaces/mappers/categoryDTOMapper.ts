import { Category } from "../../domain/entities/Category";
import { CategoryDTO } from "../../usecases/dtos/CategoryDTO";

export function toCategoryDTO(entity: Category): CategoryDTO {
    try {
        return {
            id: entity.id,
            name: entity.name,
            isListed: entity.isListed,
            createdAt: entity.createdAt
        };  
    } catch (error) {
       throw new Error('Something happend in toCategoryDTO') 
    };
};

export function toCategoryDTOs(entities: Category[]): CategoryDTO[]{
    try {
      return entities.map((en) =>({
            id: en.id,
            name: en.name,
            isListed: en.isListed,
            createdAt: en.createdAt
       }));  
    } catch (error) {
      throw new Error('Something happend in toCategoryDTO')  
    };
};