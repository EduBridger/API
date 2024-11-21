import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { isAuthenticate, checkRole } from '../middlewares/authMiddleware.js';
import { 
  loginStudent,
  submitAssignment,
  getStudentProfile,
  updateStudentProfile,
  getGrades,
  getCourseMaterials
} from '../controllers/student.js';
import { StudentAssignmentSubmission } from '../middlewares/upload.js';

const studentRouter = express.Router();

// Auth routes
studentRouter.post('/login', loginStudent);

// Profile routes - require student role
studentRouter.get('/profile', isAuthenticate, checkRole('student'), getStudentProfile);
studentRouter.put('/profile', isAuthenticate, checkRole('student'), updateStudentProfile);
studentRouter.put('/complete-profile', isAuthenticate, checkRole('student'), completeProfile);

// Academic routes - require student role
studentRouter.put('/submit-assignment', isAuthenticate, checkRole('student'), StudentAssignmentSubmission.single('file'), submitAssignment);
studentRouter.get('/grades', isAuthenticate, checkRole('student'), getGrades);
studentRouter.get('/courses/:courseId/materials', isAuthenticate, checkRole('student'), getCourseMaterials);

export default studentRouter;
