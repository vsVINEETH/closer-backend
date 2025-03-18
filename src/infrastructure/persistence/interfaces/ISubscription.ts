import { Document } from "mongoose";

enum PlanType {
    Weekly = 'weekly',
    Monthly = 'monthly',
    Yearly = 'yearly'
}
export interface SubscriptionDocument extends Document {
    planType:string,
    price: number,
}