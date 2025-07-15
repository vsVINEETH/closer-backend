import { ICategoryRespository } from "../../domain/repositories/ICategoryRepository";
import { Category } from "../../domain/entities/Category";
import { CategoryModel } from "../persistence/models/CategoryModel";
import { SortOrder } from "../config/database";
import { toCategoryEntitiesFromDoc, toCategoryEntityFromDoc } from "../mappers/categoryDataMapper";

export class CategoryRepository implements ICategoryRespository {
  async findById(categoryId: string): Promise<Category | null> {
    try {
      const category = await CategoryModel.findById(categoryId);
      return category ? toCategoryEntityFromDoc(category) : null;
    } catch (error) {
      throw new Error("something happend in findById");
    };
  };

    async findAll<T>(
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise<Category[] | null> {
    try {
      const categories = await CategoryModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      ;
      return categories ? toCategoryEntitiesFromDoc(categories) : null;
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  };

  async countDocs<T>(query: Record<string, T> = {}): Promise<number> {
    try {
      const totalDocs = await CategoryModel.countDocuments(query);
      return totalDocs;
    } catch (error) {
      throw new Error("something happend in countDocs");
    }
  };
  

  async findByName(categoryName: string): Promise<Category| null> {
    try {
      const category = await CategoryModel.findOne({ name: categoryName });
      return category ? toCategoryEntityFromDoc(category) : null;
    } catch (error) {
      throw new Error("something happend in findByName");
    }
  }

  async create(categoryName: string): Promise<void> {
    try {
      const newCategory = new CategoryModel({
        name: categoryName,
        isListed: true,
      });

      await newCategory.save();
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

  async listById(categoryId: string, categoryStatus: boolean): Promise<boolean | null> {
    try {
      const categories = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { isListed: categoryStatus },
        { new: true }
      );
      if (categories) {
        return true;
      }

      return null;
    } catch (error) {
      throw new Error("something happend in listById");
    }
  }

  async update(categoryId: string, valueToUpdate: string): Promise<boolean | null> {
    try {
      const category = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { name: valueToUpdate },
        { new: true }
      );
      if (category) {
        return true;
      }
      return null;
    } catch (error) {
      throw new Error("something happend in update");
    }
  };

};
