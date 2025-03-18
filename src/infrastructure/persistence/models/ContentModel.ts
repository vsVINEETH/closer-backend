import  mongoose,{ Schema } from "mongoose";
import { ContentDocument } from "../interfaces/IContentModel";

const ContentSchema: Schema = new Schema ({
    title:{type: String},
    subtitle:{type: String},
    content:{type: String},
    image:[{type: String}],
    isListed: {type: Boolean, default: true},
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    upvotes:[{type: Schema.Types.ObjectId, ref: 'user'}],
    downvotes:[{type: Schema.Types.ObjectId, ref: 'user'}],
    shares:[{type: Schema.Types.ObjectId, ref: 'user'}],
},{
    timestamps: true
});

export const ContentModel = mongoose.model<ContentDocument>('content', ContentSchema)