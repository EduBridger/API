import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { isAuthenticate, checkRole } from '../middlewares/authMiddleware.js';
import { loginTeacher, getStudentsList, getSubmittedAssignments } from '../controllers/teacher.js';

const teacherRouter = express.Router();

// Auth routes
teacherRouter.post('/teacher/login', loginTeacher);
teacherRouter.put('/teacher/complete-profile', isAuthenticate, checkRole('teacher'), completeProfile);

// Student management routes
teacherRouter.get('/teacher/astudents', isAuthenticate, checkRole('teacher'), getStudentsList);
teacherRouter.get('/teacher/students/:courseId', isAuthenticate, checkRole('teacher'), getStudentsList);

// Assignment management routes
teacherRouter.get('/teacher/assignments', isAuthenticate, checkRole('teacher'), getSubmittedAssignments);
teacherRouter.get('/teacher/courses/:courseId/assignments', isAuthenticate, checkRole('teacher'), getSubmittedAssignments);
teacherRouter.get('/teacher/assignments/:assignmentId', isAuthenticate, checkRole('teacher'), getSubmittedAssignments);

export default teacherRouter;
