import mongoose, {Document} from "mongoose";

export interface INotificationDocument extends Document {
    user: mongoose.Types.ObjectId;
    interactor: mongoose.Types.ObjectId;
    type: 'interest' | 'match';
    message: string;
    createdAt: Date;
}