import { Document } from "mongoose";

export interface EmployeeDocument extends Document {
    name: string,
    email: string,
    password: string,
    isBlocked: boolean,
    createdAt: Date,
    updatedAt: Date
}