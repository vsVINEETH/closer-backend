import { Notification } from "../../domain/entities/Notification";
import { NotificationDTO } from "../../usecases/dtos/NotificationDTO";
import { NotificationModel } from "../persistence/models/NotificationModel";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

export class NotificationRepository implements INotificationRepository {
  async create(notificationData: NotificationDTO): Promise<void> {
    try {
      const result = await NotificationModel.findOne({ user: notificationData.user });
      if (!result) {
        await NotificationModel.insertMany([
          {
            user: notificationData.user,
            interactor: notificationData.interactor,
            type: notificationData.type,
            message: notificationData.message,
          },
        ]);
      }
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

  async findAll(userId: string): Promise<NotificationDTO[] | null> {
    try {
      const result = await NotificationModel.find({ user: userId }).sort({
        createdAt: -1,
      });

      return result
        ? result.map(
            (data) =>
              new Notification(
                data._id as string,
                data.user.toString(),
                data.interactor.toString(),
                data.type,
                data.message,
                data.createdAt.toLocaleDateString()
              )
          )
        : null;
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async findByIdDelete(notificationId: string): Promise<boolean> {
    try {
      const result = await NotificationModel.findByIdAndDelete(notificationId);
      return result !== null;
    } catch (error) {
      throw new Error("something happend in findByIdDelete");
    }
  }
}
