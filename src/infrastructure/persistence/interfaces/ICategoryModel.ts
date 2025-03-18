import { Document } from "mongoose";

export interface CategoryDocument extends Document {
    name:string,
    isListed: boolean,
    createdAt: Date,
}