import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { eventUseCase, subscriptionUseCases } from "../../../di/general.di";
import { walletUseCases } from "../../../di/user.di";

export class WalletController {

    constructor(
      private _walletUseCase = walletUseCases,
      private _eventUseCase = eventUseCase,
      private _subscriptionUseCase = subscriptionUseCases,
    ){}

    fetchWallet = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id;
        const result = await this._walletUseCase.fetchData(userId as string);
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

    createWalletOrder = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const order = await this._walletUseCase.createOrder(req.body);
        if(order){
          res.status(HttpStatus.ACCEPTED).json(order);
          return
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_CREATE_ORDER})
        return;
      } catch (error) {
        next(error)
      }
    }

    verifyWalletPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this._walletUseCase.verifyPayment(req.body);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.INVALID_PAYMENT_SIGNATURE});
        return
      } catch (error) {
        next(error)
      }
    };

    payWithWallet = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const paymentDetails = req.body;
        const result = await this._walletUseCase.payWithWallet(paymentDetails.userId, Number(paymentDetails.amount), paymentDetails.purpose);
    
        if(paymentDetails.purpose == 'subscription'){
           await this._subscriptionUseCase.paymentUsingWallet({userId: paymentDetails.userId, planType: paymentDetails.planType ,amount: paymentDetails.amount, planId: paymentDetails.planId});
        }
    
        if(paymentDetails.purpose == 'Event booking'){
          await  this._eventUseCase.paymentUsingWallet({userId: paymentDetails.userId, amount: paymentDetails.amount, eventId: paymentDetails.eventId, bookedSlots: paymentDetails.slots});
        }
        
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.NOT_ACCEPTABLE).json({message: ResponseMessages.INSUFFICIENT_BALANCE});
        return;
      } catch (error) {
        next(error)
      }
    };
}

export const walletController = new WalletController()