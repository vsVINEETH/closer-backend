import { Notification } from "../../domain/entities/Notification";
import { INotificationDocument } from "../persistence/interfaces/INotificationModel";

export function toNotificationEntitiesFromDocs(docs: INotificationDocument[]): Notification[] {
    try {
       return docs.map((doc) => (
        new Notification({
            id: doc.id,
            user: doc.user.toString(), 
            interactor: doc.interactor.toString(),
            type: doc.type,
            message: doc.message,
            createdAt: doc.createdAt.toLocaleDateString(),
        })
       ));
    } catch (error) {
        throw new Error('Something happend in toNotificationEntitiesFromDocs')
    };
};

export function toNotificationEntityFromDoc(doc: INotificationDocument): Notification {
    try {
      
        return new Notification({
            id: doc.id,
            user: doc.user.toString(), 
            interactor: doc.interactor.toString(),
            type: doc.type,
            message: doc.message,
            createdAt: doc.createdAt.toLocaleDateString(),
        });
      
    } catch (error) {
        throw new Error('Something happend in toNotificationEntitiesFromDocs')
    };
};