import { Sales } from "../entities/Sales";
import { EventSales, SalesDTO, SalesReport } from "../../usecases/dtos/SalesDTO";
import { Filter } from "../../../types/express";
export interface ISalesRepository {
    create(transactionDetails: Sales): Promise<void>;
    dashboardData(filterConstraints: Filter): Promise<SalesReport | null>;
    findBookedEventsByUserId(userId: string): Promise<EventSales[]>
}