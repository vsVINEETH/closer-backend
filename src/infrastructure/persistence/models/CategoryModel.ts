import mongoose, {Schema} from "mongoose";
import { ICategoryDocument } from "../interfaces/ICategoryModel";

const CategorySchema: Schema = new Schema({
    name: {type: String},
    isListed: {type: Boolean, default: true},
},{
    timestamps: true
});

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', CategorySchema);