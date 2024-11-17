import express from 'express';
import { completeProfile, } from '../controllers/authController.js';
import {  isAuthenticate } from '../middlewares/authMiddleware.js';
import { loginStudent, submitAssignment, } from '../controllers/student.js';
import { StudentAssignmentSubmission } from '../middlewares/upload.js';

const studentRouter = express.Router();


studentRouter.post('/student/login', loginStudent);
studentRouter.put('/student/profile', isAuthenticate, completeProfile);
studentRouter.put('/student/submit', isAuthenticate, StudentAssignmentSubmission.single('file'),submitAssignment);


export default studentRouter;
