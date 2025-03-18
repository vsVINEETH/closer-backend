import { CategoryDTO } from "../../usecases/dtos/CategoryDTO";
import { Category } from "../entities/Category";
import { SortOrder } from "../../infrastructure/config/database";
export interface ICategoryRespository {
    findById(categoryId: string): Promise<CategoryDTO | null>
    findByName(categoryName: string): Promise<CategoryDTO | null>
    create(categoryName: string): Promise<void>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<{category:Category[], total: number} | null>;
    listById(categoryId: string, categoryStatus: boolean): Promise<boolean | null>
    update(categoryId: string, valueToUpdate: string): Promise<boolean | null>
}