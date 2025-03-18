import { Filter } from "../../../types/express/index";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";
import { EventSales, SalesDTO, SalesReport } from "../../usecases/dtos/SalesDTO";

export class SalesManagement {
    constructor(
        private salesRepository: ISalesRepository,
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
           return dashboardData ? dashboardData : null;
        } catch (error) {
            throw new Error('Something happend in getDashboardData');
        }
    }

    async getBookedEvents(userId: string): Promise<EventSales[]> {
        try {
            const bookedEvents = await this.salesRepository.findBookedEventsByUserId(userId);
            return bookedEvents;
        } catch (error) {
           throw new Error('something happend in getBookedEvents')
        }
    } 
}