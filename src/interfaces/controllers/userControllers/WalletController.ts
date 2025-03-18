import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//types
import { SubscriptionPaymentWalletData } from "../../../usecases/dtos/SubscriptionDTO";

//useCase's
import { WalletManagement } from "../../../usecases/usecases/user/WalletUseCase";
import { EventManagement } from "../../../usecases/usecases/admin/EventUseCase";
import { SubscriptionManagement } from "../../../usecases/usecases/SubscriptionUseCase";

//repositories
import { WalletRepository } from "../../../infrastructure/repositories/WalletRepository";
import { SubscriptionRepository } from "../../../infrastructure/repositories/SubscriptionRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { SalesRepository } from "../../../infrastructure/repositories/SalesRepository";
import { EventRepository } from "../../../infrastructure/repositories/EventRepository";

//external services
import { Mailer } from "../../../infrastructure/services/Mailer";
import { RazorpayService } from "../../../infrastructure/services/Razorpay";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class WalletController {
    private walletUseCase: WalletManagement;
    private eventUseCase: EventManagement;
    private subscriptionUseCase: SubscriptionManagement;

    constructor(){
        const mailer = new Mailer();
        const razorpay = new RazorpayService();
        const walletRepository = new WalletRepository();
        const userRepository = new UserRepository();
        const salesRepository = new SalesRepository();
        const subscriptionRepository = new SubscriptionRepository();
        const eventRepository = new EventRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();

        this.walletUseCase = new WalletManagement(walletRepository, razorpay);
        this.eventUseCase = new EventManagement(eventRepository, mailer, userRepository,razorpay,salesRepository, s3ClientAccessControll);
        this.subscriptionUseCase = new SubscriptionManagement(subscriptionRepository, razorpay, userRepository, walletRepository, salesRepository);
    };

    fetchWallet = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.query.id;
        const result = await this.walletUseCase.fetchData(userId as string);
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
        const order = await this.walletUseCase.createOrder(req.body);
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
        const result = await this.walletUseCase.verifyPayment(req.body);
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
        const result = await this.walletUseCase.payWithWallet(paymentDetails.userId, Number(paymentDetails.amount), paymentDetails.purpose);
    
        if(paymentDetails.purpose == 'subscription'){
           await this.subscriptionUseCase.paymentUsingWallet({userId: paymentDetails.userId, planType: paymentDetails.planType ,amount: paymentDetails.amount, planId: paymentDetails.planId});
        }
    
        if(paymentDetails.purpose == 'Event booking'){
          await  this.eventUseCase.paymentUsingWallet({userId: paymentDetails.userId, amount: paymentDetails.amount, eventId: paymentDetails.eventId, bookedSlots: paymentDetails.slots});
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