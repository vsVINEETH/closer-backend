import { Sales } from "../../domain/entities/Sales";
import { EventSales, SalesReportRaw } from "../../usecases/dtos/SalesDTO";
import { SalesModel } from "../persistence/models/SalesModel";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";
import { BaseRepository } from "./BaseRepository";
import { ISalesDocument } from "../persistence/interfaces/ISalesModel";
import { toSalesEnitiyFromDoc, toSalesEntitiesFromDocs } from "../mappers/salesDataMapper";

export class SalesRepository extends BaseRepository<Sales, ISalesDocument> implements ISalesRepository {

    constructor(){
        super(SalesModel, toSalesEnitiyFromDoc, toSalesEntitiesFromDocs)
    };

    async dashboardData(currentYear: number): Promise<SalesReportRaw | null> {
        try {
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
                                            createdAt: "$createdAt",
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
    
            return  result[0];
        } catch (error) {
            throw new Error("Something happened in dashboardData.");
        };
    };

    async findBookedEventsByUserId(userId: string): Promise<EventSales[]> {
        try {
            const result = await SalesModel.find({ userId, saleType: "event" }).populate("eventId");
            return result as unknown as EventSales[];
        } catch (error) {
            throw new Error("something happend in findBookedEventsByUserId");
        };
    };
};