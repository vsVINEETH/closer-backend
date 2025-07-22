import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { commonUserUseCase } from "../../../di/user.di";

export class LocationController {

    constructor(
      private _commonUseCase = commonUserUseCase
    ){};

    locationUpdater = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {locationData, userId} = req.body;
        const result = await this._commonUseCase.updateUserLocation(userId, locationData)
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        };

        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.FAILED_TO_UPDATE})
        return
      } catch (error) {
        next(error)
      }
    };

    fetchLocation = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {latitude, longitude} = req.query;
        const location = await this._commonUseCase.fetchLocation(latitude as string, longitude as string);

        if(location){
          res.status(HttpStatus.OK).json(location);
          return;
        };
        res.status(HttpStatus.BAD_REQUEST).json({message:ResponseMessages.FAILED_TO_GET_LOCATION});
        
      } catch (error) {
        next(error)
      }
    };
};

export const locationController = new LocationController();