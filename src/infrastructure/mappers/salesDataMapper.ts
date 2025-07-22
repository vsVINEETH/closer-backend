import { Sales } from "../../domain/entities/Sales";
import { ISalesDocument } from "../persistence/interfaces/ISalesModel";

export function toSalesEnitiyFromDoc(doc: ISalesDocument): Sales {
    try {
      return new Sales({
            userId: doc.userId?.toString(),
            saleType: doc.saleType,
            billedAmount: doc.billedAmount,
            subscriptionId:doc.subscriptionId?.toString(),
            planType: doc.planType,
            eventId: doc.eventId?.toString(),
            bookedSlots: doc.bookedSlots,
      })  
    } catch (error) {
       throw new Error('Something happend in toSalesEnitiy') 
    };
};

export function toSalesEntitiesFromDocs(docs: ISalesDocument[]): Sales[] {
    try {
      return docs.map((doc) => (
        new Sales({
            userId: doc.userId?.toString(),
            saleType: doc.saleType,
            billedAmount: doc.billedAmount,
            subscriptionId:doc.subscriptionId?.toString(),
            planType: doc.planType,
            eventId: doc.eventId?.toString(),
            bookedSlots: doc.bookedSlots,
        })
      ));  
    } catch (error) {
       throw new Error('Something happend in toSalesEntitiesFromDocs') 
    };
};