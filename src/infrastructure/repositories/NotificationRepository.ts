import { Notification } from "../../domain/entities/Notification";
import { NotificationModel } from "../persistence/models/NotificationModel";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { toNotificationEntitiesFromDocs, toNotificationEntityFromDoc } from "../mappers/notificationDataMapper";
import { BaseRepository } from "./BaseRepository";
import { INotificationDocument } from "../persistence/interfaces/INotificationModel";

export class NotificationRepository extends BaseRepository<Notification, INotificationDocument> implements INotificationRepository {

  constructor(){
    super(NotificationModel, toNotificationEntityFromDoc, toNotificationEntitiesFromDocs)
  };

  async findOne(userId: string): Promise<Notification | null> {
    try {
      const notificationDoc = await NotificationModel.findOne({ interactor: userId});
      return notificationDoc ? toNotificationEntityFromDoc(notificationDoc): null;
    } catch (error) {
      throw new Error('Something happend in findOne');
    };
  };


  async findAllByUserId(userId: string): Promise<Notification[] | null> {
    try {
      const notificationDocs = await NotificationModel.find({ user: userId }).sort({
        createdAt: -1,
      });
      return notificationDocs ? toNotificationEntitiesFromDocs(notificationDocs): null;
    } catch (error) {
      throw new Error("something happend in findAll");
    };
  };

};
