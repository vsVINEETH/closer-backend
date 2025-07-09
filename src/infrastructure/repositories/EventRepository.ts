import { Event } from "../../domain/entities/Event";
import { IEventRepository } from "../../domain/repositories/IEventRepository";
import { EventBaseType, EventDTO, UpcomingEventCount } from "../../usecases/dtos/EventDTO";
import { EventModel } from "../persistence/models/EventModel";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";
import { EventDocument } from "../persistence/interfaces/IEventModel";

export class EventRepository implements IEventRepository {

    async findAll<T>( 
            query: Record<string, T> = {},
            sort: { [key: string]: SortOrder } = {},
            skip: number = 0,
            limit: number = 0
        ): Promise<EventDocument[]| null> {
        try {
          const events = await EventModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit);

          return events;

        } catch (error) {
            throw new Error('something happend in findAll')
        }
    };

    async countDocs<T>(query: Record<string, T> = {}): Promise<number> {
        try {
            const totalDocs = await EventModel.countDocuments(query);
            return totalDocs;
        } catch (error) {
            throw new Error("something happend in countDocs");
        };
    };

    async findById(eventId: string): Promise<EventDocument | null> {
        try {
            const event = await EventModel.findById(eventId);
            return event;
        } catch (error) {
           throw new Error('something happend in findById') 
        }
    };

    async create(eventData: EventBaseType): Promise<boolean | null> {
        try {
           
           const newEvent = new EventModel(eventData);
           const result = await newEvent.save();
           return result !== null

        } catch (error) {
           throw new Error('something happend in create') 
        }
    };

    async update(eventId: string, updatedData: EventBaseType): Promise<boolean| null> {
        try {

            const updatedEvent = await EventModel.findByIdAndUpdate(eventId,
             updatedData, 
             {
                new: true, 
            });
            
            if (!updatedEvent) { return null}
            return true;

        } catch (error) {
            throw new Error('Something happened in update');
        }
    };

    async updateSlots(event: EventDTO): Promise<void> {
    try {
        await EventModel.findByIdAndUpdate(
        event.id,
        {
            $set: {
            buyers: event.buyers,
            slots: event.slots,
            totalEntries: event.totalEntries,
            totalSales: event.totalSales,
            },
        },
        { new: true }
        );
    } catch (error) {
        throw new Error('Something happened in updateSlots');
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

    async findBookedEvents(userId: string): Promise<EventDocument[]| null> {
        try {
            const events = await EventModel.find({ "buyers.userId": userId });
            return events;
        } catch (error) {
            console.error("Error in findBookedEvents:", error);
            throw new Error("Something happened in findBookedEvents");
        }
    };
     
};