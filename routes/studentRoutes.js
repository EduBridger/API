import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import {  isAuthenticate } from '../middlewares/authMiddleware.js';
import { loginStudent, } from '../controllers/student.js';

const studentRouter = express.Router();


studentRouter.post('/student/login', loginStudent);
studentRouter.put('/student/profile', isAuthenticate, completeProfile);


export default studentRouter;
