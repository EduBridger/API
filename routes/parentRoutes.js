import express from 'express';
import { login, completeProfile } from '../controllers/authController.js';
import { isAuthenticate } from '../middlewares/authMiddleware.js';

const parentRouter = express.Router();

parentRouter.post('/login', login);
parentRouter.put('/user/profile', isAuthenticate, completeProfile); // Protected route

export default parentRouter;
