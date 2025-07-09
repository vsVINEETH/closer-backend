import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { CommonOperations } from "../../../usecases/usecases/user/CommonUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";
import { Geolocation } from "../../../infrastructure/services/Geolocation";

export class ProfileControll {
    private commonUseCase: CommonOperations;

    constructor(){
        const userRepository = new UserRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        const geolocation = new Geolocation()
        this.commonUseCase = new CommonOperations(userRepository, s3ClientAccessControll, geolocation);
    };

    profile = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id as string || "";
        const result = await this.commonUseCase.profile(userId);
      
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID})
        return;
      } catch (error) {
        next(error);
      }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { field, value } = req.body;
        const userId = req.query.id as string || "";
        const result = await this.commonUseCase.updateProfile(field, value, userId);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE})
        return;
      } catch (error) {
        next(error)
      }
    };

    updateProfileImageURLs = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.userId as string;
        const result = await this.commonUseCase.updateProfileImageURL(userId);
        if(result){
          res.status(200).json(result);
          return;
        };
        res.status(HttpStatus.FORBIDDEN).json({message: ResponseMessages.FAILED_TO_UPDATE});
        return;
      } catch (error) {
        next(error)
      }
    }

    removeImage = async (req: Request, res: Response, next: NextFunction) => {
      try {
 
        const userId = req.body.id;
        const imageSource = req.body.src;
        const result = await this.commonUseCase.removeImage(userId, imageSource);
        if(result){
          res.status(HttpStatus.OK).json(result);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
        return
      } catch (error) {
       next(error) 
      }
    };

    addImage = async(req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id as string || ""
        const imageFiles = req.files && "images" in req.files
         ? (req.files as { images: Express.Multer.File[] }).images
         : [];
        
       // const image = imageFiles.map((file) => file.location);
        const result = await this.commonUseCase.addImage(userId, imageFiles)
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE})
      } catch (error) {
        next(error);
      }
    };


    changeProfileImage = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {imageIndex, userId} = req.body;
        const result = await this.commonUseCase.changeProfileImage(imageIndex, userId);
        if(result){
          res.status(HttpStatus.OK).json({message: ResponseMessages.UPDATED_SUCCESSFULLY});
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_UPDATE});
        return;
      } catch (error) {
        next(error)
      }
    }
    
};

export const profileControll = new ProfileControll();