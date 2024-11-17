import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { authorize, isAuthenticate } from '../middlewares/authMiddleware.js';
import { createCourse, deleteCourse, deleteStudent, getAllCourses, getAllStudents, getCourseById, loginAdmin, registerAdmin, registerStudent, registerTeacher, searchStudents, searchTeachers, updateCourse, updateStudent } from '../controllers/admin.js';

const adminRouter = express.Router();

adminRouter.post('/admin/signup', registerAdmin)
adminRouter.post('/admin/login', loginAdmin);
adminRouter.put('/admin/profile', isAuthenticate, completeProfile);
adminRouter.post('/admin/student/registration', isAuthenticate, registerStudent);
adminRouter.post('/admin/teacher/registration', isAuthenticate, registerTeacher);
adminRouter.post('/admin/course/add', isAuthenticate, createCourse);
adminRouter.patch('/admin/courses/update/:id', isAuthenticate, updateCourse);
adminRouter.delete('/admin/course/delete/:id', isAuthenticate, deleteCourse);
adminRouter.get('/admin/courses', isAuthenticate, getAllCourses);
adminRouter.get('/admin/course/:id', isAuthenticate, getCourseById);
adminRouter.get('/admin/students', isAuthenticate, getAllStudents);
adminRouter.patch('/admin/students/update/:id', isAuthenticate, updateStudent);
adminRouter.delete('/admin/student/delete/:id', isAuthenticate, deleteStudent);
adminRouter.get('/admin/students', isAuthenticate, searchStudents);
adminRouter.get('/admin/teachers', isAuthenticate, searchTeachers);

// adminRouter.get('/admin/teachers', isAuthenticate, searchTeachers);



export default adminRouter;
