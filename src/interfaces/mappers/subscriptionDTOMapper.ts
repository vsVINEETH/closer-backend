import { Request } from "express";
import { Subscription } from "../../domain/entities/Subscription";
import { SubscriptionDTO } from "../../usecases/dtos/SubscriptionDTO";
import { paramsNormalizer } from "../utils/filterNormalizer";

export function toSubscriptionDTO(subscription: Subscription): SubscriptionDTO {
    try {
       return {
        id: subscription.id,
        planType: subscription.planType,
        price: subscription.price,
        isListed: subscription.isListed,
        createdAt: subscription.createdAt
       } 
    } catch (error) {
      throw new Error('Something happend in toSubscriptionDTO')  
    };
};

export function toSubscriptionDTOs(subscriptions: Subscription[] | null): SubscriptionDTO[]{
    try {
        
       return subscriptions? subscriptions.map((sub) => ({
        id:sub.id,
        planType: sub.planType,
        price: sub.price,
        isListed: sub.isListed,
        createdAt: sub.createdAt
       })): []; 
    } catch (error) {
        throw new Error('Something happend in toSubscriptionDTOs');
    };
};

export async function mapUpdateSubscriptionRequest(req: Request) {
    try {
       return {
            subscriptionId : req.body.id,
            subscriptionPrice : req.body.price,
            filterOptions : await paramsNormalizer(req.query),
            field : Object.keys(req.body).find(key => key === 'price')
       };
    } catch (error) {
      throw new Error('Something happend in mapUpdateSubscriptionRequest')  
    }
}; 

export async function mapListingSubscriptionRequest(req: Request) {
    try {
       return {
         subscriptionId : req.body.id,
        filterOptions : await paramsNormalizer(req.query),
       } 
    } catch (error) {
     throw new Error('Something happend in mapUpdateSubscriptionRequest')  
    };
};