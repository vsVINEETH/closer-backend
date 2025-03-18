import { Notification } from "../entities/Notification";
import { NotificationDTO } from "../../usecases/dtos/NotificationDTO";
export interface INotificationRepository {
    create(notificationData: Notification): Promise<void>
    findAll(userId: string): Promise<NotificationDTO[] | null>
    findByIdDelete(notificationId: string): Promise<boolean>
}