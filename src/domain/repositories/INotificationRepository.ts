import { Notification } from "../entities/Notification";

export interface INotificationRepository {
    findOne(userId: string): Promise<Notification | null>
    create(notificationData: Notification): Promise<Notification>
    findAllByUserId(userId: string): Promise<Notification[] | null>
    deleteById(notificationId: string): Promise<boolean | null>
};