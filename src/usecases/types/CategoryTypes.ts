import { Category } from "../../domain/entities/Category";
import { CategoryDTO } from "../dtos/CategoryDTO";

export type CategoryUseCaseResponse = {category: CategoryDTO[], total: number}