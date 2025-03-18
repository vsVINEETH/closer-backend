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
            const data = await this.eventRepository.findById(eventId)
            const user = await this.userRepository.findById(userId);
            const htmlContent = this.mailer.generateEventReceiptEmail(data);
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

    async fetchEvents(options: SearchFilterSortParams): Promise< {events: EventDTO[], total: number} | null> {
        try {
            const queryResult = await paramToQueryEvent(options)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );
            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return events;
            };
            return null;
        } catch (error) {
           throw new Error('something happend in fetchEvents') 
        }
    }

    async fetchEvent(eventId: string): Promise<EventDTO | null> {
        try {
            const event = await this.eventRepository.findById(eventId);
            if(event){
                event.image = await Promise.all(
                    event.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                );
                return event;
            }
            return null;
        } catch (error) {
            throw new Error('something happend in fetchEvent')
        }
    }

    async createEvent(eventData: EventDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise< {events: EventDTO[], total: number} | null> {
        try {
            const image: string[] = [];
            for(let post of imageFiles){
               const fileName = await this.s3.uploadToS3(post);
               image.push(fileName);
            };

           const result = await this.eventRepository.create({...eventData, image});
            if(!result ){ return null };
            const queryResult = await paramToQueryEvent(query)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );

            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
            
            this.notifyPrimeUsers(eventData);
            return events ? events : null;
        } catch (error) {
            throw new Error('something happend in createEvent')
        }
    };

    async updateEvent(updatedEventData: EditEventDTO, query: SearchFilterSortParams): Promise<{events: EventDTO[], total: number} | null> {
        try {
            const result = await this.eventRepository.update(updatedEventData._id, updatedEventData);
            if(!result) {return null};
            const queryResult = await paramToQueryEvent(query)
            const events = await this.eventRepository.findAll(
                 queryResult.query,
                 queryResult.sort,
                 queryResult.skip,
                 queryResult.limit
            );
            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return events;
            };
            return null;
        } catch (error) {
           throw new Error('something happend in updateEvent'); 
        }
    };

    async deleteEvent(eventId: string, query: SearchFilterSortParams): Promise< {events: EventDTO[], total: number}| null> {
        try {
            const event = await this.eventRepository.findById(eventId)
           
            if (event) {
                await Promise.all(
                    event.image.map(async (val) => await this.s3.deleteFromS3(val as string))
                );
                event.image = [];
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
            if (events?.events) {
                await Promise.all(
                    events.events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );

                return events
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
        if(event == null || slots > event.slots){
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
            console.log(slots)
            const isValid = await this.razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });
            if (!isValid) { return false }
            const actualBookedPrice = currency === "INR" ? amount / 100 : amount;

            await this.eventRepository.updateSlots(eventId, actualBookedPrice, userId, slots)
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

    }

    async paymentUsingWallet(paymentData: BookingDetails): Promise<boolean> {
        try {
            const { userId, amount, eventId, bookedSlots } = paymentData;
            await this.eventRepository.updateSlots(eventId, amount, userId, bookedSlots);
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


    async bookedEvents(userId: string): Promise<EventDTO[] | null> {
        try {
            const events = await this.eventRepository.findBookedEvents(userId);
            if (events) {
                await Promise.all(
                    events.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
                return events;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in bookedEvents');
        }
    }
   
};
