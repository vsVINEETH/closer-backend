import { Chat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { toCallLogPersistance, toChatPersistance } from "../../../infrastructure/mappers/chatDataMapper";
import { ChatMessage, ChatDTO, CallLogType, UserDetails, MatchedUserMessage, Messages, MatchDTO } from "../../dtos/ChatDTO";
import { IChatUseCase } from "../../interfaces/user/IChatUseCase";

export class ChatManagement implements IChatUseCase {
    constructor(
        private _chatRepository: IChatRepository
    ) { }

    async saveChat(chatMessage: ChatMessage): Promise<  string | null> {
        try {
           const dataToPersist = toChatPersistance(chatMessage);
           const chatId = await this._chatRepository.create(dataToPersist);
           return chatId.id;
        } catch (error) {
            throw new Error("something happend in saveChat");
        };
    };

    async updateChatStatus(status: string, isRead: boolean, chatId: string):Promise<void>{
        try {
            await this._chatRepository.updateStatus(status, isRead, chatId);
        } catch (error) {
            throw new Error('something happend in updateChatStatus')
        }
    }

    async  updateDeliverMessage(status: string, receiverId: string): Promise<void> {
        try {
            await this._chatRepository.updateDeliverMessage(status, receiverId);
        } catch (error) {
          throw new Error('something happend in updateDeliverMessage')
        }
    }

    async updateUnreadChats(senderId: string, receiverId: string): Promise<void>{
        try {
            await this._chatRepository.updateUnreadedMessage(senderId, receiverId)
        } catch (error) {
           throw new Error('something happedn in updateUnreadChats') 
        }
    }

    async saveCallLog(callLog: CallLogType): Promise<void> {
        try {
            await this._chatRepository.createCallLog(toCallLogPersistance(callLog));
        } catch (error) {
            throw new Error('something happend in saveCallLog')
        };
    };

    async fetchChats(senderId: string, receiverId: string): Promise<Chat[] | null> {
        try{
            const result = await this._chatRepository.findChats(senderId, receiverId);
            return result ? result.length === 0 ? [] : result : null;
        }catch(error){
            throw new Error('something happend in fetchChats')
        };
    };

    async fetchMessages(userId:string, matches: MatchDTO[]): Promise< MatchedUserMessage[] | null> {
            
        try {
            if (!matches || matches.length === 0) {
                return []; 
            };

            const messages = await this._chatRepository.findMessages(userId, matches)
            
            if(!messages || messages.length === 0){
                return [];
            };

            const groupedMessages: Record<string, { messages: Messages[]; unreadCount: number }> = {};

            for (const message of messages) {
                const pairKey = [message.sender.toString(), message.receiver.toString()].sort().join('-');
                
                if (!groupedMessages[pairKey]) {
                    groupedMessages[pairKey] = { messages: [], unreadCount: 0 };
                };
            
                groupedMessages[pairKey].messages.push(message);
            
                if (message.receiver.toString() === userId && message.status !== 'read') {
                    groupedMessages[pairKey].unreadCount += 1;
                };

               groupedMessages[pairKey].messages.splice(0, groupedMessages[pairKey].messages.length-1)
            };
    
            const result = Object.entries(groupedMessages).map(([pair, msgs]) => ({
                pair,
                messages: msgs,
                unreadCount: msgs.unreadCount,
            }));
         
            return result;

        } catch (error) {
            throw new Error('something happend in fetchMessages')
        };
    };
};
