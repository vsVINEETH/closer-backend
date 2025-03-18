import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { CategoryManagement } from "../../../usecases/usecases/employee/CategoryUseCase";

//repositories
import { CategoryRepository } from "../../../infrastructure/repositories/CategoryRepository";
import { paramsNormalizer } from "../../utils/filterNormalizer";

export class EmployeeCategoryController {
    private categoryUseCase: CategoryManagement;
    
    constructor(){
        const categoryRepository = new CategoryRepository();

        this.categoryUseCase = new CategoryManagement(categoryRepository)
    };


    fetchCategoryData = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filterOptions = await paramsNormalizer(req.query)
        const result = await this.categoryUseCase.fetchCategoryData(filterOptions);
        if (result) {
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.NO_CONTENT).json({ message: ResponseMessages.NO_CONTENT_OR_DATA});
        return;
      } catch (error) {
        next(error)
      }
    };


    createCategory = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const categoryData  = req.body;
        const filterOptions = await paramsNormalizer(req.query)
        const result = await this.categoryUseCase.createCategory(categoryData, filterOptions);
    
        if (result) {
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.FAILED_TO_CREATE });
        return;
      } catch (error) {
        next(error)
      }
    };


    handleCategoryListing = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const categoryId = req.body.id;
        const filterOptions = await paramsNormalizer(req.query)
        const result = await this.categoryUseCase.handleListing(categoryId, filterOptions);
    
        if (result) {
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({ message:ResponseMessages.INVALID_ID});
      } catch (error) {
        next(error);
      }
    };

    updateCategory = async (req: Request, res: Response, next:NextFunction) => {
      try {
        const updatedCategoryData = req.body;
        const filterOptions = await paramsNormalizer(req.query)
        const result = await this.categoryUseCase.updateCategory(updatedCategoryData, filterOptions);
        
        if(result){
          res.status(HttpStatus.OK).json({message:ResponseMessages.UPDATED_SUCCESSFULLY, result})
          return;
        }
        res.status(HttpStatus.CONFLICT).json({message:ResponseMessages.EXISTING_RESOURCE})
        return;
      } catch (error) {
        next(error)
      }
    };
}


export const employeeCategoryController = new EmployeeCategoryController();