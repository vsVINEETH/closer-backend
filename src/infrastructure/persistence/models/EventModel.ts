import mongoose, {Schema} from "mongoose";
import { EventDocument } from "../interfaces/IEventModel";

const EventSchema: Schema = new Schema({
    title: {type: String},
    description: {type: String},
    image: [{type: String}],
    location: {type: String},
    locationURL: {type: String},
    eventDate: {type: Date},
    slots:{type: Number, default: 0},
    totalEntries:{type: Number, default:0},
    totalSales:{type: Number, default: 0},
    price:{type: Number, default:0},
    buyers: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          slotsBooked: { type: Number, default: 0 },
          totalPaid: { type: Number, default: 0 },
        },
      ],
},{
    timestamps: true
});

export const EventModel = mongoose.model<EventDocument>('event', EventSchema);