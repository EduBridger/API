import express from 'express';
import { completeProfile } from '../controllers/authController.js';
import { authorize, isAuthenticate, hasPermission } from '../middlewares/authMiddleware.js';
import { createCourse, deleteCourse, deleteStudent, getAllCourses, getAllStudents, getCourseById, loginAdmin, registerAdmin, registerStudent, registerTeacher, searchStudents, searchTeachers, updateCourse, updateStudent, deleteTeacher, updateTeacher, getAllTeachers } from '../controllers/admin.js';

const adminRouter = express.Router();

adminRouter.post('/admin/signup', registerAdmin);
adminRouter.post('/admin/login', loginAdmin);
adminRouter.put('/admin/profile', isAuthenticate, hasPermission('get_profile'), completeProfile);

// Student routes
adminRouter.post('/admin/student/registration', isAuthenticate, authorize('admin'), hasPermission('create_student'), registerStudent);
adminRouter.patch('/admin/students/update/:id', isAuthenticate, authorize('admin'), hasPermission('update_student'), updateStudent);
adminRouter.delete('/admin/student/delete/:id', isAuthenticate, authorize('admin'), hasPermission('delete_student'), deleteStudent);
adminRouter.get('/admin/students', isAuthenticate, authorize('admin'), hasPermission('view_students'), getAllStudents);
adminRouter.get('/admin/students/search', isAuthenticate, authorize('admin'), hasPermission('view_students'), searchStudents);

// Teacher routes
adminRouter.post('/admin/teacher/registration', isAuthenticate, authorize('admin'), hasPermission('create_teacher'), registerTeacher);
adminRouter.get('/admin/teachers', isAuthenticate, authorize('admin'), hasPermission('view_teachers'), getAllTeachers);
adminRouter.get('/admin/teachers/search', isAuthenticate, authorize('admin'), hasPermission('view_teachers'), searchTeachers);
adminRouter.delete('/admin/teachers/delete/:id', isAuthenticate, authorize('admin'), hasPermission('delete_teacher'), deleteTeacher);
adminRouter.patch('/admin/teachers/update/:id', isAuthenticate, authorize('admin'), hasPermission('update_teacher'), updateTeacher);

// Course routes
adminRouter.post('/admin/course/add', isAuthenticate, authorize('admin'), hasPermission('create_course'), createCourse);
adminRouter.patch('/admin/courses/update/:id', isAuthenticate, authorize('admin'), hasPermission('update_course'), updateCourse);
adminRouter.delete('/admin/courses/:id', isAuthenticate, authorize('admin'), hasPermission('delete_course'), deleteCourse);
adminRouter.get('/admin/courses', isAuthenticate, authorize('admin'), hasPermission('view_courses'), getAllCourses);
adminRouter.get('/admin/course/:id', isAuthenticate, authorize('admin'), hasPermission('view_courses'), getCourseById);

export default adminRouter;
