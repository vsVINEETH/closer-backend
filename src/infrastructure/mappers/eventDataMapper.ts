import { Event } from "../../domain/entities/Event";
import { EventDTO } from "../../usecases/dtos/EventDTO";
import { IEventDocument } from "../persistence/interfaces/IEventModel";
import { EventPersistanceType, EventUpdateType } from "../types/EventType";

export function toEventEntityFromDoc(doc: IEventDocument) :Event {
    try {
      return new Event({ 
         id: doc.id,
         title: doc.title,
         description: doc.description,
         image: doc.image,
         location: doc.location,
         locationURL:doc.locationURL,
         eventDate: doc.eventDate,
         slots: doc.slots,
         totalEntries: doc.totalEntries,
         totalSales: doc.totalSales,
         price: doc.price,
         createdAt: doc.createdAt,
         buyers: doc.buyers
      })  
    } catch (error) {
       throw new Error('Something happend in toEventEntityFromDoc');
    };
};

export function toEventsEntitiesFromDocs(docs: IEventDocument[]): Event[] {
    try {
      return docs.map((doc) => (
        new Event({
         id: doc.id,
         title: doc.title,
         description: doc.description,
         image: doc.image,
         location: doc.location,
         locationURL:doc.locationURL,
         eventDate: doc.eventDate,
         slots: doc.slots,
         totalEntries: doc.totalEntries,
         totalSales: doc.totalSales,
         price: doc.price,
         createdAt: doc.createdAt,
         buyers: doc.buyers
        })
      ))  
    } catch (error) {
       throw new Error('Something happend in toEventsEntitiesFromDocs') 
    };
};

export function toEventPersistance(event: EventDTO): EventPersistanceType {
    try {
        return {
            title: event.title,
            description: event.description,
            image: event.image,
            location: event.location,
            locationURL: event.locationURL,
            eventDate: event.eventDate,
            slots: Number(event.slots),
            price: Number(event.price),
        };  
    } catch (error) {
      throw new Error('Something happend in toEventPersistance')
    };
};


export function toEventUpdate(event: EventDTO): EventUpdateType {
    try {
        return {
            title: event.title,
            description: event.description,
            location: event.location,
            locationURL: event.locationURL,
            eventDate: event.eventDate,
            slots: Number(event.slots),
            price: Number(event.price), 
        };   
    } catch (error) {
       throw new Error('Somethig happend in toEventUpdate') 
    };
};


export function toBookedEvents(events: Event[], userId: string): Event[] {
    try {
        return events.map((event) => {              
        
        const buyerDetails = event.buyers.find(
            (buyer) => buyer.userId.toString() === userId
        );

            return {
                id: event.id,
                title: event.title,
                description: event.description,
                image: event.image,
                location: event.location,
                locationURL: event.locationURL,
                eventDate: event.eventDate,
                slots: event.slots,
                totalEntries: event.totalEntries,
                price: event.price,
                buyers: buyerDetails
                    ? [
                        {
                            userId: buyerDetails.userId.toString(),
                            slotsBooked: buyerDetails.slotsBooked,
                            totalPaid: buyerDetails.totalPaid,
                        },
                    ]
                    : [], 
            };
        });  
    } catch (error) {
       throw new Error('Something happend in toBookedEvents') 
    };
};