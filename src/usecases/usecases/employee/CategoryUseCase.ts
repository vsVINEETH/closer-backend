import { ICategoryRespository } from "../../../domain/repositories/ICategoryRepository";
import { Category } from "../../../domain/entities/Category";
import { CategoryDTO, CreateCategoryDTO } from "../../dtos/CategoryDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { ClientQuery } from "../../../../types/express";
import { paramToQueryCategory } from "../../../interfaces/utils/paramToQuery";
export class CategoryManagement {
    constructor(private categoryRepository: ICategoryRespository) { }

    async createCategory(categoryData: CreateCategoryDTO, query: SearchFilterSortParams): Promise<{category: Category[], total: number}| null> {
        try {
            
            const result = await this.categoryRepository.findByName(categoryData.name.toLowerCase().trim());
          
            if (!result) {
                await this.categoryRepository.create(categoryData.name.toLowerCase());
                const queryResult  = await paramToQueryCategory(query);
                const categories = await this.categoryRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );
               return categories ? {category: categories?.category, total: categories?.total} : null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in createCategory");
        }
    }

    async fetchCategoryData(options?: SearchFilterSortParams): Promise<{category: Category[], total: number}| null> {
        try {

            let categoryData;
            if(options){
            const queryResult  = await paramToQueryCategory(options);
             categoryData = await this.categoryRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );
          } else {
            categoryData = await this.categoryRepository.findAll({isListed: true});
          } 

           return categoryData ? {category: categoryData.category, total: categoryData.total} : null;
        } catch (error) {
            throw new Error("something happend in fetchCategoryData");
        }
    }

    async handleListing(categoryId: string, query: SearchFilterSortParams): Promise<{category: Category[], total: number}| null> {
        try {
            const category = await this.categoryRepository.findById(categoryId);
            if (category) {
                const status: boolean = !category.isListed;

                const result = await this.categoryRepository.listById(categoryId, status);
                if (!result) {
                    return null;
                }

                const queryResult  = await paramToQueryCategory(query);
                const categories = await this.categoryRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );
               return categories ? {category: categories?.category, total: categories?.total} : null;
            }

            return null;
        } catch (error) {
            throw new Error("something happend in handleListing");
        }
    }

    async updateCategory(updatedCategoryData: CategoryDTO, query: SearchFilterSortParams): Promise<{category: Category[], total: number} | null> {
        try {
            const isExists = await this.categoryRepository.findByName(updatedCategoryData.name.toLowerCase().trim());
 
            if (!isExists) {
                const result =  await this.categoryRepository.update(updatedCategoryData.id, updatedCategoryData.name);
                const queryResult  = await paramToQueryCategory(query);
                const categories = await this.categoryRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );
               return categories && result ? {category: categories?.category, total: categories?.total} : null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in updateCategory");
        }
    }
}
