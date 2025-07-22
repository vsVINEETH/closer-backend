
import { EventBaseType, UpcomingEventCount } from "../../usecases/dtos/EventDTO";
import { Event } from "../entities/Event";
import { SortOrder } from "../../infrastructure/config/database";

export interface IEventRepository {
    findById(eventId: string): Promise<Event | null>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< Event[] | null>
    create(eventData: EventBaseType): Promise<Event>;
    countDocs<T>(query: Record<string, T> ): Promise<number>
    update(eventId: string, updatedData: EventBaseType): Promise<Event | null>;
    updateSlots(event: Event): Promise<void>;
    deleteById(eventId: string): Promise<boolean | null>;
    dashboardData(): Promise<UpcomingEventCount[]>
    findBookedEvents(userId: string): Promise<Event[] | null>
};