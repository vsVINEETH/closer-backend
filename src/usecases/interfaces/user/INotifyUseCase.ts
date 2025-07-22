import { Notification } from "../../../domain/entities/Notification"
import { NotificationDTO } from "../../dtos/NotificationDTO"

export interface INotificationUseCase {
    execute(notification: Notification): Promise<void>
    fetchData(userId: string): Promise<NotificationDTO[] | null>
    removeNotification(notificationId: string): Promise<boolean>
};