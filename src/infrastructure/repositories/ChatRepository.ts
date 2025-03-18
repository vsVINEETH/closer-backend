import { Chat } from "../../domain/entities/Chat";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import { ChatModel } from "../persistence/models/ChatModel";
import { ChatDTO, ChatMessage, CallLogType,Messages, UserDetails} from "../../usecases/dtos/ChatDTO";

export class ChatRepository implements IChatRepository {
    async create(chatMessage: ChatMessage): Promise< string | null > {
        try {
           const newChat = new ChatModel({
            sender: chatMessage.sender,
            receiver: chatMessage.receiver._id, 
            message: chatMessage.message,
            type: chatMessage.type, 
          });

         const chatDoc = await newChat.save();
         return chatDoc.id //_id
        } catch (error) {
            throw new Error('something happend in create chat')
        }
    };

    async createCallLog(callLog: CallLogType): Promise<void> {
        try {

            const newChat = new ChatModel({
                sender: callLog.sender,
                receiver: callLog.receiver,
                type: callLog.type,
                status:callLog?.isMissed ? 'delivered': 'read',
                callType: callLog.callType,
                callDuration: callLog?.callDuration || 0,
                isMissed: callLog?.isMissed || false,
            });
            await newChat.save();
        } catch (error) {
            throw new Error('something happend in createCallLog')
        }
    };

    async updateStatus(messageStatus: string, isRead: boolean, chatId: string): Promise<void> {
        try {
             await ChatModel.findByIdAndUpdate(
                chatId,
                { status: messageStatus, isRead },
                { new: true } // Returns the updated document
            );
        } catch (error) {
           throw new Error('something happend in status updater') 
        }
    };

    async updateDeliverMessage(messageStatus: string, receiverId: string): Promise<void> {
        try {
            await ChatModel.updateMany(
                {receiver: receiverId, isRead: false },
                { $set: { status: messageStatus, isRead: false } }
            ); 
        } catch (error) {
          throw new Error('something happend in updateDeliverMessage')  
        }
    }

    async updateUnreadedMessage(senderId: string, receiverId: string): Promise<void> {
        try {
         
            await ChatModel.updateMany(
                { sender: senderId, receiver: receiverId },
                { $set: { status: 'read', isRead: true } }
            );
        } catch (error) {
          throw new Error('something happend in updateUnreadedMessage')  
        }
    }

    async findChats(senderId: string, receiverId: string): Promise<Chat[] | null> {
        try {
            const chats = await ChatModel.find({
                $or: [
                  { sender: senderId, receiver: receiverId  },
                  { sender: receiverId, receiver: senderId }, // To fetch both directions
                ],
              })
                .sort({ createdAt: 1 }) // Sort in ascending order of creation time
                .limit(100)
                .populate('receiver', '_id username image'); // Populate specific fields
           
           return chats ?
           chats.map((data) => 
            new Chat(
                data._id as string,
                data.sender.toString(),
                data.receiver,
                data.message,
                data.type,
                data.isRead,
                data?.createdAt.toISOString(),
                data?.callType,
                data?.callDuration,
                data?.isMissed,
                data?.status            
            )
           ): null
        } catch (error) {
            throw new Error('something happend in findChats')
        }
    }

    async findMessages(userId: string, matches: UserDetails): Promise<Messages[] | null> {
        try {

            const messages = await ChatModel.find({
                $or: matches.matches.map((match) => ({
                    $or: [
                        { sender: userId, receiver: match._id }, 
                        { sender: match._id, receiver: userId },
                    ],
                })),
            }).sort({ createdAt: 1 });
            
            return messages ? messages as unknown as Messages[] : null;
        } catch (error) {
            throw new Error('something happend in findMessages')
        }
    }

}