import { Notification } from "../../../domain/entities/Notification";
import { NotificationDTO } from "../../dtos/NotificationDTO";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class NotifyUser {
    constructor(
        private notificationRepository: INotificationRepository,
    ) { }

    async execute(notification: Notification): Promise<void> {
        try {
            await this.notificationRepository.create(notification)
            console.log(`Sending notification to user ${notification.user}: ${notification.message}`);
        } catch (error) {
            throw new Error('something happend in execute')
        }

    };

    async fetchData(userId: string): Promise<NotificationDTO[] | null> {
        try {
            const result = await this.notificationRepository.findAll(userId);
            if (!result) { return null };
            return result;
        } catch (error) {
            throw new Error('something happend in fetchData')
        }

    }

    async removeNotification(notificationId: string): Promise<boolean> {
        try {
            const result = await this.notificationRepository.findByIdDelete(notificationId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in removeNotification')
        }

    }

}