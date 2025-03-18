import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import { tokenAuth } from "../middlewares/tokenAuth";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/multerS3";
import { uploads } from "../middlewares/multer";

import { userAuthController } from "../controllers/userControllers/AuthController";
import { profileControll } from "../controllers/userControllers/ProfileController";
import { userSubscriptionController } from "../controllers/userControllers/UserSubscriptionController";
import { userEventController } from "../controllers/userControllers/UserEventController";
import { walletController } from "../controllers/userControllers/WalletController";
import { userManagementController } from "../controllers/userControllers/UserManagementController";
import { userInteractionController } from "../controllers/userControllers/UserInteractionController";
import { userChatController } from "../controllers/userControllers/UserChatController";
import { userContentController } from "../controllers/userControllers/UserContentController";
import { userAdvertisementController } from "../controllers/userControllers/UserAdvertisementController";
import { locationController } from "../controllers/userControllers/LocationController";

import { validateRequest } from "../middlewares/validateRequest";
import { userLoginValidator } from "../validators/userValidator";
import { userSignupValidator } from "../validators/userValidator";


const router = express.Router();

const USER:string = 'user';

//AUTH
router.post("/login", userLoginValidator, validateRequest, auth(), userAuthController.login);
router.post("/loginAuth", auth(), userAuthController.loginAuth);
router.delete("/logout",  tokenAuth([USER]),auth(), userAuthController.logout);

router.post("/signup", userSignupValidator, validateRequest, auth(), userAuthController.signup);
router.post("/verify", userAuthController.verifyOTP);
router.post("/resend", userAuthController.resendOTP);
router.post("/setup", uploads, userAuthController.setupAccount);

router.post("/forgot_password", auth(), userAuthController.forgotPassword);
router.post("/forgot_verify", auth(), userAuthController.forgotVerify);
router.post("/forgot_resend", auth(), userAuthController.forgotResend);

router.post("/change_password", tokenAuth([USER]), auth(), userAuthController.changePassword);


//profile
router.patch("/update_profile",  tokenAuth([USER]), auth(), profileControll.updateProfile);
router.get('/profile', tokenAuth([USER]), auth(), profileControll.profile);
router.get('/profile_imageUrl_update', tokenAuth([USER]), auth(), profileControll.updateProfileImageURLs);
router.delete('/profile_image', tokenAuth([USER]), auth(), profileControll.removeImage);
router.patch('/profile_image', tokenAuth([USER]), auth(), uploads, profileControll.addImage);
router.patch('/change_profile_image', tokenAuth([USER]), auth(), profileControll.changeProfileImage)


//subscription
router.get('/subscription', tokenAuth([USER]), auth(), userSubscriptionController.fetchSubscription);
router.get('/selected_subscription', tokenAuth([USER]), auth(), userSubscriptionController.selectedSubscription);
router.post('/create_order', tokenAuth([USER]), auth(), userSubscriptionController.createOrder);
router.post('/verify_payment', tokenAuth([USER]), auth(), userSubscriptionController.verifyPayment);
router.put('/abort_payment', tokenAuth([USER]), auth(), userSubscriptionController.abortPayment);


//event
router.get('/event', tokenAuth([USER]), userEventController.fetchEvent);
router.get('/booked_events', tokenAuth([USER]), auth(), userEventController.fetchBookedEvents);
router.post('/book_order', tokenAuth([USER]), auth(), userEventController.bookOder);
router.post('/verify_book_payment', tokenAuth([USER]), auth(), userEventController.verifyBookPayment)
router.put('/abort_book_payment', tokenAuth([USER]), auth(), userEventController.abortBookPayment);

//wallet
router.get('/wallet', tokenAuth([USER]), auth(), walletController.fetchWallet);
router.post('/wallet_create_order', tokenAuth([USER]), auth(), walletController.createWalletOrder);
router.post('/wallet_verify_payment', tokenAuth([USER]), auth(), walletController.verifyWalletPayment);
router.post('/wallet_payment', tokenAuth([USER]), auth(), walletController.payWithWallet);


//user management
router.get("/users_data",  tokenAuth([USER]), auth(), userManagementController.fetchUsersData);
router.put('/block', tokenAuth([USER]), auth(), userManagementController.blockUser);
router.put('/report', tokenAuth([USER]), auth(), userManagementController.reportUser);
router.get('/block_list', tokenAuth([USER]), auth(), userManagementController.blockList);
router.put('/unblock', tokenAuth([USER]), auth(), userManagementController.unblockUser);


//user interactions
router.get('/notifications', tokenAuth([USER]), auth(), userInteractionController.fetchNotifications);
router.post('/interest_request', tokenAuth([USER]), auth(), userInteractionController.handleInterestRequest);
router.get('/matches', tokenAuth([USER]), auth(), userInteractionController.fetchMatches);
router.patch('/unmatch', tokenAuth([USER]), auth(), userInteractionController.unmatchUser);

//Chat & Messaging
router.get('/messages', tokenAuth([USER]), auth(), userChatController.fetchMessages)
router.get('/chats', tokenAuth([USER]), auth(), userChatController.fetchChats);
router.post('/upload_audio', tokenAuth([USER]), auth(), upload, userChatController.uploadAudio);

//advertisement
router.get('/advertisements', tokenAuth([USER]), auth(), userAdvertisementController.fetchAds);

//content (blog)
router.get('/content_detail', tokenAuth([USER]), auth(), userContentController.fetchContentDetail);
router.patch('/content_vote', tokenAuth([USER]),auth(), userContentController.voteContent);
router.patch('/content_share', tokenAuth([USER]), auth(), userContentController.sharedContent);

//
router.post('/update_location', tokenAuth([USER]), auth(), locationController.locationUpdater)

export default router;
