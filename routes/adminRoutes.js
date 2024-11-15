import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { authorize, isAuthenticate } from '../middlewares/authMiddleware.js';
import { createCourse, deleteCourse, getAllCourses, getCourseById, loginAdmin, registerAdmin, registerUser, updateCourse } from '../controllers/admin.js';

const adminRouter = express.Router();

adminRouter.post('/admin/signup', registerAdmin)
adminRouter.post('/admin/login', loginAdmin);
adminRouter.put('/admin/profile', isAuthenticate, completeProfile);
adminRouter.post('/admin/registration', isAuthenticate, registerUser);
adminRouter.post('/admin/cousre/add', isAuthenticate, createCourse);
adminRouter.patch('/admin/cousre/update/:id', isAuthenticate, updateCourse);
adminRouter.delete('/admin/cousre/delete', isAuthenticate, deleteCourse);
adminRouter.get('/admin/cousres', isAuthenticate, getAllCourses);
adminRouter.delete('/admin/cousre/:id', isAuthenticate, getCourseById);


export default adminRouter;
