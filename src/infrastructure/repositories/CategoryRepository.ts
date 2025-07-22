import { ICategoryRespository } from "../../domain/repositories/ICategoryRepository";
import { Category } from "../../domain/entities/Category";
import { CategoryModel } from "../persistence/models/CategoryModel";
import { SortOrder } from "../config/database";
import { toCategoryEntitiesFromDoc, toCategoryEntityFromDoc } from "../mappers/categoryDataMapper";
import { BaseRepository } from "./BaseRepository";
import { ICategoryDocument } from "../persistence/interfaces/ICategoryModel";

export class CategoryRepository extends BaseRepository<Category, ICategoryDocument> implements ICategoryRespository {

  constructor(){
    super(CategoryModel, toCategoryEntityFromDoc, toCategoryEntitiesFromDoc)
  };

  async findByName(categoryName: string): Promise<Category| null> {
    try {
      const category = await CategoryModel.findOne({ name: categoryName });
      return category ? toCategoryEntityFromDoc(category) : null;
    } catch (error) {
      throw new Error("something happend in findByName");
    };
  };

  async listById(categoryId: string, categoryStatus: boolean): Promise<boolean | null> {
    try {
      const categories = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { isListed: categoryStatus },
        { new: true }
      );
      return categories ? true : null;
    } catch (error) {
      throw new Error("something happend in listById");
    };
  };

};
