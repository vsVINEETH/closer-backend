import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { tokenAuth } from '../middlewares/tokenAuth';
import { uploads } from '../middlewares/multer';
import { adminAuthController } from '../controllers/adminControllers/AuthController';
import { employeeManagementController } from '../controllers/adminControllers/EmployeeManagementController';
import { userManagementController } from '../controllers/adminControllers/UserManagementController';
import { subscriptionManagementController } from '../controllers/adminControllers/SubscriptionManagementController';
import { advertisementManagementController } from '../controllers/adminControllers/AdvertisementManagementController';
import { eventManagementController } from '../controllers/adminControllers/EventManagementController';
import { dashboardController } from '../controllers/adminControllers/DashboardController';

const router = express.Router();

const ADMIN:string = 'admin';
const USER:string = 'user';

router.post('/login', adminAuthController.login);
router.delete('/logout', tokenAuth([ADMIN]), adminAuthController.logout);

// router.get('/employee_data', tokenAuth([ADMIN]), employeeManagementController.fetchEmployeesData);
// router.post('/create_employee', tokenAuth([ADMIN]), employeeManagementController.createEmployee);
// router.post('/block_employee', tokenAuth([ADMIN]), employeeManagementController.blockEmployee);

router.get('/employees', tokenAuth([ADMIN]), employeeManagementController.fetchEmployeesData);
router.post('/employees', tokenAuth([ADMIN]), employeeManagementController.createEmployee);
router.patch('/employees', tokenAuth([ADMIN]), employeeManagementController.blockEmployee);

// router.get('/user_data', tokenAuth([ADMIN]), userManagementController.fetchUsersData);
// router.post('/block_user', tokenAuth([ADMIN]), userManagementController.blockUser);
// router.patch('/ban_user', tokenAuth([ADMIN]), userManagementController.banUser);
// router.patch('/unban_user', tokenAuth([ADMIN]), userManagementController.unBanUser);

router.get('/users', tokenAuth([ADMIN]), userManagementController.fetchUsersData);
router.patch('/users', tokenAuth([ADMIN]), userManagementController.blockUser);
router.patch('/users/ban', tokenAuth([ADMIN]), userManagementController.banUser);
router.patch('/users/unban', tokenAuth([ADMIN]), userManagementController.unBanUser);

// router.get('/subscription_data', tokenAuth([ADMIN]), subscriptionManagementController.fetchSubscriptionData);
// router.post('/list_subscription', tokenAuth([ADMIN]), subscriptionManagementController.handleSubscriptionListing);
// router.patch('/update_subscription', tokenAuth([ADMIN]), subscriptionManagementController.updateSubscription);

router.get('/subscriptions', tokenAuth([ADMIN]), subscriptionManagementController.fetchSubscriptionData);
router.post('/subscriptions', tokenAuth([ADMIN]), subscriptionManagementController.handleSubscriptionListing);
router.patch('/subscriptions', tokenAuth([ADMIN]), subscriptionManagementController.updateSubscription);

// router.get('/advertisement', tokenAuth([ADMIN,USER]), advertisementManagementController.fetchAdvertisementData);
// router.post('/advertisement', tokenAuth([ADMIN]), uploads, advertisementManagementController.createAdvertisement);
// router.patch('/advertisement', tokenAuth([ADMIN]), advertisementManagementController.updateAdvertisement);
// router.patch('/list_advertisement', tokenAuth([ADMIN]), advertisementManagementController.advertisementListing);
// router.delete('/advertisement', tokenAuth([ADMIN]),  advertisementManagementController.removeAdvertisement);

router.get('/advertisements', tokenAuth([ADMIN, USER]), advertisementManagementController.fetchAdvertisementData);
router.post('/advertisements', tokenAuth([ADMIN]), uploads, advertisementManagementController.createAdvertisement);
router.patch('/advertisements', tokenAuth([ADMIN]), advertisementManagementController.updateAdvertisement);
router.patch('/advertisements/listing', tokenAuth([ADMIN]), advertisementManagementController.advertisementListing);
router.delete('/advertisements', tokenAuth([ADMIN]), advertisementManagementController.removeAdvertisement);


router.get('/events', tokenAuth([ADMIN, USER]), eventManagementController.fetchEvents);
router.post('/events', tokenAuth([ADMIN]), uploads, eventManagementController.createEvent);
router.patch('/events', tokenAuth([ADMIN]), eventManagementController.updateEvent);
router.delete('/events', tokenAuth([ADMIN]), eventManagementController.deleteEvent);

router.get('/dashboard', tokenAuth([ADMIN]), dashboardController.dashboardData);


export default router;