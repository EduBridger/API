import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { isAuthenticate, checkRole } from '../middlewares/authMiddleware.js';
import {
  loginStudent, submitAssignment, getStudentProfile, updateStudentProfile, getGrades, getCourseMaterials
} from '../controllers/student.js';
import { StudentAssignmentSubmission } from '../middlewares/upload.js';

const studentRouter = express.Router();

// Auth routes
studentRouter.post('/student/login', loginStudent);

// Profile routes - require student role
studentRouter.get('/student/profile/:id', isAuthenticate, checkRole('student'), getStudentProfile);
studentRouter.put('/student/profile/update/:id', isAuthenticate, checkRole('student'), updateStudentProfile);
studentRouter.put('/student/complete-profile/:id', isAuthenticate, checkRole('student'), completeProfile);

// Academic routes - require student role
studentRouter.put('/student/submit-assignment', isAuthenticate, checkRole('student'), StudentAssignmentSubmission.single('file'), submitAssignment);
studentRouter.get('/student/grades', isAuthenticate, checkRole('student'), getGrades);
studentRouter.get('/student/courses/materials/:id', isAuthenticate, checkRole('student'), getCourseMaterials);

export default studentRouter;
