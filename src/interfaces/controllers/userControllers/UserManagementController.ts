import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { Preferences } from "../../../../types/express";

import { securityUserUseCase, commonUserUseCase } from "../../../di/user.di";

export class UserManagementController {

    constructor(
      private _securityUseCase = securityUserUseCase,
      private _commonUseCase = commonUserUseCase
    ){}

    blockUser = async(req: Request, res:Response, next: NextFunction) => {
      try {
        const {blockedId, userId, userPreferences} = req.body || '';
        const result = await this._securityUseCase.blockUser(blockedId, userId, userPreferences);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID});
        return
      } catch (error) {
        next(error);
      }
    };

    reportUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {userId, reportedId, userPreferences} = req.body;
        const result = await this._securityUseCase.reportUser(reportedId, userId, userPreferences);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID})
      } catch (error) {
        next(error)
      }
    };


    blockList = async (req: Request, res:Response, next: NextFunction) =>{
      try {
        const userId = req.query.id as string || "";
        const result = await this._securityUseCase.blockList(userId);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID});
        return
      } catch (error) {
        next(error)
      }
    };

    unblockUser = async (req: Request, res:Response, next: NextFunction) => {
      try {
        const unblockId = req.body.unblockId;
        const userId = req.body.id;
        
        const result = await this._securityUseCase.unblockUser(unblockId, userId);
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID});
        return;
      } catch (error) {
        next(error)
      }
    };


    fetchUsersData = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const userPreferences: Preferences =  req.query as {
            userId: string,
            interestedIn: string,
            ageRange: string,
            distance: string,
            lookingFor: string
            };
          
            const result = await this._commonUseCase.fetchUserData(userPreferences);
            if (result) {
              res.status(HttpStatus.OK).json(result);
              return;
            }
    
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.INVALID_ID });
            return;
        } catch (error) {
          next(error)
        }
    };
}

export const userManagementController = new UserManagementController();