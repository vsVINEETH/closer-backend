import { Event } from "../../domain/entities/Event";
import { IEventRepository } from "../../domain/repositories/IEventRepository";
import { EventDTO, UpcomingEventCount } from "../../usecases/dtos/EventDTO";
import { EventModel } from "../persistence/models/EventModel";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";

export class EventRepository implements IEventRepository {

    async findAll<T>( 
            query: Record<string, T> = {},
            sort: { [key: string]: SortOrder } = {},
            skip: number = 0,
            limit: number = 0
        ): Promise<{events: EventDTO[], total: number} | null> {
        try {
          const events = await EventModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit);

          const total = await EventModel.countDocuments(query);
          return {events: events, total: total};
        } catch (error) {
            throw new Error('something happend in findAll')
        }
    }

    async findById(eventId: string): Promise<EventDTO | null> {
        try {
            const event = await EventModel.findById(eventId);
            return event;
        } catch (error) {
           throw new Error('something happend in findById') 
        }
    };

    async create(eventData: EventDTO): Promise<boolean | null> {
        try {
           
           const newEvent = new EventModel({
            title: eventData.title,
            description: eventData.description,
            image: eventData.image,
            location: eventData.location,
            locationURL: eventData.locationURL,
            eventDate: eventData.eventDate,
            slots: Number(eventData.slots),
            price: Number(eventData.price),
           });

           const result = await newEvent.save();
           return result !== null

        } catch (error) {
           throw new Error('something happend in create') 
        }
    }

    async update(eventId: string, updatedData: EventDTO): Promise<EventDTO | null> {
        try {

            const updatedEvent = await EventModel.findByIdAndUpdate(eventId,
                {
                    title: updatedData.title,
                    description: updatedData.description,
                    location: updatedData.location,
                    locationURL: updatedData.locationURL,
                    eventDate: updatedData.eventDate,
                    slots: Number(updatedData.slots),
                    price: Number(updatedData.price),
                   }, 
             {
                new: true, 
            });
            
            if (!updatedEvent) { return null}
            return updatedEvent;

        } catch (error) {
            throw new Error('Something happened in update');
        }
    }

    async updateSlots(eventId: string, bookedPrice: number, userId: string, bookedSlots: number): Promise<EventDTO | null> {
        try {
            const event = await EventModel.findById(eventId);
            if(!event) return null

            if (!Array.isArray(event.buyers)) {
                event.buyers = [];
            }
          
            const existingBuyer = event.buyers.find((buyer) => buyer.userId?.toString() === userId);
            const totalPrice = bookedPrice * bookedSlots;

            if (existingBuyer) {
                existingBuyer.slotsBooked += bookedSlots;
                existingBuyer.totalPaid += totalPrice;
            } else {
                // Add new buyer record
                event.buyers.push({
                    userId,
                    slotsBooked: bookedSlots,
                    totalPaid: totalPrice,
                });
            };
    
            // Update event stats
            event.slots -= bookedSlots;
            event.totalEntries += bookedSlots;
            event.totalSales += totalPrice;

            // Save updated event
            await event.save();
    
            return event;
        } catch (error) {
            throw new Error('Something happened in updateSlots: ');
        }
    }
    

    async deleteById(eventId: string): Promise<boolean | null> {
        try {
          const result = await EventModel.findByIdAndDelete(eventId);
          if(!result){return null};
          return true;
        } catch (error) {
            throw new Error('something happend in deleteById')
        }
    }

    async dashboardData(filterConstraints: Filter): Promise<UpcomingEventCount[]> {
        try {

            const result = await EventModel.aggregate([
                {
                    $match: { eventDate: { $gte: new Date() } },
                },
                {
                    $count: 'upcomingEvents',
                },
            ]);
              return result;
        } catch (error) {
           throw new Error('something happedn in dashboard');
        }
    }

    async findBookedEvents(userId: string): Promise<EventDTO[] | null> {
        try {
           
            const events = await EventModel.find({ "buyers.userId": userId });
    
            return events.length > 0
                ? events.map((event) => {
                  
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
                })
                : null;
        } catch (error) {
            console.error("Error in findBookedEvents:", error);
            throw new Error("Something happened in findBookedEvents");
        }
    }
    
    
}