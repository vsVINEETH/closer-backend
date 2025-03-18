import mongoose, {Schema} from "mongoose";
import { AdminDocument } from "../interfaces/IAdminModel";

const AdminSchema: Schema = new Schema({
    email: {type: String},
    password: {type: String},
})

export const AdminModel = mongoose.model<AdminDocument>('Admin', AdminSchema);