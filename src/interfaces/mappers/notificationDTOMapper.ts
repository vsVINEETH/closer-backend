import { Notification } from "../../domain/entities/Notification";
import { NotificationDTO } from "../../usecases/dtos/NotificationDTO";

export function toNotificationDTO(entity: Notification): NotificationDTO {
    try {
      return {
         id: entity.id,
         user: entity.user, 
         interactor: entity.interactor,
         type: entity.type,
         message: entity.message,
         createdAt: entity.createdAt,
      }; 
    } catch (error) {
        throw new Error('Something happend in toNotificationDTO');
    };
};

export function toNotificationDTOs(entities: Notification[]): NotificationDTO[] {
    try {
      return entities.map((entity) => ({
         id: entity.id,
         user: entity.user, 
         interactor: entity.interactor,
         type: entity.type,
         message: entity.message,
         createdAt: entity.createdAt,
      }))  
    } catch (error) {
      throw new Error('Something happend in toNotificationDTOs')  
    };
};