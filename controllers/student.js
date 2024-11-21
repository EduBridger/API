import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StudentModel } from '../models/studentModel.js';
import { AssignmentModel } from '../models/assignmentModel.js';

// Student Login 
export const loginStudent = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // finding student using their unique email
        const student = await StudentModel.findOne({ email: email });
        if (!student) {
            return res.status(401).json("Invalid email or password");
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json('Invalid email or password');
        }

        // Generate JWT token with student's ID and role
        const accessToken = jwt.sign(
            {
                id: student._id,
                role: 'student' // Set explicit role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            {
                id: student._id,
                role: 'student'
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Send response with tokens
        res.status(200).json({
            message: 'Login Successfully',
            token: accessToken,
            refreshToken: refreshToken,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: 'student',
            }
        });

    } catch (error) {
        next(error)
    }
};


export const getStudentProfile = async (req, res, next) => {
    try {
        // Get student ID from authenticated token
        const studentId = req.user.id;

        // Find student by ID and exclude password
        const student = await StudentModel.findById(studentId).select('-password');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student
        });

    } catch (error) {
        next(error);
    }
};



export const updateStudentProfile = async (req, res, next) => {
    try {

        const studentId = req.user.id;
        const updates = req.body;

        // Prevent updating sensitive fields
        delete updates.password;
        delete updates.email;
        delete updates.role;

        // Find and update the student profile
        const updatedStudent = await StudentModel.findByIdAndUpdate(
            studentId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            student: updatedStudent
        });

    } catch (error) {
        next(error);
    }
};



export const submitAssignment = async (req, res, next) => {
    try {
        // Get student ID from authenticated token
        const studentId = req.user.id;

        const { title, content } = req.body;
        const file = req.file;

        // Validate input
        if (!title || (!content && !file)) {
            return res.status(400).json({
                message: "Title and either content or a file are required.",
            });
        }

        // Verify student exists
        const student = await StudentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Prepare assignment data
        const assignmentData = {
            studentId,
            title,
            content: content || null,
            filePath: file ? file.path : null,
            submittedAt: new Date()
        };

        // Save assignment to the database
        const assignment = new AssignmentModel(assignmentData);
        await assignment.save();

        // Respond with success
        res.status(201).json({
            message: "Assignment submitted successfully!",
            assignment,
        });
    } catch (error) {
        next(error);
    }
};


// Get assignments from teacher
export const getAssignments = async (req, res, next) => {
    try {
        const studentId = req.user.id;

        // Get student's assignments with populated teacher info
        const assignments = await AssignmentModel.find({
            studentId: studentId
        })
        .populate('teacherId', 'name email')
        .sort({ dueDate: 1 })
        .select('title description dueDate status');

        if (!assignments.length) {
            return res.status(200).json({
                message: "No assignments found",
                assignments: []
            });
        }

        res.status(200).json({
            success: true,
            count: assignments.length,
            assignments
        });
    } catch (error) {
        next(error);
    }
};

// View student's grades
export const getGrades = async (req, res, next) => {
    try {
        const studentId = req.user.id;

        // Get student's grades with course info
        const grades = await GradeModel.find({ 
            studentId: studentId 
        })
        .populate('courseId', 'name code')
        .populate('assignmentId', 'title submissionDate')
        .select('score feedback gradedDate');

        if (!grades.length) {
            return res.status(200).json({
                message: "No grades available",
                grades: []
            });
        }

        // Calculate GPA/average if needed
        const averageScore = grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length;

        res.status(200).json({
            success: true,
            count: grades.length,
            averageScore: averageScore.toFixed(2),
            grades
        });
    } catch (error) {
        next(error);
    }
};

// View course materials
export const getCourseMaterials = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.params;

        // Verify student is enrolled in the course
        const student = await StudentModel.findById(studentId);
        if (!student.courses.includes(courseId)) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course"
            });
        }

        // Get course materials with proper organization
        const materials = await CourseModel.findById(courseId)
            .select('materials lectures assignments readings')
            .populate({
                path: 'materials',
                select: 'title description fileUrl uploadedAt type',
                options: { sort: { uploadedAt: -1 } }
            });

        if (!materials) {
            return res.status(404).json({
                success: false,
                message: "Course materials not found"
            });
        }

        res.status(200).json({
            success: true,
            courseId,
            materials: {
                lectures: materials.lectures || [],
                assignments: materials.assignments || [],
                readings: materials.readings || [],
                additionalMaterials: materials.materials || []
            }
        });
    } catch (error) {
        next(error);
    }
};

