import { EmployeeModel } from '../persistence/models/EmployeeModel';
import bcrypt from 'bcryptjs'
export async function insertEmployeeData() {
    try {
        const newEmp = await EmployeeModel.create({
            email: 'employee1@gmail.com',  
            password: bcrypt.hashSync('emp123', 10)
        });
        console.log("Admin data inserted:", newEmp);
    } catch (error) {
        console.error("Error inserting admin data:", error);
    }
}
