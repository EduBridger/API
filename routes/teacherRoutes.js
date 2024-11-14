import express from 'express';
import { login, completeProfile } from '../controllers/authController.js';
import { isAuthenticate } from '../middlewares/authMiddleware.js';

const teacherRouter = express.Router();

teacherRouter.post('/login', login);
teacherRouter.put('/user/profile', isAuthenticate, completeProfile); // Protected route

export default teacherRouter;
