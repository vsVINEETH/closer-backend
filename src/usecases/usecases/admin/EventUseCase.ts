import { IEventRepository } from "../../../domain/repositories/IEventRepository";
import { EventDTO, EditEventDTO, UpcomingEventCount, BookingDetails } from "../../dtos/EventDTO";
import { Event } from "../../../domain/entities/Event";
import { IMailer } from "../../interfaces/IMailer";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRazorpay } from "../../interfaces/IRazorpay";
import { WalletDTO } from "../../dtos/WalletDTO";
import { ISalesRepository } from "../../../domain/repositories/ISalesRepository";
import { ClientQuery, Filter } from "../../../../types/express/index";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { RazorpayEventPayment } from "../../dtos/EventDTO";
import { paramToQueryEvent } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";
import { toDTOs, toEntities, toEntity, toDTO } from "../../mappers/EventMapper";


export enum SaleType {
    SUBSCRIPTION = 'subscription',
    EVENT = 'event'
 }

const paymentInProgress: { [key: string]: boolean } = {};

export class EventManagement {
    constructor(
        private eventRepository: IEventRepository,
        private mailer: IMailer,
        private userRepository: IUserRepository,
        private razorpay: IRazorpay,
        private salesRepository: ISalesRepository,
        private s3: IS3Client
    ){};

    private async slotCalculation(eventId: string, bookedPrice: number, userId: string, bookedSlots: number): Promise<EventDTO | null>{
        const eventDoc = await this.eventRepository.findById(eventId);
        if(eventDoc === null) return null;
        const eventEntity = toEntity(eventDoc);

        if(eventEntity === null) return null;

        const event = toDTO(eventEntity);
        if (!event) return null;

        const totalPrice = bookedPrice * bookedSlots;

        
        if (!Array.isArray(event.buyers)) {
            event.buyers = [];
        }

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
        return event
    }

    private async notifyPrimeUsers(evetData: EventDTO): Promise<void> {
        try {
            const users = await this.userRepository.findAll({ "prime.isPrime": true });
            if(!users){ return };

            const htmlContent = this.mailer.generateNewEventNotifyEmail(evetData);
             users.users.forEach( async (user) => {
                try{
                    await this.mailer.SendEmail(
                        user.email,
                        `New Event ${evetData.title}`,
                        htmlContent
                    );
                } catch(error){
                    console.error(`Failed to send email to ${user.email}:`, error);
                }

            });
        } catch (error) {
            throw new Error('something happend in notifyPrimeUsers')
        }
    }

    private async notifySlotHolders(eventId: string, userId: string): Promise<void> {
        try {
            const event = await this.eventRepository.findById(eventId);

            if(event === null) return;

            const eventEntity = toEntity(event);
            if(eventEntity === null) return;

            const eventData = toDTO(eventEntity)

            const user = await this.userRepository.findById(userId);
            const htmlContent = this.mailer.generateEventReceiptEmail(eventData);
            if(user?.email)
            await this.mailer.SendEmail(
                user.email,
                `Tickets are here`,
                htmlContent
            )

        } catch (error) {
            throw new Error('something happend in notifySlotHolders');
        }
    }

    async fetchEvents(options: SearchFilterSortParams): Promise< {events: Event[], total: number} | null> {
        try {
            const queryResult = await paramToQueryEvent(options)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );
            const eventsDocCount = await this.eventRepository.countDocs(queryResult.query)
            const eventEntity = toEntities(events);
            if(eventEntity === null) return null;

            const eventData = toDTOs(eventEntity);
            if (eventData?.events) {
                await Promise.all(
                    eventData.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return {events: eventData.events, total: eventsDocCount};
            };
            return null;
        } catch (error) {
           throw new Error('something happend in fetchEvents') 
        }
    }

    async fetchEvent(eventId: string): Promise<EventDTO | null> {
        try {
            const event = await this.eventRepository.findById(eventId);

            if(event === null) return null;
            const eventEntity = toEntity(event);

            if(eventEntity === null) return null;
            const eventData = toDTO(eventEntity)

            if(eventData){
                eventData.image = await Promise.all(
                    eventData.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                );
                return eventData;
            }
            return null;
        } catch (error) {
            throw new Error('something happend in fetchEvent')
        }
    }

