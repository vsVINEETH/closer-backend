import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { eventUseCase } from "../../../di/general.di";
import { salesUseCases } from "../../../di/admin.di";

export class UserEventController {

    constructor(
      private _eventUseCase = eventUseCase,
      private _salesUseCase = salesUseCases,
      
    ){}

    fetchEvent = async (req: Request, res: Response, next: NextFunction) => {
      try {
         const eventId = req.query.id;
         const result = await this._eventUseCase.fetchEvent(eventId as string)
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
            const output = await this._eventUseCase.bookedEvents(userId as string);
            const result = await this._salesUseCase.getBookedEvents(userId as string);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            }
            res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
            return;
        } catch (error) {
        next(error)
        };
    };


    bookOder = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const order = await this._eventUseCase.createOrder(req.body);
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
        next(error);
      };
    };


    verifyBookPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const paymentData = req.body;
        const result = await this._eventUseCase.verifyPayment(paymentData);
        if(result){
          res.status(HttpStatus.OK).json(result);
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.INVALID_PAYMENT_SIGNATURE});
        return
      } catch (error) {
        next(error);
      };
    };


    abortBookPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {userId} = req.body;
        const result = await this._eventUseCase.abortPayment(userId);
        if(result){
          res.status(HttpStatus.ACCEPTED).json({message: ResponseMessages.PAYMENT_ABORTED});
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({Message: ResponseMessages.FALIED_TO_ABORT_PAYMENT});
        return;
      } catch (error) {
        next(error);
      };
    };
};

export const userEventController = new UserEventController();