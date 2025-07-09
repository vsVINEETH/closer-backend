import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";


//useCase's
import { CommonOperations } from "../../../usecases/usecases/user/CommonUseCase";
import { ChatManagement } from "../../../usecases/usecases/user/ChatUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { ChatRepository } from "../../../infrastructure/repositories/ChatRepository";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";
import { Geolocation } from "../../../infrastructure/services/Geolocation";

export class UserChatController {
    private commonUseCase: CommonOperations;
    private chatUseCase: ChatManagement;

    constructor(){
        const userRepository = new UserRepository();
        const chatRepository = new ChatRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        const geolocation = new Geolocation()
        this.chatUseCase = new ChatManagement(chatRepository);
        this.commonUseCase = new CommonOperations(userRepository, s3ClientAccessControll,geolocation);
    };

    fetchMessages = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id;
        const matches = await this.commonUseCase.fetchMatches(userId as string);
        if(!matches){
          res.status(HttpStatus.NO_CONTENT).json({messages: ResponseMessages.NO_CONTENT_OR_DATA})
          return;
        }
        const messages = await this.chatUseCase.fetchMessages(userId as string, matches);
    
        if(matches || messages) {
          res.status(HttpStatus.OK).json({matches, messages});
          return;
        }
        res.status(HttpStatus.NO_CONTENT).json({messages: ResponseMessages.NO_CONTENT_OR_DATA})
      } catch (error) {
        next(error)
      }
    };

    fetchChats = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const senderId = req.query.sender;
        const receiverId = req.query.receiver;
        const user = await this.commonUseCase.fetchUserById(receiverId as string);
        const result = await this.chatUseCase.fetchChats(senderId as string, receiverId as string);
        
        if(result || user){
          res.status(HttpStatus.OK).json({chats:result, receiver: user});
          return;
        }
    
        res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
        return;
      } catch (error) {
        next(error)
      }
    };

    uploadAudio = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const files = req.files as {
            [fieldname: string]: Express.MulterS3.File[];
          };
      

          if (!files || Object.keys(files).length === 0) {
            res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: ResponseMessages.FAILED_TO_UPLOAD });
            return;
          }
      
          // Extract file details for all uploaded files
          const uploadedFiles = Object.entries(files).flatMap(([fieldname, fileArray]) =>
            fileArray.map((file) => ({
              fieldname,
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              location: file.location, // S3 file URL
              key: file.key, // S3 key
            }))
          );
      
          // Return response with uploaded file details
          res.status(HttpStatus.OK).json({
            message: ResponseMessages.FILE_UPLOADED_SUCCESSFULLY,
            files: uploadedFiles,
          });
        } catch (error) {
          next(error);
        }
      };
};

export const userChatController = new UserChatController()