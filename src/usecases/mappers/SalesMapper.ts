// import { SalesDocument } from "../../infrastructure/persistence/interfaces/ISalesModel";
// import { SalesReport, SalesReportDTO, SubscriptionSaleIterate } from "../dtos/SalesDTO";


// export function toDTO(salesData: SalesReport): SalesReportDTO {
//     try {
//         const monthNames = [
//                 "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//             ];
    
//             const formattedResult = {
//                     subscriptionSales: salesData.subscriptionSales.map((item: SubscriptionSaleIterate) => ({
//                     month: monthNames[item._id.month - 1], // Convert month number to name
//                     planType: item._id.planType,
//                     count: item.count,
//                     amount: item.amount,
//                     dailySales: item.dailySales.map((daySale: DailySale) => ({
//                         date: new Date(daySale.createdAt).toISOString(), // Store as ISO date string
//                         amount: daySale.billedAmount,
//                         count: 1,
//                     })),
//                 })),
//                 eventSales: salesData.eventSales.map((item: EventSaleIterate) => ({
//                     month: monthNames[item._id.month - 1],
//                     totalSales: item.totalSales,
//                     soldSlots: item.soldSlots,
//                     avgSalesPerMonth: item.avgSalesPerMonth,
//                     dailySales: item.dailySales.map((daySale: DailySaleIterate) => ({
//                         date: new Date(daySale.createdAt).toISOString(),
//                         amount: daySale.billedAmount,
//                         count: daySale.bookedSlots,
//                     })),
//                 })),
//                 totalMonthlySales: salesData.totalMonthlySales.map((item: TotalMonthlySalesData) => ({
//                     month: monthNames[item._id.month - 1],
//                     totalIncome: item.totalIncome,
//                 })),
//             };

//             console.log(formattedResult,'result')
//             return formattedResult;
//     } catch (error) {
//        throw new Error('Something happend in toDTO') 
//     }
// }