    async createEvent(eventData: EventDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise< {events: Event[], total: number} | null> {
        try {
            const image: string[] = [];
            for(let post of imageFiles){
               const fileName = await this.s3.uploadToS3(post);
               image.push(fileName);
            };

            const newEvent = {
            title: eventData.title,
            description: eventData.description,
            image: eventData.image,
            location: eventData.location,
            locationURL: eventData.locationURL,
            eventDate: eventData.eventDate,
            slots: Number(eventData.slots),
            price: Number(eventData.price),
            };
            

           const result = await this.eventRepository.create({...newEvent, image});
            if(!result ){ return null };
            const queryResult = await paramToQueryEvent(query)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );
            const eventsDocCount = await this.eventRepository.countDocs(queryResult.query)
            const eventEntity = toEntities(events);
            if(eventEntity === null) return null;

            const eventDocs = toDTOs(eventEntity);
            if (eventDocs?.events) {
                await Promise.all(
                    eventDocs.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
            
            this.notifyPrimeUsers(eventData);
            return eventDocs ? {events: eventDocs.events, total: eventsDocCount}: null;
        } catch (error) {
            throw new Error('something happend in createEvent')
        }
    };

    async updateEvent(updatedEventData: EventDTO, query: SearchFilterSortParams): Promise<{events: Event[], total: number} | null> {
        try {

            const latestData =   {
                title: updatedEventData.title,
                description: updatedEventData.description,
                location: updatedEventData.location,
                locationURL: updatedEventData.locationURL,
                eventDate: updatedEventData.eventDate,
                slots: Number(updatedEventData.slots),
                price: Number(updatedEventData.price),
            };

            const result = await this.eventRepository.update(updatedEventData.id, latestData);
            if(!result) {return null};
            const queryResult = await paramToQueryEvent(query)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );
            const eventsDocCount = await this.eventRepository.countDocs(queryResult.query)
            const eventEntity = toEntities(events);
            if(eventEntity === null) return null;

            const eventDocs = toDTOs(eventEntity);

            if (eventDocs?.events) {
                await Promise.all(
                    eventDocs.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return {events: eventDocs.events, total: eventsDocCount};
            };
            return null;
        } catch (error) {
           throw new Error('something happend in updateEvent'); 
        }
    };

    async deleteEvent(eventId: string, query: SearchFilterSortParams): Promise< {events: Event[], total: number}| null> {
        try {
            const event = await this.eventRepository.findById(eventId)

            if(event === null) return null;
            const eventEntity = toEntity(event);

            if(eventEntity === null) return null;
            const eventData = toDTO(eventEntity)
           
            if (eventData) {
                await Promise.all(
                    eventData.image.map(async (val) => await this.s3.deleteFromS3(val as string))
                );
                eventData.image = [];
            };
            const result = await this.eventRepository.deleteById(eventId);
            if(!result){return null}

            const queryResult = await paramToQueryEvent(query)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );

            const eventsDocCount = await this.eventRepository.countDocs(queryResult.query)
            const eventEntities = toEntities(events);
            if(eventEntities === null) return null;

            const eventDocs = toDTOs(eventEntities);

            if (eventDocs?.events) {
                await Promise.all(
                    eventDocs.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );

                return {events: eventDocs.events, total: eventsDocCount}
            };
            return null;
        } catch (error) {
            throw new Error('something happend in deleteEvent')
        }
    };

   async dashboardData(filterConstraints: Filter): Promise<UpcomingEventCount[] | null> {
    try {
       const result = await this.eventRepository.dashboardData(filterConstraints);
       if(!result){return null}
        return result;
    } catch (error) {
      throw new Error('something happend in dashboardData')  
    }
   }

   async createOrder(orderData: {amount: number, currency: string, userId: string, eventId: string, slots: number}): Promise<boolean | null | string > {
    const { amount, currency, userId, eventId, slots } = orderData;
    try {

        const event = await this.eventRepository.findById(eventId);
        if(event === null) return null;
        const eventEntity = toEntity(event);

        if(eventEntity === null) return null;
        const eventData = toDTO(eventEntity)
        
        if(eventData == null || (eventData.slots && slots > eventData.slots)){
            return null
        };

        if (paymentInProgress[userId]) {
            return false
        }
        paymentInProgress[userId] = true
        return await this.razorpay.createOrder(amount, currency);
    } catch (error) {
        throw new Error('something happend in createOrder')
    }
  }

    async abortPayment(userId: string): Promise<boolean> {
        try {
            if(paymentInProgress[userId]){
                paymentInProgress[userId] = false;
                return true
            }
            return false
        } catch (error) {
        throw new Error('something happend in abortPayment');
        }
    }

    async verifyPayment(paymentData: RazorpayEventPayment ): Promise<boolean> {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount, eventId, currency, slots  } = paymentData;
            const isValid = await this.razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });

            if (!isValid) return false;
            const actualBookedPrice = currency === "INR" ? amount / 100 : amount;
            const event = await this.slotCalculation(eventId,actualBookedPrice, userId,  slots)
            
            if(event === null) return false;
            console.log(event,'kolaa');
            await this.eventRepository.updateSlots(event);
            await this.salesRepository.create({
                userId,
                eventId: eventId,
                saleType: SaleType.EVENT,
                billedAmount: actualBookedPrice,
                bookedSlots: slots,
            });
            this.notifySlotHolders(eventId,userId)
            paymentInProgress[userId] = false;
            return true;

        } catch (error) {
            throw new Error('something happend in  verifyPayment')
        }

    };

    async paymentUsingWallet(paymentData: BookingDetails): Promise<boolean> {
        try {
            const { userId, amount, eventId, bookedSlots } = paymentData;
            const event = await this.slotCalculation(eventId,amount, userId,  bookedSlots)
            console.log(event)
            if(event === null) return false;
            await this.eventRepository.updateSlots(event);            
            await this.salesRepository.create({
                userId,
                eventId: eventId,
                saleType: SaleType.EVENT,
                billedAmount: amount,
                bookedSlots,
            });
            this.notifySlotHolders(eventId,userId);  
            return true;
        } catch (error) {
            throw new Error('something happend in paymentUsingWallet')
        }
    }


    async bookedEvents(userId: string): Promise<Event[] | null> {
        try {
            const eventsDoc = await this.eventRepository.findBookedEvents(userId);
            const eventEntity = toEntities(eventsDoc);
            if(eventEntity === null) return null
            const events = toDTOs(eventEntity)
              events
                ? events.events.map((event) => {
                  
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
            if (events.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return events.events;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in bookedEvents');
        }
    }
   
};
