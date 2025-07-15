import { Server, Socket } from "socket.io";
import { NotifyUser } from "../../usecases/usecases/user/NotifyUserUseCase";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { CommonOperations } from "../../usecases/usecases/user/CommonUseCase";
import { ChatManagement } from "../../usecases/usecases/user/ChatUseCase";
import { ChatRepository } from "../../infrastructure/repositories/ChatRepository";
import { UserDTO } from "../../usecases/dtos/UserDTO";
import { Geolocation } from "../../infrastructure/services/Geolocation";

import { MissedCall, OngoingCall, Participants } from "../../../types/express";
import { S3ClientAccessControll } from "../../infrastructure/services/S3Client";
const userRepository = new UserRepository();
const s3ClientAccessControll = new S3ClientAccessControll()
const geolocation = new Geolocation()
const commonUseCase = new CommonOperations(userRepository, s3ClientAccessControll, geolocation);

const notificationRepository = new NotificationRepository();
const notifyUserUseCase = new NotifyUser(notificationRepository);

const chatRepository = new ChatRepository();
const chatUseCase = new ChatManagement(chatRepository);

type User = {
  userId: string;
  socketId: string;
  profile: {
    username: string;
    image: string[] | File[] | undefined;
  };
};

export class SocketGateway {
  private userSocketMap: Map<string, string>;
  private users: User[] = [];
  constructor(private io: Server) {
    this.userSocketMap = new Map();

    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected", socket.id);

      //register user
      socket.on("register", (userData: UserDTO) => {
        try {
          if (!userData) return;
          this.userSocketMap.set(userData.id, socket.id);

          userData &&
            !this.users.some((user) => user?.userId === userData.id) &&
            this.users.push({
              userId: userData.id,
              socketId: socket.id,
              profile: {
                username: userData.username,
                image: userData?.image,
              },
            });

          this.io.emit("getUsers", this.users);

          console.log(
            `User ${userData.id} registered with socket ID ${socket.id}`
          );
        } catch (error) {
          console.log("somthing happend", error);
        }
      });

      //checks user status
      socket.on("checkOnlineStatus", (userId: string) => {
        try {
          const isOnline = this.userSocketMap.has(userId);
          socket.emit("onlineStatus", { userId, isOnline });
        } catch (error) {
          console.log("something happend", error);
        }
      });

      //handling notifications
      socket.on("notification", async (data) => {
        const { user, interactor, type, message, image } = data; // `user` is the opposite user's ID
        try {
          const notification = new Notification({
            id:'',
            user: user,
            interactor: interactor,
            type: type,
            message: message
          });
          await notifyUserUseCase.execute(notification);
          await commonUseCase.interestedUsers(user, interactor);

          // Find the opposite user's socket ID and notify them
          const oppositeSocketId = this.userSocketMap.get(user);

          if (oppositeSocketId) {
            this.io.to(oppositeSocketId).emit("newNotification", { ...data, image: image[0] });
            console.log(`Notification sent to user ${user}`);
          } else {
            console.log(`User ${user} is not connected`);
          }
          socket.emit("notificationSent", { success: true });
        } catch (error) {
          console.log("something happend", error);
        }
      });

      //handling message passing
      socket.on("sendMessage", async (data) => {
        const { sender, receiver, message } = data;
        try {
          const newMessageId = await chatUseCase.saveChat(data);
          const receiverSocketId = this.userSocketMap.get(receiver._id);
          const senderSocketId = this.userSocketMap.get(sender);

          if (receiverSocketId) {
            this.io
              .to(receiverSocketId)
              .emit("receiveMessage", { ...data, status: 'delivered', _id: newMessageId });
               
               await chatUseCase.updateChatStatus('delivered', false, newMessageId ?? '' );
        
            if (senderSocketId) {
              this.io
                .to(senderSocketId)
                .emit('messageSent', { ...data, status: 'delivered', _id: newMessageId });
            }
          } else {
            if (senderSocketId) {
              this.io
                .to(senderSocketId)
                .emit('messageSent', { ...data, status: 'sent', _id: newMessageId });
            }
            console.log(`Receiver ${receiver._id} is not connected.`);
          }

        } catch (error) {
          console.log("something happend", error);
        }
      });

    //  read message
      socket.on("readMessage", async (data) => {
        try {
          console.log(data)
          await chatUseCase.updateUnreadChats(data.sender, data.receiver);
          const senderSocketId = this.userSocketMap.get(data.sender);
          if (senderSocketId) {
            
            this.io.to(senderSocketId).emit("messageReaded", {
              status: "read",
              isRead: true,
              chatId: data.chatId || '',
              sender: data.sender,
              receiver: data.receiver,
            });
          }

        } catch (error) {
          console.log("Something happened", error);
        }
      });

      //deliver message on regiter
      socket.on('deliver', async (userId: string) => {
        try {
          const user = this.userSocketMap.get(userId);
          if(user){
            await chatUseCase.updateDeliverMessage('delivered', userId)
          }
          
        } catch (error) {
          console.log('something happend', error)
        }
      });

      //handle logout
      socket.on("logout", (userId: string) => {
        try {
          if (this.userSocketMap.has(userId)) {
            this.userSocketMap.delete(userId);
            console.log(`User ${userId} logged out and removed from the map`);
            this.io.emit("onlineStatus", { userId, isOnline: false });
          }
        } catch (error) {
          console.log(`something happend`, error);
        }
      });

      // Handle disconnect event
      socket.on("disconnect", () => {
        try {
          const userId = [...this.userSocketMap.entries()].find(
            ([, id]) => id === socket.id
          )?.[0];
          if (userId) {
            this.userSocketMap.delete(userId);
            console.log(`User ${userId} disconnected`);
          }

          this.users = this.users.filter((user) => user.socketId !== socket.id);
          this.io.emit("getUsers", this.users);
        } catch (error) {
          console.log(`something happend`, error);
        }
      });

      //call events
      socket.on("call", async (participants: Participants) => {
        try {
          console.log(participants)
          if (participants.receiver.socketId) {
            this.io
              .to(participants.receiver.socketId)
              .emit("incomingCall", participants);
          }
        } catch (error) {
          console.log(`Something happend`, error);
        }
      });

      // webrtc connection establishing
      socket.on("webrtcSignal", async (data) => {
        console.log(data, 'something')
        try {
          if (data.isCaller) {
            if (data?.ongoingCall?.participants?.receiver?.socketId) {
              this.io
                .to(data.ongoingCall.participants.receiver.socketId)
                .emit("webrtcSignal", data);
              console.log(
                "Forwarded signal to receiver:",
                data.ongoingCall.participants.receiver.socketId
              );
            }
          } else {
            if (data?.ongoingCall?.participants?.caller?.socketId) {
              this.io
                .to(data.ongoingCall.participants.caller.socketId)
                .emit("webrtcSignal", data);
              console.log(
                "Forwarded signal to caller:",
                data.ongoingCall.participants.caller.socketId
              );
            }
          }
        } catch (error) {
          console.error("Error in webrtcSignal handler:", error);
        }
      });

      //end call
      socket.on("hangup", async (data) => {
        console.log(data,'lop')
        let socketIdToEmitTo;
        if (
          data?.ongoingCall?.participants?.caller?.userId === data.userHangingupId
        ) {
          socketIdToEmitTo =
            data?.ongoingCall?.participants?.receiver?.socketId;
        } else {
          socketIdToEmitTo = data?.ongoingCall?.participants?.caller?.socketId;
        }

        if (socketIdToEmitTo) {
          this.io.to(socketIdToEmitTo).emit("hangup",data);
        }
      });

      //missed call
      socket.on('missedcall', async (ongoingCall: MissedCall) => {
        let caller: string;
        let receiver: string;
        try {
          if (ongoingCall.participants) {
            caller = ongoingCall.participants.caller.userId;
            receiver = ongoingCall.participants.receiver.userId;
          } else {
            caller = ongoingCall.caller
            receiver = ongoingCall.receiver
          };
          await chatUseCase.saveCallLog({
            sender: caller,
            receiver: receiver,
            type: ongoingCall.type,
            status: ongoingCall.isMissedCall ? 'deliverd': 'read',
            callType: ongoingCall.callType,
            callDuration: ongoingCall.callDuration,
            isMissed: ongoingCall.isMissedCall,
            isRead: ongoingCall.isMissedCall ? false : true,
          });
          console.log(caller, receiver)
        } catch (error) {
          console.log('something happend', error)
        }
      });
    });
  }
}
