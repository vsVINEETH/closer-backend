import { Filter } from "../../../types/express/index";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";
import { mapSalesData } from "../../interfaces/mappers/salesDTOMapper";
import { EventSales, SalesDTO, SalesReport } from "../../usecases/dtos/SalesDTO";
import { ISalesUseCase } from "../interfaces/common/ISaleUseCase";
import { IS3Client } from "../interfaces/IS3Client";

export class SalesManagement implements ISalesUseCase {
    constructor(
        private _salesRepository: ISalesRepository,
        private _s3: IS3Client
    ){}

    async registerSale(transactionDetails: SalesDTO): Promise<void> {
        try {
            await this._salesRepository.create(transactionDetails);
        } catch (error) {
          throw new Error('something happend in registerSale')  
        };
    };

    async getDashboarData(filterConstraints: Filter): Promise<SalesReport | null> {
        try {
           const currentYear = new Date().getFullYear();
           const  salesData = await this._salesRepository.dashboardData(currentYear);
           return salesData ? mapSalesData(salesData) : null;
        } catch (error) {
            throw new Error('Something happend in getDashboardData');
        };
    };

    async getBookedEvents(userId: string): Promise<EventSales[]> {
        try {
            const bookedEvents = await this._salesRepository.findBookedEventsByUserId(userId);
            
            if (bookedEvents) {
                await Promise.all(
                    bookedEvents.map(async (doc) => {
                        if (doc.eventId && doc.eventId.image) {
                            doc.eventId.image = await Promise.all(
                                doc.eventId.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                            );
                        }
                    })
                );
            };
            return bookedEvents;
        } catch (error) {
           throw new Error('something happend in getBookedEvents')
        };
    }; 
};