import { Document } from "mongoose";

export interface ICategoryDocument extends Document {
    name:string,
    isListed: boolean,
    createdAt: Date,
}