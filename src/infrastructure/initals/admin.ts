import { AdminModel } from "../persistence/models/AdminModel";
import bcrypt from 'bcryptjs'
export async function insertAdminData() {
    try {
        const newAdmin = await AdminModel.create({
            email: process.env.ADMIN_ID,  
            password: bcrypt.hashSync('admin123', 10)
        });
        console.log("Admin data inserted:", newAdmin);
    } catch (error) {
        console.error("Error inserting admin data:", error);
    };
};



