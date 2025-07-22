import { Document } from "mongoose";

enum PlanType {
    Weekly = 'weekly',
    Monthly = 'monthly',
    Yearly = 'yearly'
}
export interface ISubscriptionDocument extends Document {
    planType:string,
    price: number,
    isListed: boolean,
    createdAt: string,
}