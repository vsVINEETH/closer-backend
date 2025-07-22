import { Chat } from "../../domain/entities/Chat";
import { CallLogType, ChatMessage } from "../../usecases/dtos/ChatDTO";
import { IChatDocument } from "../persistence/interfaces/IChatModel";
import { ChatPersistanceType, ChatType } from "../types/ChatType";
import { Types } from "mongoose";

export function toChatEntityFromDoc(doc: IChatDocument): Chat {
    try {
        return new Chat({
             id: doc.id,
             sender: doc.sender.toString(),
             receiver: doc.receiver.toString(),
             message: doc.message,
             type: doc.type ,
             isRead: doc.isRead,
             createdAt: doc.createdAt.toLocaleDateString(),
             callType: doc.callType,
             callDuration: doc.callDuration,
             isMissed: doc.isMissed,
             status: doc.status,
        });
    } catch (error) {
      throw new Error('Something happend in toChatEntityFromDoc')  
    };
};

export function toChatEntitiesFromDocs(docs: IChatDocument[]): Chat[] {
    try {
       return docs.map((doc) => (
        new Chat({
             id: doc.id,
             sender: doc.sender.toString(),
             receiver: doc.receiver.toString(),
             message: doc.message,
             type: doc.type ,
             isRead: doc.isRead,
             createdAt: doc.createdAt.toLocaleDateString(),
             callType: doc.callType,
             callDuration: doc.callDuration,
             isMissed: doc.isMissed,
             status: doc.status, 
        })
       ));
    } catch (error) {
       throw new Error('Something happend in toChatEntitiesFromDocs') 
    };
};

export function toCallLogPersistance(callLog: CallLogType): CallLogType {
    try {
       return {
        sender: callLog.sender,
        receiver: callLog.receiver,
        type: callLog.type,
        status:callLog?.isMissed ? 'delivered': 'read',
        callType: callLog.callType,
        callDuration: callLog?.callDuration || 0,
        isMissed: callLog?.isMissed || false,
       } 
    } catch (error) {
      throw new Error('Something happend in toCallLogPersistance');  
    }
};

export function toChatPersistance(chatMessage: ChatMessage): Chat {
    try {
       const persist = {
            sender: chatMessage.sender,
            receiver: chatMessage.receiver._id , 
            message: chatMessage.message,
            type: chatMessage.type, 
       };
       return persist as Chat;
    } catch (error) {
      throw new Error('Something happend in toCharPersistance')  
    };
};