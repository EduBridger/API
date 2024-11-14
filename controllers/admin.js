import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/adminModel.js';
import { adminSchema } from '../validators/adminValidator.js';
import { UserModel } from '../models/userModel.js';
import { userSchema } from '../validators/userValidator.js';

// Secret key for JWT (should be stored securely)
const JWT_SECRET = 'your_jwt_secret_key';

// Registrating the Administrator
export const registerAdmin = async (req, res, next) => {
    try {
        const { error, value } = adminSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        //  Check if the user is already in the Database
        const email = value.email;

        const findIfUserExist = await AdminModel.findOne({ email });
        if (findIfUserExist) {
            return res.status(401).send("Admin is already registered");
        } else {
            const hashedPassword = bcrypt.hashSync(value.password, 12);
            value.password = hashedPassword;

            const addAdmin = await AdminModel.create(value);
            return res.status(201).send("Admin successfully registered");
        }
    } catch (error) {
        next(error)

    }
}

// Administrator Login 
export const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // finding admin using their unique email
        const admin = await AdminModel.findOne({ email: email });
        if (!admin) {
            return res.status(401).json("Invalide email or passwor");
        }
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json('Invalid email or password');
        }

        // Generate JWT token with admin's ID and role
        const accessToken = jwt.sign(
            { id: admin._id, admin: admin.role === "admin" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" });

        const refreshToken = jwt.sign(
            { id: admin._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Send response with tokens
        res.status(200).json({
            message: 'Login Successfully',
            token: accessToken,
            refreshToken: refreshToken,
            admin: {
                name: admin.name,
                email: admin.email,
                role: admin.role,
            }
        });

    } catch (error) {
        next(error)
    }
}

export const registerUser = async (req, res, next) => {
    try {

        const { error, value } = userSchema.validate(req.body);
        if (error){
            return res.status(400).send(error.details[0].message);
        }

        // Validate input
        const email = value.email 
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(value.password, 10);

        // Create new user
        const newUser = new UserModel({
           ...value
        });

        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // if (error.code === 11000) {
        //     return res.status(400).json({ message: 'Duplicate key error' });
        // }
        next(error);
    }
};

// // **** Register Other Users Logic ****
// export const registerUser = async (req, res, next) => {
//     try {
//         const { email, password, role } = req.body;

//         // Validate role input
//         if (!['teacher', 'student', 'parent'].includes(role)) {
//             return res.status(400).json({ message: 'Invalid role specified' });
//         }

//         // Hash the password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user based on role
        
//         const newUser = new User ({
//             email,
//             password: hashedPassword,
//             role // Set the role as specified in request
//         });

//         await newUser.save();
        
//         // Send success response
//         res.status(201).json({
//             message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
//             user: {
//                 username: newUser.username,
//                 role: newUser.role
//             }
//         });
//     } catch (error) {
//         next(error);
//         // next(new Error('Error registering ser: ' + error.message));
//     }
// };