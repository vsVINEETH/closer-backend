import { ICategoryRespository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryDTO, CreateCategoryDTO } from "../../dtos/CategoryDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { paramToQueryCategory } from "../../../interfaces/utils/paramToQuery";
import { CategoryUseCaseResponse } from "../../types/CategoryTypes";
import { ICategoryUseCase } from "../../interfaces/employee/ICategoryUseCase";
import { toCategoryPersistance } from "../../../infrastructure/mappers/categoryDataMapper";
import { toCategoryDTOs } from "../../../interfaces/mappers/categoryDTOMapper";

export class CategoryManagement implements ICategoryUseCase {
    constructor(
        private _categoryRepository: ICategoryRespository
    ) {}

        private async _fetchAndEnrich(query?: SearchFilterSortParams): Promise<CategoryUseCaseResponse> {
            try {
                
                if(query){
                    const queryResult = await paramToQueryCategory(query);
                    const total = await this._categoryRepository.countDocs(queryResult.query);
                    const categoryData = await this._categoryRepository.findAll(
                        queryResult.query,
                        queryResult.sort,
                        queryResult.skip,
                        queryResult.limit
                    );

                    const mappedCategories = categoryData ? toCategoryDTOs(categoryData):[];
                    return { category: mappedCategories ?? [], total: total ?? 0 };  
                };

                 let categoryData = await this._categoryRepository.findAll({isListed: true})
                 let total = await this._categoryRepository.countDocs({});
                 return { category: categoryData ?? [], total: total ?? 0 };  
            } catch (error) {
                throw new Error('Something happend fetchAndEnrich')
            };
        };

    async createCategory(categoryData: CreateCategoryDTO, query: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null> {
        try {
            
            const result = await this._categoryRepository.findByName(categoryData.name.toLowerCase().trim());
          
            if (!result) {
                const dataToPersist = toCategoryPersistance(categoryData.name)
                await this._categoryRepository.create(dataToPersist);
                const categories = await this._fetchAndEnrich(query)
               return categories ?? null;
            };
            return null;
        } catch (error) {
            throw new Error("something happend in createCategory");
        }
    };

    async fetchCategoryData(options?: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null> {
        try {

           const categoryData = await this._fetchAndEnrich(options);
           return categoryData ?? null;
        } catch (error) {
            throw new Error("something happend in fetchCategoryData");
        };
    };

    async handleListing(categoryId: string, query: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null> {
        try {
            const category = await this._categoryRepository.findById(categoryId);
            if (category) {
                const status: boolean = !category.isListed;
                const result = await this._categoryRepository.listById(categoryId, status);
                const categories = await this._fetchAndEnrich(query);
                return categories && result ? categories : null;
            };

            return null;
        } catch (error) {
            throw new Error("something happend in handleListing");
        };
    };

    async updateCategory(updatedCategoryData: CategoryDTO, query: SearchFilterSortParams): Promise<CategoryUseCaseResponse| null> {
        try {
            const isExists = await this._categoryRepository.findByName(updatedCategoryData.name.toLowerCase().trim());
            if (!isExists) {
                const result =  await this._categoryRepository.update(updatedCategoryData.id,{name:updatedCategoryData.name});
                const categories = await this._fetchAndEnrich(query);
                return categories && result ? categories : null;
            };
            return null;
        } catch (error) {
            throw new Error("something happend in updateCategory");
        }
    }
};
