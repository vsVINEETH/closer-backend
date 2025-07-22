import { Event } from "../../domain/entities/Event";
import { IEventRepository } from "../../domain/repositories/IEventRepository";
import { EventBaseType, UpcomingEventCount } from "../../usecases/dtos/EventDTO";
import { EventModel } from "../persistence/models/EventModel";
import { SortOrder } from "../config/database";
import { toEventEntityFromDoc, toEventsEntitiesFromDocs } from "../mappers/eventDataMapper";
import { BaseRepository } from "./BaseRepository";
import { IEventDocument } from "../persistence/interfaces/IEventModel";
export class EventRepository extends BaseRepository<Event, IEventDocument> implements IEventRepository {

    constructor(){
        super(EventModel, toEventEntityFromDoc, toEventsEntitiesFromDocs)
    };

    async updateSlots(event: Event): Promise<void> {
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
        };
    };

    async dashboardData(): Promise<UpcomingEventCount[]> {
        try {
            const eventsCount = await EventModel.aggregate([
                {
                    $match: { eventDate: { $gte: new Date() } },
                },
                {
                    $count: 'upcomingEvents',
                },
            ]);
            return eventsCount;
        } catch (error) {
           throw new Error('something happedn in dashboard');
        };
    };

    async findBookedEvents(userId: string): Promise<Event[]| null> {
        try {
            const events = await EventModel.find({ "buyers.userId": userId });
            return events ? toEventsEntitiesFromDocs(events) : null;
        } catch (error) {
            throw new Error("Something happened in findBookedEvents");
        };
    };
};