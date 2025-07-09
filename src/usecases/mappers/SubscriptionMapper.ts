import { SubscriptionDocument } from "../../infrastructure/persistence/interfaces/ISubscription";
import { SubscriptionDTO } from "../dtos/SubscriptionDTO";
import { Subscription } from "../../domain/entities/Subscription";

export function toEntities(subsDocs: SubscriptionDocument[] | null): Subscription[] | null {
    try {
      if (!subsDocs) {return null};
      
      const subscriptions = subsDocs.map(
        (sub) =>
          new Subscription(
            sub.id,
            sub.planType,
            sub.price,
            sub.isListed,
            new Date(sub.createdAt).toLocaleDateString()
          )
      );

      return subscriptions;   
    } catch (error) {
        throw new Error('Something happend in toEntities')
    };

  };

export function toDTOs(subscriptions: Subscription[]):{ subscriptions:SubscriptionDTO[]}  {
    try {
       return { subscriptions: subscriptions }; 
    } catch (error) {
     throw new Error('Something happend in toDTOs')
    };
};

export function toEntity(subsDocs: SubscriptionDocument ): Subscription | null {
    try {
        if(!subsDocs) return null;
        return new Subscription(
            subsDocs.id,
            subsDocs.planType,
            subsDocs.price,
            subsDocs.isListed,
            new Date(subsDocs.createdAt).toLocaleDateString()
        );
    } catch (error) {
       throw new Error('Something happend in toEnity');
    };
};

export function toDTO(subsDocs: Subscription ): SubscriptionDTO {

    try {
        return {
            id: subsDocs.id,
            planType: subsDocs.planType,
            price: subsDocs.price,
            isListed: subsDocs.isListed,
            createdAt: subsDocs.createdAt,
        };
    } catch (error) {
       throw new Error('Something happend in toDTO') 
    };
};