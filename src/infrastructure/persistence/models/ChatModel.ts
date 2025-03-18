import mongoose, { Schema } from "mongoose";
import { chatDocument } from "../interfaces/IChatModel";

const chatSchema: Schema<chatDocument> = new Schema({
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    message: {
      type: String, 
    },
    type: {
      type: String,
      enum: ['text', 'image','audio','call'],
    },
    callType: {
      type: String,
      enum: ['video', 'audio']
    },
    callDuration: {
      type: Number,
    },
    status:{
      type: String,
      enum:['sent', 'delivered', 'read'],
      default:'sent'
    },
    isMissed: {
      type: Boolean,
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },{
    timestamps: true
 });
  
  export const ChatModel = mongoose.model<chatDocument>('chat', chatSchema )
