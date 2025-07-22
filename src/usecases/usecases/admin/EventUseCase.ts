import { IEventRepository } from "../../../domain/repositories/IEventRepository";
import { EventDTO, UpcomingEventCount, BookingDetails, OrderDTO } from "../../dtos/EventDTO";
import { Event } from "../../../domain/entities/Event";
import { IMailer } from "../../interfaces/IMailer";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRazorpay } from "../../interfaces/IRazorpay";
import { ISalesRepository } from "../../../domain/repositories/ISalesRepository";
import { Filter } from "../../../../types/express/index";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { RazorpayEventPayment } from "../../dtos/EventDTO";
import { paramToQueryEvent } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";
import { EventUseCaseResponse } from "../../types/EventTypes";
import { toBookedEvents, toEventPersistance, toEventUpdate } from "../../../infrastructure/mappers/eventDataMapper";
import { IEventUseCase } from "../../interfaces/admin/IEventUseCase";
import { toEventDTO, toEventListingDTO } from "../../../interfaces/mappers/eventDTOMapper";
export enum SaleType {
    SUBSCRIPTION = 'subscription',
    EVENT = 'event'
};

const paymentInProgress: { [key: string]: boolean } = {};

export class EventManagement implements IEventUseCase {
    constructor(
        private _eventRepository: IEventRepository,
        private _mailer: IMailer,
        private _userRepository: IUserRepository,
        private _razorpay: IRazorpay,
        private _salesRepository: ISalesRepository,
        private _s3: IS3Client
    ){};


