import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { EventManagement } from "../../../usecases/usecases/admin/EventUseCase";
import { SalesManagement } from "../../../usecases/usecases/SalesUseCase";

//repositories
import { EventRepository } from "../../../infrastructure/repositories/EventRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { SalesRepository } from "../../../infrastructure/repositories/SalesRepository";

//external services
import { RazorpayService } from "../../../infrastructure/services/Razorpay";
import { Mailer } from "../../../infrastructure/services/Mailer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class UserEventController {
    private eventUseCase: EventManagement;
    private salesUseCase: SalesManagement;

    constructor(){
        const mailer = new Mailer();
        const razorpay = new RazorpayService();
        const userRepository = new UserRepository();
        const eventRepository = new EventRepository();
        const salesRepository = new SalesRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        this.eventUseCase = new EventManagement(eventRepository, mailer, userRepository,razorpay,salesRepository,s3ClientAccessControll);
        this.salesUseCase = new SalesManagement(salesRepository, s3ClientAccessControll);
    };

    fetchEvent = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const eventId = req.query.id;
         const result = await this.eventUseCase.fetchEvent(eventId as string)
         if(result){
          res.status(HttpStatus.OK).json(result);
          return
         }
         res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
         return
      } catch (error) {
          next(error)
      }
    };

    fetchBookedEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId} = req.query;
            const output = await this.eventUseCase.bookedEvents(userId as string);
            const result = await this.salesUseCase.getBookedEvents(userId as string);
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


    bookOder = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const order = await this.eventUseCase.createOrder(req.body);
        if(order){
          res.status(HttpStatus.ACCEPTED).json(order)
          return
        }else if(order === false){
          res.status(HttpStatus.CONFLICT).json({message: ResponseMessages.PAYMENT_IN_PROGRESS});
          return
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.FAILED_TO_CREATE_ORDER});
        return
      } catch (error) {
        next(error)
      }
    };


    verifyBookPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const paymentData = req.body;
        const result = await this.eventUseCase.verifyPayment(paymentData);
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.INVALID_PAYMENT_SIGNATURE});
        return
      } catch (error) {
        next(error)
      }
    };


    abortBookPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {userId} = req.body;
        const result = await this.eventUseCase.abortPayment(userId);
        if(result){
          res.status(HttpStatus.ACCEPTED).json({message: ResponseMessages.PAYMENT_ABORTED});
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({Message: ResponseMessages.FALIED_TO_ABORT_PAYMENT});
        return;
      } catch (error) {
        next(error)
      }
    };
};

export const userEventController = new UserEventController();