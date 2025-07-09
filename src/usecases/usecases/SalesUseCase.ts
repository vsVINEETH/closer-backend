import { Filter } from "../../../types/express/index";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";
import { EventSales, SalesDTO, SalesReport } from "../../usecases/dtos/SalesDTO";
import { IS3Client } from "../interfaces/IS3Client";
// import { toDTO } from "../mappers/SalesMapper";

export class SalesManagement {
    constructor(
        private salesRepository: ISalesRepository,
        private s3: IS3Client
    ){}

    async registerSale(transactionDetails: SalesDTO): Promise<void> {
        try {
            await this.salesRepository.create(transactionDetails);
        } catch (error) {
          throw new Error('something happend in registerSale')  
        }
    }

    async getDashboarData(filterConstraints: Filter): Promise<SalesReport | null> {
        try {
           const  dashboardData = await this.salesRepository.dashboardData(filterConstraints);
        //    if(dashboardDoc === null) return null;
           
        //    const dashboardData = toDTO(dashboardDoc);
        //    console.log(dashboardData);
           return dashboardData ? dashboardData : null;
        } catch (error) {
            throw new Error('Something happend in getDashboardData');
        }
    };

    async getBookedEvents(userId: string): Promise<EventSales[]> {
        try {
            const bookedEvents = await this.salesRepository.findBookedEventsByUserId(userId);
            console.log(bookedEvents)
            if (bookedEvents) {
                await Promise.all(
                    bookedEvents.map(async (doc) => {
                        if (doc.eventId && doc.eventId.image) {
                            doc.eventId.image = await Promise.all(
                                doc.eventId.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        }
                    })
                );
            }
            return bookedEvents;
        } catch (error) {
           throw new Error('something happend in getBookedEvents')
        }
    } 
}