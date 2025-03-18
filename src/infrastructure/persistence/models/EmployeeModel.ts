import mongoose, {Schema} from "mongoose";
import { EmployeeDocument } from "../interfaces/IEmployeeModel";

const EmployeeSchema: Schema = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    isBlocked: {type: Boolean},
},{
    timestamps: true
});

export const EmployeeModel = mongoose.model<EmployeeDocument>('Employee', EmployeeSchema);