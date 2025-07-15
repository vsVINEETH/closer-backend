import { Sales } from "../../domain/entities/Sales";
import { TotalMonthlySalesData, EventSales, SalesReport, SubscriptionSaleIterate, DailySale, DailySaleIterate, EventSaleIterate } from "../../usecases/dtos/SalesDTO";
import { SalesModel } from "../persistence/models/SalesModel";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";

export class SalesRepository implements ISalesRepository {

    async create(transactionDetails: Sales): Promise<void> {
        try {
            const sale = new SalesModel(transactionDetails);
            await sale.save();
        } catch (error) {
           throw new Error('something happend in create');
        }
    };

    async dashboardData(): Promise<SalesReport | null> {
        try {
            const currentYear = new Date().getFullYear();
            const result = await SalesModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(currentYear, 0, 1), 
                            $lt: new Date(currentYear + 1, 0, 1),
                        },
                    },
                },
                {
                    $facet: {
                        subscriptionSales: [
                            { $match: { saleType: "subscription" } },
                            {
                                $group: {
                                    _id: {
                                        month: { $month: "$createdAt" },
                                        planType: "$planType",
                                    },
                                    count: { $sum: 1 },
                                    amount: { $sum: "$billedAmount" },
                                    dailySales: {
                                        $push: {
                                            createdAt: "$createdAt",
                                            billedAmount: "$billedAmount",
                                        },
                                    },
                                },
                            },
                            { $sort: { "_id.month": 1 } },
                        ],
    
                        
                        eventSales: [
                            { $match: { saleType: "event" } },
                            {
                                $group: {
                                    _id: { month: { $month: "$createdAt" } },
                                    totalSales: { $sum: "$billedAmount" },
                                    soldSlots: { $sum: "$bookedSlots" },
                                    avgSalesPerMonth: { $avg: "$billedAmount" },
                                    dailySales: {
                                        $push: {
                                            createdAt: "$createdAt", // Store full date
                                            billedAmount: "$billedAmount",
                                            bookedSlots: "$bookedSlots",
                                        },
                                    },
                                },
                            },
                            { $sort: { "_id.month": 1 } },
                        ],
    
                        totalMonthlySales: [
                            {
                                $group: {
                                    _id: { month: { $month: "$createdAt" } },
                                    totalIncome: { $sum: "$billedAmount" },
                                },
                            },
                            { $sort: { "_id.month": 1 } },
                        ],
                    },
                },
            ]);
    
            // return  result[0] as SalesReport;
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
    
            const formattedResult = {
                subscriptionSales: result[0].subscriptionSales.map((item: SubscriptionSaleIterate) => ({
                    month: monthNames[item._id.month - 1], // Convert month number to name
                    planType: item._id.planType,
                    count: item.count,
                    amount: item.amount,
                    dailySales: item.dailySales.map((daySale: DailySale) => ({
                        date: new Date(daySale.createdAt).toISOString(), // Store as ISO date string
                        amount: daySale.billedAmount,
                        count: 1,
                    })),
                })),
                eventSales: result[0].eventSales.map((item: EventSaleIterate) => ({
                    month: monthNames[item._id.month - 1],
                    totalSales: item.totalSales,
                    soldSlots: item.soldSlots,
                    avgSalesPerMonth: item.avgSalesPerMonth,
                    dailySales: item.dailySales.map((daySale: DailySaleIterate) => ({
                        date: new Date(daySale.createdAt).toISOString(),
                        amount: daySale.billedAmount,
                        count: daySale.bookedSlots,
                    })),
                })),
                totalMonthlySales: result[0].totalMonthlySales.map((item: TotalMonthlySalesData) => ({
                    month: monthNames[item._id.month - 1],
                    totalIncome: item.totalIncome,
                })),
            };

            console.log(formattedResult,'result')
            return formattedResult;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw new Error("Something happened in dashboardData.");
        }
    };

    async findBookedEventsByUserId(userId: string): Promise<EventSales[]> {
        try {
            const result = await SalesModel.find({ userId, saleType: "event" }).populate("eventId");
            
            return result as unknown as EventSales[];
        } catch (error) {
            throw new Error("something happend in findBookedEventsByUserId")
        }
    };
    
};