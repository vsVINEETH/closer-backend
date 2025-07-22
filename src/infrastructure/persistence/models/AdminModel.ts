import mongoose, {Schema} from "mongoose";
import { IAdminDocument } from "../interfaces/IAdminModel";

const AdminSchema: Schema = new Schema({
    email: {type: String},
    password: {type: String},
})

export const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);