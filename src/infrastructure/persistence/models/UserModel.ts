import mongoose, {Schema} from "mongoose";
import { UserDocument } from "../interfaces/IUserModel";

const UserSchema: Schema = new Schema ({
    username: {type: String,},
    email: {type: String},
    password: {type: String},
    phone: {type: String},
    dob: {type: String},
    gender: {type: String},
    image:[{ type: String }],
    interestedIn: {type: String},
    lookingFor: {type: String},
    setupCompleted:{type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false},
    isBanned: { type: Boolean, default: false },
    banExpiresAt: { type: Date, default: null },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
    reportedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],    
    prime: {
        isPrime: { type: Boolean, default: false },
        type: { type: String, default: null },
        startDate: { type: Date, default: null }, 
        endDate: { type: Date, default: null },
        primeCount: { type: Number, default: 0 }, 
        billedAmount: {type: Number, default: 0},
      },
      location: {
        type: { type: String, default: 'Point' },
        coordinates: {
          type: [Number],
        },
        place:{
          state: {type: String, default: null},
          country:{type: String, default: null},
          city:{type: String, default: null},
        }
      },
    matches:[{type: mongoose.Schema.Types.ObjectId , ref: 'user' }],
    interests:[{type: mongoose.Schema.Types.ObjectId , ref: 'user' }],
},{
    timestamps: true
});


UserSchema.index({ 'location.coordinates': '2dsphere' });
export const UserModel = mongoose.model<UserDocument>('user', UserSchema)