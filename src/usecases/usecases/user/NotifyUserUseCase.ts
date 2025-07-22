import { Notification } from "../../../domain/entities/Notification";
import { NotificationDTO } from "../../dtos/NotificationDTO";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { INotificationUseCase } from "../../interfaces/user/INotifyUseCase";
import { toNotificationDTOs } from "../../../interfaces/mappers/notificationDTOMapper";

export class NotifyUser implements INotificationUseCase {
    constructor(
        private _notificationRepository: INotificationRepository,
    ) { }

    async execute(notification: Notification): Promise<void> {
        try {
            const isExists = await this._notificationRepository.findOne(notification.user);
            console.log(notification.interactor,'llldfd')
            
            if(!isExists){
              await this._notificationRepository.create(notification);
            }
        } catch (error) {
            throw new Error('something happend in execute');
        };
    };

    async fetchData(userId: string): Promise<NotificationDTO[] | null> {
        try {
            const notifications = await this._notificationRepository.findAllByUserId(userId);
            return notifications ? toNotificationDTOs(notifications) : null;
        } catch (error) {
            throw new Error('something happend in fetchData')
        };
    };

    async removeNotification(notificationId: string): Promise<boolean> {
        try {
            const result = await this._notificationRepository.deleteById(notificationId);
            return result !== null;
        } catch (error) {
            throw new Error('something happend in removeNotification')
        };
    };
};