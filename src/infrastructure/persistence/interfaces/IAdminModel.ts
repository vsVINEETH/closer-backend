import { Document } from "mongoose";

export interface IAdminDocument extends Document {
    email: string,
    password: string,
};