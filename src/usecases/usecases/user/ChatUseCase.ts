import { Chat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { ChatMessage, ChatDTO, CallLogType, UserDetails, MatchedUserMessage, Messages } from "../../dtos/ChatDTO";

export class ChatManagement {
    constructor(
        private _chatRepository: IChatRepository
    ) { }

    async saveChat(chatMessage: ChatMessage): Promise<  string | null> {
        try {
           const chatId = await this._chatRepository.create(chatMessage);
           return chatId;
        } catch (error) {
            throw new Error("something happend in saveChat");
        }
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
            await this._chatRepository.createCallLog(callLog);
        } catch (error) {
            throw new Error('something happend in saveCallLog')
        }
    }

    async fetchChats(senderId: string, receiverId: string): Promise<Chat[] | null> {
        try{
            const result = await this._chatRepository.findChats(senderId, receiverId);
            return result ? result.length === 0 ? [] : result : null;
        }catch(error){
            throw new Error('something happend in fetchChats')
        }
    }

    async fetchMessages(userId:string, matches: UserDetails): Promise< MatchedUserMessage[] | null> {
            
        try {
            if (!matches || matches.matches.length === 0) {
                return []; 
            }

            const messages = await this._chatRepository.findMessages(userId, matches)
            if(!messages || messages.length === 0){
                return [];
            }

            const groupedMessages: Record<string, { messages: Messages[]; unreadCount: number }> = {};


            for (const message of messages) {
                // Create a consistent key for the user pair (a-b is the same as b-a)
                const pairKey = [message.sender.toString(), message.receiver.toString()].sort().join('-');
            
                if (!groupedMessages[pairKey]) {
                    groupedMessages[pairKey] = { messages: [], unreadCount: 0 };
                }
            
                groupedMessages[pairKey].messages.push(message);
            
                // Count unread messages where the receiver is the current user
                if (message.receiver.toString() === userId && message.status !== 'read') {
                    groupedMessages[pairKey].unreadCount += 1;
                }
            }
            
    
            // Step 4: Format the grouped messages into an array of objects
            const result = Object.entries(groupedMessages).map(([pair, msgs]) => ({
                pair, // e.g., 'a-b'
                messages: msgs,
                unreadCount: msgs.unreadCount,
            }));
         
            return result;

        } catch (error) {
            throw new Error('something happend in fetchMessages')
        }
    }
}
