import mongoose, { Document } from "mongoose";

// Define the interface for a Message document
export interface IChatDocument extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  type: 'text' | 'image' | 'audio' | 'call';
  callType: 'video' | 'audio';
  callDuration: number;
  isMissed: boolean;
  isRead: boolean;
  createdAt: Date,
  status:string,
}