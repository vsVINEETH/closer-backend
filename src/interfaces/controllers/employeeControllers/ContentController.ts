import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { SearchFilterSortParams } from "../../../usecases/dtos/CommonDTO";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { contentUseCases } from "../../../di/general.di";
import { categoryUseCase } from "../../../di/employee.di";
import { ICategoryUseCase } from "../../../usecases/interfaces/employee/ICategoryUseCase";
import { IContentUseCase } from "../../../usecases/interfaces/employee/IContentUseCase";
import { imageFileNormalizer } from "../../utils/imageFileNormalizer";
export class EmployeeContentController {

    constructor(
      private _contentUseCase : IContentUseCase,
      private _categoryUseCase : ICategoryUseCase,
    ){}

    createContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const imageFiles = imageFileNormalizer(req.files);
        const contentData = req.body;
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
        const result = await this._contentUseCase.createContent(contentData, filterOptions, imageFiles);
        const category = await this._categoryUseCase.fetchCategoryData();

        if (result) {
          res.status(HttpStatus.OK).json({ message: ResponseMessages.CREATED_SUCCESSFULLY, data:result, category: category});
          return;
        };
        
        res.status(HttpStatus.BAD_GATEWAY).json({ message: ResponseMessages.FAILED_TO_CREATE});
        return;
      } catch (error) {
        next(error);
      };
    };

    fetchContentData = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);

          const result = await this._contentUseCase.fetchContentData(filterOptions);
          const category = await this._categoryUseCase.fetchCategoryData();
      
          if (result && category) {
            res.status(HttpStatus.OK).json({data:result, category: category});
            return;
          };
          res.status(HttpStatus.NO_CONTENT).json({ message: ResponseMessages.NO_CONTENT_OR_DATA});
          return;
      } catch (error) {
          next(error);
      };
    };


    handleContentListing = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const contentId = req.body.id;
          const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
          const result = await this._contentUseCase.handleListing(contentId, filterOptions);
          const category = await this._categoryUseCase.fetchCategoryData();
      
          if (result) {
            res.status(HttpStatus.OK).json({data:result, category: category});
            return;
          }
          res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.INVALID_ID });
          return;
      } catch (error) {
        next(error);
      };
    };


     deleteContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contentId = req.body.id;
        const filterOptions: SearchFilterSortParams  = await paramsNormalizer(req.query);
        const result = await this._contentUseCase.deleteContent(contentId, filterOptions);
        const category = await this._categoryUseCase.fetchCategoryData();
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
        const result = await this._contentUseCase.updateContent(updatedContentData, filterOptions);
        const category = await this._categoryUseCase.fetchCategoryData();
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
};

export const employeeContentController = new EmployeeContentController(contentUseCases, categoryUseCase);