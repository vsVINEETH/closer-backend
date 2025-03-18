import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { AdvertisementManagement } from "../../../usecases/usecases/admin/AdvertisementUseCase";

//repositries
import { AdvertisementRepository } from "../../../infrastructure/repositories/AdvertisementRepository";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class UserAdvertisementController {
    private adsUseCase: AdvertisementManagement;

    constructor(){
        const advertisementRepository = new AdvertisementRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();
        this.adsUseCase = new AdvertisementManagement(advertisementRepository, s3ClientAccessControll);
    };

    fetchAds = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const filterOptions = await paramsNormalizer(req.query);
         const result = await this.adsUseCase.fetchData(filterOptions);
         if(result){
          res.status(201).json(result);
          return;
         }
         res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
         return;
      } catch (error) {
        next(error)
      }
    };
};

export const userAdvertisementController = new UserAdvertisementController();