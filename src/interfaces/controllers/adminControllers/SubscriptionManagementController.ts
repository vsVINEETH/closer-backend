import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { subscriptionUseCases } from "../../../di/general.di";
import { ISubscriptionUseCase } from "../../../usecases/interfaces/common/ISubscriptionUseCase";
import { mapListingSubscriptionRequest, mapUpdateSubscriptionRequest } from "../../mappers/subscriptionDTOMapper";
export class SubscriptionManagementController {

    constructor(
        private _subscriptionUseCase : ISubscriptionUseCase
    ){};


    fetchSubscriptionData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this._subscriptionUseCase.fetchData(filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            };
            res.status(HttpStatus.NO_CONTENT).json({message:ResponseMessages.NO_CONTENT_OR_DATA})
        } catch (error) {
            next(error);
        };
    };


    handleSubscriptionListing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { subscriptionId, filterOptions } = await mapListingSubscriptionRequest(req);
            const result = await this._subscriptionUseCase.handleListing(subscriptionId, filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            }
            res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE})
        } catch (error) {
            next(error)
        };
    };

    updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
        try {

           const {subscriptionId, subscriptionPrice,filterOptions, field} = await mapUpdateSubscriptionRequest(req)
        
           if(field){
            const result = await this._subscriptionUseCase.update(subscriptionId, field, subscriptionPrice, filterOptions)
                if(result){
                   res.status(HttpStatus.OK).json(result);
                   return;
                };
           };
          res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
          return;
        } catch (error) {
            next(error);
        };
    };
};

export const subscriptionManagementController = new SubscriptionManagementController(subscriptionUseCases)