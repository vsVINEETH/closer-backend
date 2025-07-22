import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { commonUserUseCase } from "../../../di/user.di";

export class ProfileControll {

    constructor(
      private _commonUseCase = commonUserUseCase
    ){};

    profile = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id as string || "";
        const result = await this._commonUseCase.profile(userId);
      
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID})
        return;
      } catch (error) {
        next(error);
      };
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { field, value } = req.body;
        const userId = req.query.id as string || "";
        const result = await this._commonUseCase.updateProfile(field, value, userId);
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
        const result = await this._commonUseCase.updateProfileImageURL(userId);
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        };
        res.status(HttpStatus.FORBIDDEN).json({message: ResponseMessages.FAILED_TO_UPDATE});
        return;
      } catch (error) {
        next(error)
      }
    };

    removeImage = async (req: Request, res: Response, next: NextFunction) => {
      try {
          const userId = req.body.id;
          const imageSource = req.body.src;
          const result = await this._commonUseCase.removeImage(userId, imageSource);
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
         
        const result = await this._commonUseCase.addImage(userId, imageFiles)
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
        const result = await this._commonUseCase.changeProfileImage(imageIndex, userId);
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