    private async _fetchAndEnrich(query: SearchFilterSortParams): Promise<EventUseCaseResponse> {
        try {
            const queryResult = await paramToQueryEvent(query);
            const total = await this._eventRepository.countDocs(queryResult.query);
            const events = await this._eventRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );

            return { events: toEventListingDTO(events) ?? [], total: total ?? 0 };  
        } catch (error) {
            throw new Error('Something happend fetchAndEnrich')
        };
    };

    private async _slotCalculation(eventId: string, bookedPrice: number, userId: string, bookedSlots: number): Promise<Event | null>{
        try {
            const event = await this._eventRepository.findById(eventId);
            if (!event) return null;
            const totalPrice = bookedPrice * bookedSlots;

            if (!Array.isArray(event.buyers)) {
                event.buyers = [];
            };

            const existingBuyer =  event.buyers.find(b => b.userId.toString() === userId);

            if (existingBuyer) {
                existingBuyer.slotsBooked += bookedSlots;
                existingBuyer.totalPaid += totalPrice;
            } else {
                event.buyers.push({ userId, slotsBooked: bookedSlots, totalPaid: totalPrice });
            };

            event.slots = (event.slots ?? 0) - bookedSlots;
            event.totalEntries = (event.totalEntries ?? 0) + bookedSlots;
            event.totalSales = (event.totalSales ?? 0) + totalPrice;
            return event; 
        } catch (error) {
           throw new Error('Something happend in slotCalculation')
        };
    };

    private async _notifyPrimeUsers(evetData: EventDTO): Promise<void> {
        try {
            const users = await this._userRepository.findAll({ "prime.isPrime": true });
            if(!users){ return };

            const htmlContent = this._mailer.generateNewEventNotifyEmail(evetData);
             users.forEach( async (user) => {
                try{
                    await this._mailer.SendEmail(
                        user.email,
                        `New Event ${evetData.title}`,
                        htmlContent
                    );
                } catch(error){
                    console.error(`Failed to send email to ${user.email}:`, error);
                };
            });
        } catch (error) {
            throw new Error('something happend in notifyPrimeUsers')
        };
    };

    private async _notifySlotHolders(eventId: string, userId: string): Promise<void> {
        try {
            const event = await this._eventRepository.findById(eventId);
            if(event === null) return;

            const user = await this._userRepository.findById(userId);
            const htmlContent = this._mailer.generateEventReceiptEmail(event);
           
            if(user?.email){
             
             await this._mailer.SendEmail(
                user.email,
                `Tickets are here`,
                htmlContent
             );

            };

        } catch (error) {
            throw new Error('something happend in notifySlotHolders');
        };
    };

    async fetchEvents(options: SearchFilterSortParams): Promise< EventUseCaseResponse | null> {
        try {

            const events = await this._fetchAndEnrich(options);
            if (events.events) {
                await Promise.all(
                    events.events?.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return events ?? null
            };
            return null;
        } catch (error) {
           throw new Error('something happend in fetchEvents') 
        };
    };

    async fetchEvent(eventId: string): Promise<EventDTO | null> {
        try {
            const event = await this._eventRepository.findById(eventId);
            if(event){
                event.image = await Promise.all(
                    event.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                );
                return toEventDTO(event);
            }
            return null;
        } catch (error) {
            throw new Error('something happend in fetchEvent')
        };
    };

    async createEvent(eventData: EventDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise< EventUseCaseResponse | null> {
        try {
           
            const image: string[] = [];
            for(let post of imageFiles){
               const fileName = await this._s3.uploadToS3(post);
               image.push(fileName);
            };

            const newEvent = toEventPersistance(eventData)

            const result = await this._eventRepository.create({...newEvent, image});
            if(!result ) return null;

            const events = await this._fetchAndEnrich(query);
            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
            
            this._notifyPrimeUsers(eventData);
            return events ? events: null;
        } catch (error) {
            throw new Error('something happend in createEvent')
        };
    };

    async updateEvent(updatedEventData: EventDTO, query: SearchFilterSortParams): Promise<EventUseCaseResponse | null> {
        try {

            const latestData =  toEventUpdate(updatedEventData);
            const result = await this._eventRepository.update(updatedEventData.id, latestData);
            
            if(!result) return null;

            const events = await this._fetchAndEnrich(query);
            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return events;
            };
            return null;
        } catch (error) {
           throw new Error('something happend in updateEvent'); 
        };
    };

    async deleteEvent(eventId: string, query: SearchFilterSortParams): Promise< EventUseCaseResponse| null> {
        try {
            const event = await this._eventRepository.findById(eventId)

            if (event) {
                await Promise.all(
                    event.image.map(async (val) => await this._s3.deleteFromS3(val as string))
                );
                event.image = [];
            };

            const result = await this._eventRepository.deleteById(eventId);
            if(!result) return null;

            const events = await this._fetchAndEnrich(query);
            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                        );
                    })
                );

                return events;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in deleteEvent')
        };
    };

   async dashboardData(filterConstraints: Filter): Promise<UpcomingEventCount[] | null> {
     try {
        const result = await this._eventRepository.dashboardData();
        if(!result){return null}
        return result;
     } catch (error) {
       throw new Error('something happend in dashboardData')  
     };
   };

   async createOrder(orderData: OrderDTO): Promise<boolean | null | string > {
     const { amount, currency, userId, eventId, slots } = orderData;
    try {

        const event = await this._eventRepository.findById(eventId);

        if(event == null || (event.slots && slots > event.slots)){
            return null
        };

        if (paymentInProgress[userId]) return false;

        paymentInProgress[userId] = true

        return await this._razorpay.createOrder(amount, currency);
    } catch (error) {
        throw new Error('something happend in createOrder')
    };
  };

    async abortPayment(userId: string): Promise<boolean> {
        try {
            if(paymentInProgress[userId]){
                paymentInProgress[userId] = false;
                return true;
            };
            return false;
        } catch (error) {
         throw new Error('something happend in abortPayment');
        };
    };

    async verifyPayment(paymentData: RazorpayEventPayment ): Promise<boolean> {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature,
                    userId, amount, eventId, currency, slots  } = paymentData;
            const isValid = await this._razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });

            if (!isValid) return false;
            const actualBookedPrice = currency === "INR" ? amount / 100 : amount;
            const event = await this._slotCalculation(eventId, actualBookedPrice, userId,  slots)
            
            if(event === null) return false;
            await this._eventRepository.updateSlots(event);

            await this._salesRepository.create({
                userId,
                eventId: eventId,
                saleType: SaleType.EVENT,
                billedAmount: actualBookedPrice,
                bookedSlots: slots,
            });

            this._notifySlotHolders(eventId,userId);

            paymentInProgress[userId] = false;
            return true;

        } catch (error) {
            throw new Error('something happend in  verifyPayment')
        };
    };

    async paymentUsingWallet(paymentData: BookingDetails): Promise<boolean> {
        try {
            const { userId, amount, eventId, bookedSlots } = paymentData;
            const event = await this._slotCalculation(eventId,amount, userId,  bookedSlots)

            if(event === null) return false;
            await this._eventRepository.updateSlots(event);

            await this._salesRepository.create({
                userId,
                eventId: eventId,
                saleType: SaleType.EVENT,
                billedAmount: amount,
                bookedSlots,
            });

            this._notifySlotHolders(eventId,userId);  
            return true;
        } catch (error) {
            throw new Error('something happend in paymentUsingWallet')
        };
    };


    async bookedEvents(userId: string): Promise<Event[] | null> {
        try {
            const events = await this._eventRepository.findBookedEvents(userId);
            
            if(events){
              const bookedEvents = toBookedEvents(events, userId);

                await Promise.all(
                    events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return bookedEvents;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in bookedEvents');
        };
    };
};
