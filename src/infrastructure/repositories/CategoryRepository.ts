import { ICategoryRespository } from "../../domain/repositories/ICategoryRepository";
import { Category } from "../../domain/entities/Category";
import { CategoryDTO } from "../../usecases/dtos/CategoryDTO";
import { CategoryModel } from "../persistence/models/CategoryModel";
import { SortOrder } from "../config/database";

export class CategoryRepository implements ICategoryRespository {
  async findById(categoryId: string): Promise<CategoryDTO | null> {
    try {
      const category = await CategoryModel.findById(categoryId);
      if (category) {
        return {
          id: category.id,
          name: category.name,
          isListed: category.isListed,
          createdAt: category.createdAt.toLocaleDateString(),
        };
      };
      return null;
    } catch (error) {
      throw new Error("something happend in findById");
    }
  }

    async findAll<T>(
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise<{ category: Category[]; total: number } | null> {
    try {
      const categories = await CategoryModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      ;
      if (categories) {
        const category = categories.map(
          (cat) =>
            new Category(
              cat.id,
              cat.name,
              cat.isListed,
              cat.createdAt.toLocaleDateString()
            )
        );

        const total = await CategoryModel.countDocuments(query);
        return {category: category, total: total};
      }
      return null;
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async findByName(categoryName: string): Promise<CategoryDTO | null> {
    try {
      const category = await CategoryModel.findOne({ name: categoryName });
      if (category) {
        return {
          id: category.id,
          name: category.name,
          isListed: category.isListed,
          createdAt: category.createdAt.toLocaleDateString(),
        };
      }
      return null;
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
  }
}
