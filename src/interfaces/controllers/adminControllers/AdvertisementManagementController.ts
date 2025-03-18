import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { AdvertisementManagement } from "../../../usecases/usecases/admin/AdvertisementUseCase";

//repositories
import { AdvertisementRepository } from "../../../infrastructure/repositories/AdvertisementRepository";

// external services
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";
//utils
import { paramsNormalizer } from "../../utils/filterNormalizer";

export class AdvertisementManagementController {
    private advertisementUseCase: AdvertisementManagement;

    constructor(){
        const advertisementRepository = new AdvertisementRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        this.advertisementUseCase = new AdvertisementManagement(advertisementRepository, s3ClientAccessControll );
    };    

    fetchAdvertisementData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query);
            const result = await this.advertisementUseCase.fetchData(filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            }
            res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
            return;
        } catch (error) {
            next(error)
        }
    };

    createAdvertisement = async (req: Request, res: Response, next: NextFunction) => {
        try {
      
          const filterOptions = await paramsNormalizer(req.query)
          
          const imageFiles = req.files && "images" in req.files
            ? (req.files as { images: Express.MulterS3.File[] }).images
            : [];

          const advertisementData = req.body;
          const result = await this.advertisementUseCase.createAdvertisement(advertisementData, filterOptions, imageFiles);
            
          if(result){
            res.status(HttpStatus.CREATED).json({ message: ResponseMessages.CREATED_SUCCESSFULLY, data:result });
            return;
          };
    
          res.status(HttpStatus.BAD_REQUEST).json({ message: ResponseMessages.FAILED_TO_CREATE});
          return;
        } catch (error) {
            next(error)
        }
    };


    updateAdvertisement = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const updatedAdvertisementData = req.body;
          const filterOptions = await paramsNormalizer(req.query);
          const result = await this.advertisementUseCase.updateAdvertisement(updatedAdvertisementData, filterOptions);
          if(result){
            res.status(HttpStatus.OK).json({ message: ResponseMessages.UPDATED_SUCCESSFULLY, data:result });
            return
          }
          res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_UPDATE});
          return
        } catch (error) {
            next(error)
        }
    };


    removeAdvertisement = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const advertisementId = req.body.id;
           const filterOptions = await paramsNormalizer(req.query);
           const result = await this.advertisementUseCase.deleteAdvertisement(advertisementId, filterOptions);
           if(result){
            res.status(HttpStatus.OK).json({ message: ResponseMessages.DELETED_SUCCESSFULLY, data:result });
            return;
          }
          res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID});
          return;
        } catch (error) {
            next(error)
        }
    };


    advertisementListing = async (req: Request, res: Response, next: NextFunction) => {
        try {
        
        const advertisementId = req.body.id;
        const filterOptions = await paramsNormalizer(req.query);
        const result = await this.advertisementUseCase.handleListing(advertisementId, filterOptions);
        if (result) {
            res.status(HttpStatus.OK).json({ message: ResponseMessages.UPDATED_SUCCESSFULLY, data:result });
            return;
            }
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.INVALID_ID });
            return;
        } catch (error) {
            next(error)
        }
    };
};

export const advertisementManagementController = new AdvertisementManagementController();