import { LogEmployee } from "../usecases/usecases/employee/LogUseCase";
import { Security } from "../usecases/usecases/employee/SecurityUseCase";
import { CategoryManagement } from "../usecases/usecases/employee/CategoryUseCase";

import { Bcrypt } from "../infrastructure/services/Bcrypt";
import { Token } from "../infrastructure/services/Jwt";
import { Mailer } from "../infrastructure/services/Mailer";
import { OTP } from "../infrastructure/services/Otp";

import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepositoy";
import { CategoryRepository } from "../infrastructure/repositories/CategoryRepository";

const bcrypt = new Bcrypt();
const token = new Token();
const mailer = new Mailer();
const otp = new OTP();

const employeeRepository = new EmployeeRepository();
const categoryRepository = new CategoryRepository();

export const logEmployeeUseCase = new LogEmployee(employeeRepository, bcrypt, token);
export const securityUseCase = new Security(employeeRepository, bcrypt);
export const categoryUseCase = new CategoryManagement(categoryRepository);
