import { CategoryDTO, CreateCategoryDTO } from "../../dtos/CategoryDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { CategoryUseCaseResponse } from "../../types/CategoryTypes";

export interface ICategoryUseCase {
    createCategory(categoryData: CreateCategoryDTO, query: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null>;
    fetchCategoryData(options?: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null>;
    handleListing(categoryId: string, query: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null>;
    updateCategory(updatedCategoryData: CategoryDTO, query: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null>;
};

