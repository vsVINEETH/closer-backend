import { Chat } from "../../domain/entities/Chat";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import { ChatModel } from "../persistence/models/ChatModel";
import { ChatMessage, CallLogType,Messages, UserDetails, MatchDTO} from "../../usecases/dtos/ChatDTO";
import { toChatEntitiesFromDocs, toChatEntityFromDoc } from "../mappers/chatDataMapper";
import { BaseRepository } from "./BaseRepository";
import { IChatDocument } from "../persistence/interfaces/IChatModel";

export class ChatRepository extends BaseRepository<Chat, IChatDocument> implements IChatRepository {
   
    constructor(){
        super(ChatModel, toChatEntityFromDoc, toChatEntitiesFromDocs)
    };

    async createCallLog(callLog: CallLogType): Promise<void> {
        try {
            const newChat = new ChatModel(callLog);
            await newChat.save();
        } catch (error) {
            throw new Error('something happend in createCallLog')
        };
    };

    async updateStatus(messageStatus: string, isRead: boolean, chatId: string): Promise<void> {
        try {
             await ChatModel.findByIdAndUpdate(
                chatId,
                { status: messageStatus, isRead },
                { new: true }
            );
        } catch (error) {
           throw new Error('something happend in status updater') 
        };
    };

    async updateDeliverMessage(messageStatus: string, receiverId: string): Promise<void> {
        try {
            await ChatModel.updateMany(
                {receiver: receiverId, isRead: false },
                { $set: { status: messageStatus, isRead: false } }
            ); 
        } catch (error) {
          throw new Error('something happend in updateDeliverMessage')  
        };
    };

    async updateUnreadedMessage(senderId: string, receiverId: string): Promise<void> {
        try {
            await ChatModel.updateMany(
                { sender: senderId, receiver: receiverId },
                { $set: { status: 'read', isRead: true } }
            );
        } catch (error) {
          throw new Error('something happend in updateUnreadedMessage')  
        };
    };

    // may get wrong
    async findChats(senderId: string, receiverId: string): Promise<Chat[] | null> {
        try {
            const chats = await ChatModel.find({
                $or: [
                  { sender: senderId, receiver: receiverId  },
                  { sender: receiverId, receiver: senderId },
                ],
              }).sort({ createdAt: 1 })
                .limit(100)
                .populate('receiver', '_id username image');
           
           return chats ? toChatEntitiesFromDocs(chats) : null;
        } catch (error) {
            throw new Error('something happend in findChats')
        };
    };

    async findMessages(userId: string, matches: MatchDTO[]): Promise<Messages[] | null> {
        try {
            const messages = await ChatModel.find({
                $or: matches.map((match) => ({
                    $or: [
                        { sender: userId, receiver: match._id }, 
                        { sender: match._id, receiver: userId },
                    ],
                })),
            }).sort({ createdAt: 1 });
            
            return messages ? messages as unknown as Messages[] : null;
        } catch (error) {
            throw new Error('something happend in findMessages')
        };
    };

};