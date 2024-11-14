import express from 'express';
import { login, completeProfile } from '../controllers/authController.js';
import {  isAuthenticate } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.put('/user/profile', isAuthenticate, completeProfile); // Protected route

export default authRouter;
