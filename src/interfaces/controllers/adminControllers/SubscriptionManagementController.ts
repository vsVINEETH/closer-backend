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
import { paramsNormalizer } from "../../utils/filterNormalizer";


export class SubscriptionManagementController {
    private subscriptionUseCase: SubscriptionManagement;

    constructor(){
        const razorpay = new RazorpayService();
        const subscriptionRepository = new SubscriptionRepository();
        const userRepository = new UserRepository();
        const walletRepository = new WalletRepository();
        const salesRepository = new SalesRepository();

        this.subscriptionUseCase = new SubscriptionManagement(subscriptionRepository, razorpay, userRepository, walletRepository, salesRepository);
    };


    fetchSubscriptionData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this.subscriptionUseCase.fetchData(filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            }
            res.status(HttpStatus.NO_CONTENT).json({message:ResponseMessages.NO_CONTENT_OR_DATA})
        } catch (error) {
            next(error)
        }
    };


    handleSubscriptionListing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subscriptionId = req.body.id;
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this.subscriptionUseCase.handleListing(subscriptionId, filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return
            }
            res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE})
        } catch (error) {
            next(error)
        }
    };

    updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const subscriptionId = req.body._id;
           const subscriptionPrice = req.body.price;
           const filterOptions = await paramsNormalizer(req.query)
           const field = Object.keys(req.body).find(key => key === 'price')
        
           if(field){
            const result = await this.subscriptionUseCase.update(subscriptionId, field, subscriptionPrice, filterOptions)
                if(result){
                   res.status(HttpStatus.OK).json(result);
                   return
                }
           }
          res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
          return
        } catch (error) {
            next(error)
        }
    };
};

export const subscriptionManagementController = new SubscriptionManagementController()