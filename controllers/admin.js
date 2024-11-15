import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/adminModel.js';
import { adminSchema } from '../validators/adminValidator.js';
import { UserModel } from '../models/userModel.js';
import { userSchema } from '../validators/userValidator.js';
import { StudentModel } from '../models/studentModel.js';
import { CourseModel } from '../models/courseModel.js';

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
};

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

        // // Validate input
        // const email = value.email 
        // if (!email) {
        //     return res.status(400).json({ message: 'Email is required' });
        // }

         //  Check if the user is already in the Database
         const email = value.email;

         const findIfUserExist = await UserModel.findOne({ email });
         if (findIfUserExist) {
             return res.status(401).send("User is already registered");
         } else {
             const hashedPassword = bcrypt.hashSync(value.password, 12);
             value.password = hashedPassword;
 
             const addAdmin = await UserModel.create(value);
             return res.status(201).send("User successfully registered");
         }

        // // Check if the user already exists
        // const existingUser = await UserModel.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User with this email already exists.' });
        // }

        // // Hash the password
        // const hashedPassword = await bcrypt.hash(value.password, 10);

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

export const createCourse = async (req, res, next) => {
    try {
      const { name, description, duration } = req.body;
  
      // Validate request body 
      if (!name || !description || !duration) {
        return res.status(400).send("All fields are required");
      }
  
      // Check if course already exists
      const existingCourse = await CourseModel.findOne({ name });
      if (existingCourse) {
        return res.status(409).send("Course with this name already exists");
      }
  
      // Create and save the course
      const newCourse = await CourseModel.create(req.body);
      res.status(201).json({
        message: "Course successfully created",
        course: newCourse,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const updateCourse = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Validate request body
      if (!Object.keys(req.body).length) {
        return res.status(400).send("Request body cannot be empty");
      }
  
      // Find and update the course
      const updatedCourse = await CourseModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      if (!updatedCourse) {
        return res.status(404).send("Course not found");
      }
  
      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  
  export const deleteCourse = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Check if there are students enrolled in the course
      const enrolledStudents = await StudentModel.countDocuments({ course: id });
      if (enrolledStudents > 0) {
        return res
          .status(400)
          .send("Cannot delete course with enrolled students");
      }
  
      // Delete the course
      const deletedCourse = await CourseModel.findByIdAndDelete(id);
  
      if (!deletedCourse) {
        return res.status(404).send("Course not found");
      }
  
      res.status(200).send("Course deleted successfully");
    } catch (error) {
      next(error);
    }
  };
  

  export const getCourseById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Find the course
      const course = await CourseModel.findById(id);
  
      if (!course) {
        return res.status(404).send("Course not found");
      }
  
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };

  
  export const getAllCourses = async (req, res, next) => {
    try {
      const courses = await CourseModel.find().sort({ name: 1 });
  
      res.status(200).json({
        message: `Retrieved ${courses.length} courses successfully`,
        courses,
      });
    } catch (error) {
      next(error);
    }
  };
  