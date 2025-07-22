import { Document, Types } from "mongoose";
export {Types}

export interface IContentDocument extends Document {
    title: string,
    subtitle: string,
    content: string,
    image: string[] | File[],
    isListed: boolean,
    createdAt: string,
    category: Types.ObjectId,
    upvotes: string[],
    downvotes: string[],
    shares: string[],
}