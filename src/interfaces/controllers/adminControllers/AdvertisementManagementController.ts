import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { advertisementUseCase } from "../../../di/general.di";
import { IAdvertisementUseCase } from "../../../usecases/interfaces/admin/IAdvertisementUseCase";
import { imageFileNormalizer } from "../../utils/imageFileNormalizer";
import { mapVisibilityAdvertisementRequest} from "../../mappers/advertisementDTOMapper";

export class AdvertisementManagementController {

    constructor(
        private _advertisementUseCase : IAdvertisementUseCase
    ){};

    fetchAdvertisementData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query);
            const result = await this._advertisementUseCase.fetchData(filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            };
            res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
            return;
        } catch (error) {
            next(error);
        };
    };

    createAdvertisement = async (req: Request, res: Response, next: NextFunction) => {
        try {

          const imageFiles = imageFileNormalizer(req.files)
          const filterOptions = await paramsNormalizer(req.query);
          const advertisementData = req.body;
          const result = await this._advertisementUseCase.createAdvertisement(advertisementData, filterOptions, imageFiles);
            
          if(result){
            res.status(HttpStatus.CREATED).json({ message: ResponseMessages.CREATED_SUCCESSFULLY, data: result });
            return;
          };
    
          res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.FAILED_TO_CREATE});
          return;
        } catch (error) {
            next(error);
        };
    };


    updateAdvertisement = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const updatedAdvertisementData = req.body;
          const filterOptions = await paramsNormalizer(req.query);
          const result = await this._advertisementUseCase.updateAdvertisement(updatedAdvertisementData, filterOptions);
          if(result){
            res.status(HttpStatus.OK).json({ message: ResponseMessages.UPDATED_SUCCESSFULLY, data:result });
            return;
          }
          res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_UPDATE});
          return;
        } catch (error) {
            next(error);
        };
    };


    removeAdvertisement = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const {advertisementId, filterOptions} = await mapVisibilityAdvertisementRequest(req);
           const result = await this._advertisementUseCase.deleteAdvertisement(advertisementId, filterOptions);
           if(result){
            res.status(HttpStatus.OK).json({ message: ResponseMessages.DELETED_SUCCESSFULLY, data:result });
            return;
          }
          res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID});
          return;
        } catch (error) {
            next(error)
        };
    };


    advertisementListing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {advertisementId, filterOptions} = await mapVisibilityAdvertisementRequest(req);
            const result = await this._advertisementUseCase.handleListing(advertisementId, filterOptions);
            if (result) {
             res.status(HttpStatus.OK).json({ message: ResponseMessages.UPDATED_SUCCESSFULLY, data:result });
             return;
            }
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.INVALID_ID });
            return;
        } catch (error) {
            next(error)
        };
    };
};

export const advertisementManagementController = new AdvertisementManagementController(advertisementUseCase);