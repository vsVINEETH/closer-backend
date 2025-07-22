import { Chat } from "../entities/Chat";
import {ChatMessage, CallLogType, UserDetails,Messages, MatchDTO} from "../../usecases/dtos/ChatDTO";
export interface IChatRepository {
    create(chatMessage: Chat): Promise<Chat>;
    findChats(senderId: string, receiverId: string): Promise<Chat[] | null>  
    createCallLog(callLog: CallLogType): Promise<void>
    updateStatus(messageStatus: string, isRead: boolean, chatId: string): Promise<void>
    updateUnreadedMessage(senderId: string, receiverId: string): Promise<void>
    updateDeliverMessage(messageStatus: string, receiverId: string): Promise<void>
    findMessages(userId: string, matches: MatchDTO[]): Promise<Messages[] | null>
};