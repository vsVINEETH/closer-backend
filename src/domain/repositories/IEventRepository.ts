
import { EventBaseType, EventDTO, UpcomingEventCount, EventSlots } from "../../usecases/dtos/EventDTO";
import { Event } from "../entities/Event";
import { SortOrder } from "../../infrastructure/config/database";
import { Filter } from "../../../types/express";
import { EventDocument } from "../../infrastructure/persistence/interfaces/IEventModel";
export interface IEventRepository {
    findById(eventId: string): Promise<EventDocument | null>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< EventDocument[] | null>
    create(eventData: EventBaseType): Promise<boolean | null>;
    countDocs<T>(query: Record<string, T> ): Promise<number>
    update(eventId: string, updatedData: EventBaseType): Promise<boolean | null>;
    updateSlots(event: EventDTO): Promise<void>;
    deleteById(eventId: string): Promise<boolean | null>;
    dashboardData(filterConstraints: Filter): Promise<UpcomingEventCount[]>
    findBookedEvents(userId: string): Promise<EventDocument[] | null>
};