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
            { expiresIn: "1h" }
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
