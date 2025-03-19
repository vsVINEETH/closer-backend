import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";


//useCase's
import { ContentManagement } from "../../../usecases/usecases/employee/ContentUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { ContentRepository } from "../../../infrastructure/repositories/ContentRepository";

//exteranl services
import { Mailer } from "../../../infrastructure/services/Mailer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";


export class UserContentController {
    private contentUseCase: ContentManagement;

    constructor(){
        const mailer = new Mailer();
        const userRepository = new UserRepository();
        const contentRepository = new ContentRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();
        this.contentUseCase = new ContentManagement(contentRepository, userRepository, mailer, s3ClientAccessControll);
    };


    fetchContentDetail = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contentId = req.query.id
        
        const result = await this.contentUseCase.contentDetail(contentId as string);
    
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

    voteContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { blogId, voteType} = req.body;
        const userId = req.body.id;

        const result = await this.contentUseCase.voteContent(userId, blogId, voteType);
    
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
        return
      } catch (error) {
        next(error)
      }
    }
    

    sharedContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { blogId} = req.body;
        const userId = req.body.id
        const result = await this.contentUseCase.sharedContent(userId, blogId);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
        return;
      } catch (error) {
        next(error)
      }
    }
};

export const userContentController = new UserContentController();