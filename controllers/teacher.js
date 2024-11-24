import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TeacherModel } from '../models/teacherModel.js';
import { UserModel } from '../models/userModel.js';




// Teacher Login 
export const loginTeacher = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // finding teacher using their unique email
        const teacher = await TeacherModel.findOne({ email: email });
        if (!teacher) {
            return res.status(401).json("Invalide email or passwor");
        }
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json('Invalid email or password');
        }

        // Generate JWT token with teacher's ID and role
        const accessToken = jwt.sign(
            { id: teacher._id, teacher: teacher.role === "teacher" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" });

        const refreshToken = jwt.sign(
            { id: teacher._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Send response with tokens
        res.status(200).json({
            message: 'Login Successfully',
            token: accessToken,
            refreshToken: refreshToken,
            teacher: {
                name: teacher.name,
                email: teacher.email,
                role: teacher.role,
            }
        });

    } catch (error) {
        next(error)
    }
}

// Add course material
export const addCourseMaterial = async (req, res, next) => {
    try {
        const teacherId = req.user.id;
        const { courseId, title, description, type, content } = req.body;
        const file = req.file;

        // Validate input
        if (!courseId || !title || !type) {
            return res.status(400).json({
                success: false,
                message: "Course ID, title and material type are required"
            });
        }

        // Create material object
        const material = {
            title,
            description,
            type,
            content: content || null,
            fileUrl: file ? file.path : null,
            uploadedBy: teacherId,
            uploadedAt: new Date()
        };

        // Add material to course
        const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            { $push: { materials: material } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(201).json({
            success: true,
            message: "Course material added successfully",
            material
        });

    } catch (error) {
        next(error);
    }
};

// Get course materials
export const getCourseMaterials = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const materials = await CourseModel.findById(courseId)
            .select('materials')
            .populate('materials.uploadedBy', 'name');

        if (!materials) {
            return res.status(404).json({
                success: false,
                message: "Course materials not found"
            });
        }

        res.status(200).json({
            success: true,
            materials: materials.materials
        });

    } catch (error) {
        next(error);
    }
};

// Add or update student grade
export const updateStudentGrade = async (req, res, next) => {
    try {
        const { studentId, courseId, assignmentId, score, feedback } = req.body;

        // Validate input
        if (!studentId || !courseId || !assignmentId || !score) {
            return res.status(400).json({
                success: false,
                message: "Student ID, course ID, assignment ID and score are required"
            });
        }

        const grade = await GradeModel.findOneAndUpdate(
            { 
                studentId,
                courseId,
                assignmentId 
            },
            {
                score,
                feedback,
                gradedDate: new Date()
            },
            { 
                new: true,
                upsert: true 
            }
        );

        res.status(200).json({
            success: true,
            message: "Grade updated successfully",
            grade
        });

    } catch (error) {
        next(error);
    }
};

// Get student grades
export const getStudentGrades = async (req, res, next) => {
    try {
        const { studentId, courseId } = req.params;

        const query = { studentId };
        if (courseId) query.courseId = courseId;

        const grades = await GradeModel.find(query)
            .populate('courseId', 'name code')
            .populate('assignmentId', 'title');

        res.status(200).json({
            success: true,
            grades
        });

    } catch (error) {
        next(error);
    }
};

// Add assignment
export const addAssignment = async (req, res, next) => {
    try {
        const teacherId = req.user.id;
        const { courseId, title, description, dueDate } = req.body;
        const file = req.file;

        if (!courseId || !title || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Course ID, title and due date are required"
            });
        }

        const assignment = new AssignmentModel({
            courseId,
            title,
            description,
            fileUrl: file ? file.path : null,
            dueDate,
            createdBy: teacherId
        });

        await assignment.save();

        res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            assignment
        });

    } catch (error) {
        next(error);
    }
};

// Get list of students
export const getStudentsList = async (req, res, next) => {
    try {
        const teacherId = req.user.id;
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        // First verify the teacher is assigned to this course
        const course = await CourseModel.findOne({
            _id: courseId,
            teacherId: teacherId
        });

        if (!course) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view students for this course"
            });
        }

        // Get students enrolled in this specific course
        const students = await StudentModel.find({
            courses: courseId
        }).select('name email');

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {
        next(error);
    }
};

// Get submitted assignments
export const getSubmittedAssignments = async (req, res, next) => {
    try {
        const { courseId, assignmentId } = req.params;

        const query = {};
        if (courseId) query.courseId = courseId;
        if (assignmentId) query._id = assignmentId;

        const submissions = await AssignmentModel.find(query)
            .populate('studentId', 'name email')
            .select('title content filePath submittedAt');

        res.status(200).json({
            success: true,
            count: submissions.length,
            submissions
        });

    } catch (error) {
        next(error);
    }
};
