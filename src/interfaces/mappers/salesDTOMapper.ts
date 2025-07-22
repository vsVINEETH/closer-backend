import { Sales } from "../../domain/entities/Sales";
import { SalesReport, SalesReportRaw, SubscriptionSaleIterate, EventSaleIterate, TotalMonthlySalesData, DailySale, DailySaleIterate } from "../../usecases/dtos/SalesDTO";


export function mapSalesData(salesData: SalesReportRaw): SalesReport {
    try {
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            const formattedResult = {
                subscriptionSales: salesData.subscriptionSales.map((item: SubscriptionSaleIterate) => ({
                    month: monthNames[item._id.month - 1], // Convert month number to name
                    planType: item._id.planType,
                    count: item.count,
                    amount: item.amount,
                    dailySales: item.dailySales.map((daySale: DailySale) => ({
                        createdAt: new Date(daySale.createdAt).toISOString(), // Store as ISO date string
                        billedAmount: daySale.billedAmount,
                        count: 1,
                        billedSlots: daySale.billedSlots
                    })),
                })),
                eventSales: salesData.eventSales.map((item: EventSaleIterate) => ({
                    month: monthNames[item._id.month - 1],
                    totalSales: item.totalSales,
                    soldSlots: item.soldSlots,
                    avgSalesPerMonth: item.avgSalesPerMonth,
                    dailySales: item.dailySales.map((daySale: DailySaleIterate) => ({
                        createdAt: new Date(daySale.createdAt).toISOString(),
                        billedAmount: daySale.billedAmount,
                        billedSlots: daySale.bookedSlots ?? 0,
                        count: daySale.bookedSlots ?? 0,
                    })),
                })),
                totalMonthlySales: salesData.totalMonthlySales.map((item: TotalMonthlySalesData) => ({
                    month: monthNames[item._id.month - 1],
                    totalIncome: item.totalIncome,
                })),
            };
            return formattedResult
    } catch (error) {
       throw new Error('Something happend in mapSalesData') 
    };
};