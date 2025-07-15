import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

import { subscriptionUseCases } from "../../../di/general.di";

export class UserSubscriptionController {

    constructor(
      private _subscriptionUseCase = subscriptionUseCases
    ){}

    fetchSubscription = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const subscriptionData = await this._subscriptionUseCase.fetchData();
        if(subscriptionData){
          res.status(HttpStatus.OK).json(subscriptionData);
          return;
        }
        res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA})
      } catch (error) {
        next(error)
      }
    };

    selectedSubscription = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { planId  } = req.query ;
        const subscriptionDetails = await this._subscriptionUseCase.selectedPlan(planId as string);
        if(subscriptionDetails){
          res.status(HttpStatus.OK).json(subscriptionDetails);
          return
        }
        res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.INVALID_ID});
      } catch (error) {
        next(error)
      }
    };

    createOrder = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const paymentOrder = req.body;
        const order = await this._subscriptionUseCase.createOrder(paymentOrder);
        if(order){
          res.status(HttpStatus.ACCEPTED).json(order)
          return
        }
        res.status(HttpStatus.CONFLICT).json({message: ResponseMessages.PAYMENT_IN_PROGRESS});
        return;
      } catch (error) {
        next(error)
      }
    };


    verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this._subscriptionUseCase.verifyPayment(req.body);
        if(result){
          res.status(HttpStatus.ACCEPTED).json(result);
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.INVALID_PAYMENT_SIGNATURE});
        return
      } catch (error) {
        next(error);
      }
    };

    abortPayment = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {userId} = req.body;
        const result = await this._subscriptionUseCase.abortPayment(userId);
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

export const userSubscriptionController = new UserSubscriptionController()