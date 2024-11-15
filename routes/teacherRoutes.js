import express from 'express';
import { completeProfile, login } from '../controllers/authController.js';
import { isAuthenticate } from '../middlewares/authMiddleware.js';
import { loginTeacher } from '../controllers/teacher.js';

const teacherRouter = express.Router();

teacherRouter.post('/teacher/login', login);
teacherRouter.put('/user/profile', isAuthenticate, completeProfile); // Protected route

export default teacherRouter;
