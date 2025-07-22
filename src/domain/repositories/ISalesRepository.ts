import { Sales } from "../entities/Sales";
import { EventSales, SalesReportRaw } from "../../usecases/dtos/SalesDTO";
export interface ISalesRepository {
    create(transactionDetails: Sales): Promise<Sales>;
    dashboardData(currentYear: number): Promise<SalesReportRaw | null>;
    findBookedEventsByUserId(userId: string): Promise<EventSales[]>
};