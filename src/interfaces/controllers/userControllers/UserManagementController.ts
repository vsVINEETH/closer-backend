import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { Preferences } from "../../../../types/express";

//useCase's
import { Security } from "../../../usecases/usecases/user/SecurityUseCase";
import { CommonOperations } from "../../../usecases/usecases/user/CommonUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

//external services
import { Mailer } from "../../../infrastructure/services/Mailer";
import { Bcrypt } from "../../../infrastructure/services/Bcrypt";
import { OTP } from "../../../infrastructure/services/Otp";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";


export class UserManagementController {
    private securityUseCase: Security;
    private commonUseCase: CommonOperations;

    constructor(){
        const mailer = new Mailer();
        const bcrypt = new Bcrypt();
        const otp = new OTP();
        const userRepository = new UserRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        this.securityUseCase = new Security(userRepository, bcrypt, otp, mailer, s3ClientAccessControll);
        this.commonUseCase = new CommonOperations(userRepository, s3ClientAccessControll);
    };

    blockUser = async(req: Request, res:Response, next: NextFunction) => {
      try {
        const {blockedId, userId, userPreferences} = req.body || '';
        const result = await this.securityUseCase.blockUser(blockedId, userId, userPreferences);
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
        const result = await this.securityUseCase.reportUser(reportedId, userId, userPreferences);
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
        const result = await this.securityUseCase.blockList(userId);
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
        
        const result = await this.securityUseCase.unblockUser(unblockId, userId);
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
          
            const result = await this.commonUseCase.fetchUserData(userPreferences);
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