import { SalesManagement } from "../usecases/usecases/SalesUseCase";
import { LogAdmin } from "../usecases/usecases/admin/LogUseCase";
import { UserManagement } from "../usecases/usecases/admin/UserMgntUseCase";
import { EmployeeManagement } from "../usecases/usecases/admin/EmpMgntUseCase";

import { S3ClientAccessControll } from "../infrastructure/services/S3Client";
import { Token } from "../infrastructure/services/Jwt";
import { Bcrypt } from "../infrastructure/services/Bcrypt";
import { Mailer } from "../infrastructure/services/Mailer";

import { AdminRepository } from "../infrastructure/repositories/AdminRepository";
import { SalesRepository } from "../infrastructure/repositories/SalesRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepositoy";

const s3ClientAccessControll = new S3ClientAccessControll();
const token = new Token();
const bcrypt = new Bcrypt();
const mailer = new Mailer();

const salesRepository = new SalesRepository();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const employeeRepository = new EmployeeRepository();

export const logAdminUseCase = new LogAdmin(adminRepository, token, bcrypt);
export const salesUseCases = new SalesManagement(salesRepository, s3ClientAccessControll);
export const userManagementUseCase = new UserManagement(userRepository);
export const empManagementUseCase = new EmployeeManagement(employeeRepository, bcrypt, mailer)