import { Document } from "mongoose";

export interface AdminDocument extends Document {
    email: string,
    password: string,
}