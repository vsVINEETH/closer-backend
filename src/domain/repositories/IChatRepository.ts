import { Chat } from "../entities/Chat";
import { ChatDTO, ChatMessage, CallLogType, UserDetails,Messages, MatchedUserMessage } from "../../usecases/dtos/ChatDTO";
import { User } from "../entities/User";
export interface IChatRepository {
    create(chatMessage: ChatMessage): Promise<string | null>;
    findChats(senderId: string, receiverId: string): Promise<Chat[] | null>  
    createCallLog(callLog: CallLogType): Promise<void>
    updateStatus(messageStatus: string, isRead: boolean, chatId: string): Promise<void>
    updateUnreadedMessage(senderId: string, receiverId: string): Promise<void>
    updateDeliverMessage(messageStatus: string, receiverId: string): Promise<void>
    findMessages(userId: string, matches: UserDetails): Promise<Messages[] | null>
};