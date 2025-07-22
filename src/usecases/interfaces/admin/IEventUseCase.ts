import { Filter } from "../../../../types/express";
import { Event } from "../../../domain/entities/Event";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { BookingDetails, EventDTO, OrderDTO, RazorpayEventPayment, UpcomingEventCount } from "../../dtos/EventDTO";
import { EventUseCaseResponse } from "../../types/EventTypes";

export interface IEventUseCase {
 fetchEvents(options: SearchFilterSortParams): Promise< EventUseCaseResponse | null>
 fetchEvent(eventId: string): Promise<EventDTO | null>;
 createEvent(eventData: EventDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise< EventUseCaseResponse | null> 
 updateEvent(updatedEventData: EventDTO, query: SearchFilterSortParams): Promise<EventUseCaseResponse | null>
 deleteEvent(eventId: string, query: SearchFilterSortParams): Promise< EventUseCaseResponse| null>;
 dashboardData(filterConstraints: Filter): Promise<UpcomingEventCount[] | null>;
 createOrder(orderData: OrderDTO): Promise<boolean | null | string >;
 abortPayment(userId: string): Promise<boolean> ;
 verifyPayment(paymentData: RazorpayEventPayment ): Promise<boolean>
 paymentUsingWallet(paymentData: BookingDetails): Promise<boolean>
 bookedEvents(userId: string): Promise<Event[] | null>
};
