import { LogUser } from "../usecases/usecases/user/LogUseCase";
import { SignupUser } from "../usecases/usecases/user/SignupUseCase";
import { Security } from "../usecases/usecases/user/SecurityUseCase";
import { CommonOperations } from "../usecases/usecases/user/CommonUseCase";
import { ChatManagement } from "../usecases/usecases/user/ChatUseCase";
import { NotifyUser } from "../usecases/usecases/user/NotifyUserUseCase";
import { WalletManagement } from "../usecases/usecases/user/WalletUseCase";

import { Token } from "../infrastructure/services/Jwt";
import { Bcrypt } from "../infrastructure/services/Bcrypt";
import { Mailer } from "../infrastructure/services/Mailer";
import { OTP } from "../infrastructure/services/Otp";
import { S3ClientAccessControll } from "../infrastructure/services/S3Client";
import { Geolocation } from "../infrastructure/services/Geolocation";
import { RazorpayService } from "../infrastructure/services/Razorpay";

import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { ChatRepository } from "../infrastructure/repositories/ChatRepository";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { WalletRepository } from "../infrastructure/repositories/WalletRepository";

const token = new Token();
const bcrypt = new Bcrypt();
const mailer = new Mailer();
const otp = new OTP();
const s3ClientAccessControll = new S3ClientAccessControll();
const geolcation = new Geolocation();
const razorpay = new RazorpayService()

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const notificationRepository = new NotificationRepository();
const walletRepository = new WalletRepository();

export const logUserUseCase = new LogUser(userRepository, token, bcrypt, s3ClientAccessControll);

export const signupUserUseCase = new SignupUser(userRepository, mailer, bcrypt, otp, token, s3ClientAccessControll);

export const securityUserUseCase = new Security(userRepository, bcrypt, otp, mailer, s3ClientAccessControll);

export const commonUserUseCase = new CommonOperations(userRepository, s3ClientAccessControll, geolcation);

export const chatUserUseCase = new ChatManagement(chatRepository);

export const notificationUseCases = new NotifyUser(notificationRepository);

export const walletUseCases = new WalletManagement(walletRepository, razorpay);