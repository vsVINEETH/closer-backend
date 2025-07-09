import { EventDocument } from "../../infrastructure/persistence/interfaces/IEventModel";
import { Event } from "../../domain/entities/Event";
import { EventDTO } from "../dtos/EventDTO";

export function toEntities(doc: EventDocument[] | null): Event[] | null {
    try {
      if (!doc) {return null};
      
      const events = doc.map(
        (evt) =>
          new Event(
            evt.id,
            evt.title,
            evt.description,
            evt.image,
            evt.location,
            evt.locationURL,
            evt.eventDate,
            evt.slots,
            evt.totalEntries,
            evt.totalSales,
            evt.price,
            evt.createdAt,
            evt.buyers
          )
      );

      return events;   
    } catch (error) {
        throw new Error('Something happend in toEntities')
    };

  };

  export function toDTOs(events: Event[]):{ events:Event[]}  {
      try {
         return { events: events }; 
      } catch (error) {
       throw new Error('Something happend in toDTOs')
      };
  };
  

  export function toEntity(event: EventDocument ): Event | null {
      try {
          if(!event) return null;
          return new Event(
            event.id,
            event.title,
            event.description,
            event.image,
            event.location,
            event.locationURL,
            event.eventDate,
            event.slots,
            event.totalEntries,
            event.totalSales,
            event.price,
            event.createdAt,
            event.buyers
          );
      } catch (error) {
         throw new Error('Something happend in toEnity');
      };
  };

  export function toDTO(event: Event ): EventDTO {
  
      try {
          return {
            id:event.id,
            title: event.title,
            description:event.description,
            image:event.image,
            location:event.location,
            locationURL:event.locationURL,
            eventDate: event.eventDate,
            slots:event.slots,
            totalEntries:event.totalEntries,
            totalSales: event.totalSales,
            price: event.price,
            buyers: event.buyers
          };
      } catch (error) {
         throw new Error('Something happend in toDTO') 
      };
  };