import { Document } from "mongoose";

export interface IAdvertisementDocument extends Document {
    title: string,
    subtitle: string,
    content: string,
    image: string[] | File[],
    isListed: boolean,
    createdAt: string,
}