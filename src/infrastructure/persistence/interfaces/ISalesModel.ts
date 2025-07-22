import mongoose, {Document} from "mongoose";

export interface ISalesDocument extends Document {
    userId: mongoose.Types.ObjectId;
    subscriptionId?: mongoose.Types.ObjectId;
    eventId?: mongoose.Types.ObjectId;
    saleType: "subscription" | "event";
    planType?: "weekly" | "monthly" | "yearly";
    billedAmount: number;
    bookedSlots?: number;

  }
  
  