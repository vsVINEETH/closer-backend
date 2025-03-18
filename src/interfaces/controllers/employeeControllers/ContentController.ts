import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

import { SearchFilterSortParams } from "../../../usecases/dtos/CommonDTO";
import { ParsedQs } from "../../../../types/express";

//useCase's
import { ContentManagement } from "../../../usecases/usecases/employee/ContentUseCase";
import { CategoryManagement } from "../../../usecases/usecases/employee/CategoryUseCase";

//repositories
import { ContentRepository } from "../../../infrastructure/repositories/ContentRepository";
import { CategoryRepository } from "../../../infrastructure/repositories/CategoryRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

//external services
import { Mailer } from "../../../infrastructure/services/Mailer";

//helper methods and utils
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class EmployeeContentController {
    private contentUseCase: ContentManagement;
    private categoryUseCase: CategoryManagement;
    
    constructor(){
        const mailer = new Mailer();
        const contentRepository = new ContentRepository();
        const categoryRepository = new CategoryRepository();
        const userRepository = new UserRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();
        this.contentUseCase = new ContentManagement(contentRepository, userRepository, mailer, s3ClientAccessControll);
        this.categoryUseCase = new CategoryManagement(categoryRepository);
    };

    createContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const imageFiles = req.files && "images" in req.files 
          ? (req.files as { images: Express.Multer.File[] }).images 
          : [];

        const contentData = req.body;
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
        const result = await this.contentUseCase.createContent(contentData, filterOptions, imageFiles);
        const category = await this.categoryUseCase.fetchCategoryData();

        if (result) {
          res.status(HttpStatus.OK).json({ message: ResponseMessages.CREATED_SUCCESSFULLY, data:result, category: category});
          return;
        }
        res.status(HttpStatus.BAD_GATEWAY).json({ message: ResponseMessages.FAILED_TO_CREATE});
        return;
      } catch (error) {
        next(error)
      }
    };

    fetchContentData = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);

        const result = await this.contentUseCase.fetchContentData(filterOptions);
        const category = await this.categoryUseCase.fetchCategoryData();
    
        if (result && category) {
          res.status(HttpStatus.OK).json({data:result, category: category});
          return;
        }
        res.status(HttpStatus.NO_CONTENT).json({ message: ResponseMessages.NO_CONTENT_OR_DATA});
        return;
      } catch (error) {
        next(error)
      }
    };


    handleContentListing = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contentId = req.body.id;
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
        const result = await this.contentUseCase.handleListing(contentId, filterOptions);
        const category = await this.categoryUseCase.fetchCategoryData();
    
        if (result) {
          res.status(HttpStatus.OK).json({data:result, category: category});
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.INVALID_ID });
        return;
      } catch (error) {
        next(error)
      }
    
    };


     deleteContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contentId = req.body.id;
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
        const result = await this.contentUseCase.deleteContent(contentId, filterOptions);
        const category = await this.categoryUseCase.fetchCategoryData();
        if(result){
          res.status(HttpStatus.OK).json({data:result, category: category});
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.INVALID_ID});
        return;
      } catch (error) {
        next(error)
      }
    };

    updateContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const updatedContentData = req.body;
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
        const result = await this.contentUseCase.updateContent(updatedContentData, filterOptions);
        const category = await this.categoryUseCase.fetchCategoryData();
        if(result){
          res.status(HttpStatus.OK).json({data:result, category: category});
          return
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_UPDATE});
        return
      } catch (error) {
        next(error)
      }
    };
}

export const employeeContentController = new EmployeeContentController();