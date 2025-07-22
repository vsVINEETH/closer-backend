import { Document } from "mongoose";

export interface IEmployeeDocument extends Document {
    name: string,
    email: string,
    password: string,
    isBlocked: boolean,
    createdAt: Date,
    updatedAt: Date
}