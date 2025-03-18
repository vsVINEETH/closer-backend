
import { EventDTO, UpcomingEventCount } from "../../usecases/dtos/EventDTO";
import { SortOrder } from "../../infrastructure/config/database";
import { Filter } from "../../../types/express";
export interface IEventRepository {
    findById(eventId: string): Promise<EventDTO | null>;
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<{events: EventDTO[], total: number} | null>
    create(eventData: EventDTO): Promise<boolean | null>;
    update(eventId: string, updatedData: Partial<EventDTO>): Promise<EventDTO | null>;
    updateSlots(eventId: string, bookedPrice: number, userId: string, bookedSlots: number): Promise<EventDTO | null>
    deleteById(eventId: string): Promise<boolean | null>;
    dashboardData(filterConstraints: Filter): Promise<UpcomingEventCount[]>
    findBookedEvents(userId: string): Promise<EventDTO[] | null>
};