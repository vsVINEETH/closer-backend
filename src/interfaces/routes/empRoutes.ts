import express from 'express';

import { tokenAuth } from '../middlewares/tokenAuth';
import { auth } from '../middlewares/auth';
import dotenv from 'dotenv';
dotenv.config();
import { upload } from '../middlewares/multerS3'
import { employeeAuthController } from '../controllers/employeeControllers/AuthController';
import { employeeCategoryController } from '../controllers/employeeControllers/CategoryController';
import { employeeContentController } from '../controllers/employeeControllers/ContentController';
import { employeeDashboardController } from '../controllers/employeeControllers/DashboardController';
import { uploads } from '../middlewares/multer';

const router = express.Router();
const EMPLOYEE:string = 'employee';
const USER: string = 'user'

//AUTH
router.post('/login', auth(), employeeAuthController.login);
router.post('/change_password', tokenAuth([EMPLOYEE]), auth(), employeeAuthController.changePassword);
router.delete('/logout', tokenAuth([EMPLOYEE]), auth(), employeeAuthController.logout);

//content
router.get('/category_data', tokenAuth([EMPLOYEE]), auth(), employeeCategoryController.fetchCategoryData );
router.post('/create_category', tokenAuth([EMPLOYEE]), auth(), employeeCategoryController.createCategory);
router.put('/update_category', tokenAuth([EMPLOYEE]), auth(), employeeCategoryController.updateCategory )
router.post('/list_category', tokenAuth([EMPLOYEE]), auth(), employeeCategoryController.handleCategoryListing)

//category
router.post('/create_content', tokenAuth([EMPLOYEE]), auth(), uploads, employeeContentController.createContent);
router.get('/content_data', tokenAuth([EMPLOYEE, USER]), auth(), employeeContentController.fetchContentData);
router.post('/list_content', tokenAuth([EMPLOYEE]), auth(), employeeContentController.handleContentListing);
router.delete('/delete_content', tokenAuth([EMPLOYEE]), auth(), employeeContentController.deleteContent);
router.patch('/update_content', tokenAuth([EMPLOYEE]), auth(), employeeContentController.updateContent)

//dashboard
router.get('/dashboard', tokenAuth([EMPLOYEE]), auth(), employeeDashboardController.dashboardData)


export default router;