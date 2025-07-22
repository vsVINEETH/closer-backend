
import { AdvertisementManagement } from "../usecases/usecases/admin/AdvertisementUseCase";
import { ContentManagement } from "../usecases/usecases/employee/ContentUseCase";
import { EventManagement } from "../usecases/usecases/admin/EventUseCase";
import { SubscriptionManagement } from "../usecases/usecases/SubscriptionUseCase";

import { S3ClientAccessControll } from "../infrastructure/services/S3Client";
import { Mailer } from "../infrastructure/services/Mailer";
import { RazorpayService } from "../infrastructure/services/Razorpay"

import { AdvertisementRepository } from "../infrastructure/repositories/AdvertisementRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { ContentRepository } from "../infrastructure/repositories/ContentRepository";
import { EventRepository } from "../infrastructure/repositories/EventRepository";
import { SalesRepository } from "../infrastructure/repositories/SalesRepository";
import { SubscriptionRepository } from "../infrastructure/repositories/SubscriptionRepository";
import { WalletRepository } from "../infrastructure/repositories/WalletRepository";

const s3ClientAccessControll = new S3ClientAccessControll();
const razorpay = new RazorpayService();
const mailer = new Mailer();

const advertisementRepository = new AdvertisementRepository();
const userRepository = new UserRepository();
const contentRepository = new ContentRepository();
const eventRepository = new EventRepository();
const salesRepository = new SalesRepository();
const subscriptionRepository = new SubscriptionRepository();
const walletRepository = new WalletRepository();

export const advertisementUseCase = new AdvertisementManagement(advertisementRepository, s3ClientAccessControll);

export const contentUseCases = new ContentManagement(contentRepository, userRepository, mailer, s3ClientAccessControll);

export const eventUseCase = new EventManagement(eventRepository, mailer, userRepository, razorpay, salesRepository, s3ClientAccessControll)

export const subscriptionUseCases = new SubscriptionManagement(subscriptionRepository, razorpay, userRepository, walletRepository, salesRepository)