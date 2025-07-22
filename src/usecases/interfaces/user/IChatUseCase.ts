import { Chat } from "../../../domain/entities/Chat";
import { CallLogType, ChatMessage, MatchDTO, MatchedUserMessage, UserDetails } from "../../dtos/ChatDTO";

export interface IChatUseCase {
 saveChat(chatMessage: ChatMessage): Promise< string | null>;
 updateChatStatus(status: string, isRead: boolean, chatId: string):Promise<void>;
 updateDeliverMessage(status: string, receiverId: string): Promise<void>;
 updateUnreadChats(senderId: string, receiverId: string): Promise<void>;
 saveCallLog(callLog: CallLogType): Promise<void>;
 fetchChats(senderId: string, receiverId: string): Promise<Chat[] | null>
 fetchMessages(userId:string, matches: MatchDTO[]): Promise< MatchedUserMessage[] | null>
};
