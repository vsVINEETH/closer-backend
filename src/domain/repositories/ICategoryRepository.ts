import { Category } from "../entities/Category";
import { SortOrder } from "../../infrastructure/config/database";

export interface ICategoryRespository {
    findById(categoryId: string): Promise<Category | null>
    findByName(categoryName: string): Promise<Category | null>
    countDocs<T>(query: Record<string, T>): Promise<number>
    create(categoryName: Category): Promise<Category>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<Category[]| null>;
    listById(categoryId: string, categoryStatus: boolean): Promise<boolean | null>
    update(categoryId: string, valueToUpdate: { name : string }): Promise<Category | null>
};