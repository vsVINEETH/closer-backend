import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { SubscriptionManagement } from "../../../usecases/usecases/SubscriptionUseCase";

//repositories
import { SubscriptionRepository } from "../../../infrastructure/repositories/SubscriptionRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { WalletRepository } from "../../../infrastructure/repositories/WalletRepository";
import { SalesRepository } from "../../../infrastructure/repositories/SalesRepository";

//external services
import { RazorpayService } from "../../../infrastructure/services/Razorpay";

export class UserSubscriptionController {
    private subscriptionUseCase: SubscriptionManagement;

    constructor(){
        const razorpay = new RazorpayService();
        const subscriptionRepository = new SubscriptionRepository();
        const userRepository = new UserRepository();
        const walletRepository = new WalletRepository();
        const salesRepository = new SalesRepository();
        this.subscriptionUseCase = new SubscriptionManagement(subscriptionRepository, razorpay, userRepository, walletRepository, salesRepository);
    };

    fetchSubscription = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const subscriptionData = await this.subscriptionUseCase.fetchData();
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
        const subscriptionDetails = await this.subscriptionUseCase.selectedPlan(planId as string);
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
        const order = await this.subscriptionUseCase.createOrder(paymentOrder);
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
        const result = await this.subscriptionUseCase.verifyPayment(req.body);
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
        const result = await this.subscriptionUseCase.abortPayment(userId);
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