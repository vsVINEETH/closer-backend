import  mongoose,{ Schema } from "mongoose";
import { AdvertisementDocument } from "../interfaces/IAdvertisement";

const AdvertisementSchema: Schema = new Schema ({
    title:{type: String},
    subtitle:{type: String},
    content:{type: String},
    image:[{type: String}],
    isListed: {type: Boolean, default: true}
},{
    timestamps: true
});

export const AdvertisementModel = mongoose.model<AdvertisementDocument>('advertisement', AdvertisementSchema)