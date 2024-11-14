import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { authorize, isAuthenticate } from '../middlewares/authMiddleware.js';
import { loginAdmin, registerAdmin, registerUser } from '../controllers/admin.js';

const adminRouter = express.Router();

adminRouter.post('/admin/signup', registerAdmin)
adminRouter.post('/admin/login', loginAdmin);
adminRouter.put('/admin/profile', isAuthenticate, completeProfile);
adminRouter.post('/admin/registration', isAuthenticate, registerUser);


export default adminRouter;
