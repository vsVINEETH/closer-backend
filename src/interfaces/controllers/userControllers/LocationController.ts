import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { CommonOperations } from "../../../usecases/usecases/user/CommonUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";


export class LocationController {
    private commonUseCase: CommonOperations;

    constructor(){
        const userRepository = new UserRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();
        this.commonUseCase = new CommonOperations(userRepository, s3ClientAccessControll);
    };

    locationUpdater = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {locationData, userId} = req.body;
        const result = await this.commonUseCase.updateUserLocation(userId, locationData)
        if(result){
          res.status(HttpStatus.OK).json(result)
          return
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.FAILED_TO_UPDATE})
        return
      } catch (error) {
        next(error)
      }
    };
};

export const locationController = new LocationController();