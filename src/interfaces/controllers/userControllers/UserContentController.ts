import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { contentUseCases } from "../../../di/general.di";

export class UserContentController {

    constructor(
      private _contentUseCase = contentUseCases
    ){};

    fetchContentDetail = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contentId = req.query.id
        const result = await this._contentUseCase.contentDetail(contentId as string);
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        };
        res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
        return;
      } catch (error) {
        next(error);
      };
    };

    

    voteContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { blogId, voteType} = req.body;
        const userId = req.body.id;
        const result = await this._contentUseCase.voteContent(userId, blogId, voteType);
    
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
        return
      } catch (error) {
        next(error)
      };
    };
    

    sharedContent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { blogId} = req.body;
        const userId = req.body.id
        const result = await this._contentUseCase.sharedContent(userId, blogId);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
        return;
      } catch (error) {
        next(error)
      };
    };
};

export const userContentController = new UserContentController();