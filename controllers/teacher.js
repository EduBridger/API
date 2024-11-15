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
            { expiresIn: "1h" });

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
