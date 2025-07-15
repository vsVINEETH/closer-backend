import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";

import { advertisementUseCase } from "../../../di/general.di";

export class UserAdvertisementController {
    constructor(
      private _adsUseCase = advertisementUseCase
    ){}

    fetchAds = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const filterOptions = await paramsNormalizer(req.query);
         const result = await this._adsUseCase.fetchData(filterOptions);
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
};

export const userAdvertisementController = new UserAdvertisementController();