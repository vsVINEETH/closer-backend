import { Filter } from "../../../../types/express";
import { EventSales, SalesDTO, SalesReport } from "../../dtos/SalesDTO";

export interface ISalesUseCase {
    registerSale(transactionDetails: SalesDTO): Promise<void>
    getDashboarData(filterConstraints: Filter): Promise<SalesReport | null>
    getBookedEvents(userId: string): Promise<EventSales[]>
}