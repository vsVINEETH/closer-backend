import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { EventManagement } from "../../../usecases/usecases/admin/EventUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { EventRepository } from "../../../infrastructure/repositories/EventRepository";
import { SalesRepository } from "../../../infrastructure/repositories/SalesRepository";

//external services
import { Mailer } from "../../../infrastructure/services/Mailer";
import { RazorpayService } from "../../../infrastructure/services/Razorpay";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";


export class EventManagementController {
    private eventUseCase: EventManagement;

    constructor(){
        const mailer = new Mailer();
        const razorpay = new RazorpayService();
        const userRepository = new UserRepository();
        const eventRepository = new EventRepository();
        const salesRepository = new SalesRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();

        this.eventUseCase = new EventManagement(eventRepository, mailer, userRepository, razorpay, salesRepository, s3ClientAccessControll);
    };

    fetchEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this.eventUseCase.fetchEvents(filterOptions);
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

    createEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
      
            const imageFiles = req.files && "images" in req.files
            ? (req.files as { images: Express.Multer.File[] }).images
            : [];
            
           // const image = imageFiles.map((file) => file.location); 
            const eventData = req.body;
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this.eventUseCase.createEvent( eventData, filterOptions,  imageFiles);
    
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            };
            res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_CREATE});
            return;
        } catch (error) {
            next(error)
        }
    };

    updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const updatedEventData = req.body;
           const filterOptions = await paramsNormalizer(req.query)
           const result = await this.eventUseCase.updateEvent(updatedEventData, filterOptions);
           if(result){
            res.status(HttpStatus.OK).json(result);
            return;
           }
           res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE})
        } catch (error) {
          next(error)  
        }
    };

    deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const eventId = req.body.id;
           const filterOptions = await paramsNormalizer(req.query);
           const result = await this.eventUseCase.deleteEvent(eventId as string, filterOptions);
           if(result){
            res.status(HttpStatus.OK).json(result);
            return;
           };
           res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_DELETE})
        } catch (error) {
            next(error)
        }
    };
    
};

export const eventManagementController = new EventManagementController();