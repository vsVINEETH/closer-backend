import { ISubscriptionDocument } from "../persistence/interfaces/ISubscription";
import { Subscription } from "../../domain/entities/Subscription";

export function toSubscriptionEntityFromDoc(doc: ISubscriptionDocument): Subscription {
    try {
        return new Subscription({
            id: doc.id,
            planType: doc.planType,
            price: doc.price,
            isListed: doc.isListed,
            createdAt: doc.createdAt
        });
    } catch (error) {
       throw new Error('Something happend in toSubscriptionEntityFromDoc') 
    };
};

export function toSubscriptionEntitiesFromDocs(docs: ISubscriptionDocument[]): Subscription[] {
    try {
        return docs.map((doc) => (
           new Subscription({
            id: doc.id,
            planType: doc.planType,
            price: doc.price,
            isListed: doc.isListed,
            createdAt: doc.createdAt
          }) 
        ));
    } catch (error) {
       throw new Error('Something happend in toSubscriptionEntitiesFromDocs') 
    };
};