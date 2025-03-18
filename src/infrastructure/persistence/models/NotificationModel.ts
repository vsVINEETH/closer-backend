import mongoose, { Schema} from 'mongoose';
import { INotification } from '../interfaces/INotificationModel';

const NotificationSchema: Schema<INotification> = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        interactor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        type: {
            type: String,
            enum: ['interest', 'match'],
        },
        message: {
            type: String,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const NotificationModel = mongoose.model<INotification>('notification', NotificationSchema);