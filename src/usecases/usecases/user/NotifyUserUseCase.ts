import { Notification } from "../../../domain/entities/Notification";
import { NotificationDTO } from "../../dtos/NotificationDTO";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class NotifyUser {
    constructor(
        private _notificationRepository: INotificationRepository,
    ) { }

    async execute(notification: Notification): Promise<void> {
        try {
            await this._notificationRepository.create(notification)
            console.log(`Sending notification to user ${notification.user}: ${notification.message}`);
        } catch (error) {
            throw new Error('something happend in execute')
        }

    };

    async fetchData(userId: string): Promise<NotificationDTO[] | null> {
        try {
            const result = await this._notificationRepository.findAll(userId);
            if (!result) { return null };
            return result;
        } catch (error) {
            throw new Error('something happend in fetchData')
        }

    }

    async removeNotification(notificationId: string): Promise<boolean> {
        try {
            const result = await this._notificationRepository.findByIdDelete(notificationId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in removeNotification')
        }

    }

}