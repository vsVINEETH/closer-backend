import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { CommonOperations } from "../../../usecases/usecases/user/CommonUseCase";
import { NotifyUser } from "../../../usecases/usecases/user/NotifyUserUseCase";


//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { NotificationRepository } from "../../../infrastructure/repositories/NotificationRepository";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";
import { Geolocation } from "../../../infrastructure/services/Geolocation";

export class UserInteractionController {
    private commonUseCase: CommonOperations;
    private notificationUseCase: NotifyUser;

    constructor(){
        const userRepository = new UserRepository();
        const notificationRepository = new NotificationRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        const geolocation = new Geolocation()
        this.commonUseCase = new CommonOperations(userRepository, s3ClientAccessControll, geolocation);
        this.notificationUseCase = new NotifyUser(notificationRepository);
    };


    fetchNotifications = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id as string
        const result = await this.notificationUseCase.fetchData(userId);
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


    handleInterestRequest = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, interactorId, status} = req.body;
        const notificationId = req.body.id;
        await  this.notificationUseCase.removeNotification(notificationId);
        if(status){
          const result = await this.commonUseCase.handleInterest(userId, interactorId);
          if(result){
            res.status(HttpStatus.OK).json({message:  ResponseMessages.SUCCESSFULLY_MATCHED});
            return;
          }else{
            res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.FAILED_TO_MATCH});
          }
           
        }else{
          res.status(HttpStatus.ACCEPTED).json({message: ResponseMessages.FAILED_TO_MATCH});
          return;
        }
        
      } catch (error) {
        next(error)
      }
    };


    fetchMatches = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id as string;

        const result = await this.commonUseCase.fetchMatches(userId);
        console.log(result)
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA})
        return
      } catch (error) {
        next(error)
      }
    };


    unmatchUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {userId, interactorId} = req.body;
        const result = await this.commonUseCase.unmatchUser(userId, interactorId);
    
        if(result){
          res.status(HttpStatus.ACCEPTED).json({message: ResponseMessages.UNMATCHED_SUCCESSFULLY});
          return;
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.FAILED_TO_UNMATCH});
      } catch (error) {
        next(error)
      }
    };
    
};

export const userInteractionController = new UserInteractionController()