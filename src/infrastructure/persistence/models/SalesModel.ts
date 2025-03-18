import mongoose, {Schema} from "mongoose";
import { SalesDocument } from "../interfaces/ISalesModel";


const SalesSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        subscriptionId: { type: Schema.Types.ObjectId, ref: "subscription" },
        eventId: { type: Schema.Types.ObjectId, ref: "event" },
        saleType: { type: String, enum: ["subscription", "event"], required: true },
        planType: { type: String, enum: ["weekly", "monthly", "yearly"]},
        billedAmount: { type: Number, required: true, min: 0 },
        bookedSlots: { type: Number, min: 0},
      },
      { timestamps: true }
);

export const SalesModel = mongoose.model<SalesDocument>('sales', SalesSchema);