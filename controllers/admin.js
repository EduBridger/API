import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/adminModel.js';
import { adminSchema } from '../validators/adminValidator.js';
import { UserModel } from '../models/userModel.js';
import { userSchema } from '../validators/userValidator.js';
import { StudentModel } from '../models/studentModel.js';
import { CourseModel } from '../models/courseModel.js';
import { updateCourseSchema } from '../validators/courseValidator.js';
import { studentSchema } from '../validators/studentValidator.js';
import { teacherSchema } from '../validators/teacherValidator.js';
import { TeacherModel } from '../models/teacherModel.js';

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

      await AdminModel.create(value);
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

export const registerStudent = async (req, res, next) => {
  try {

    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // // Validate input
    // const email = value.email 
    // if (!email) {
    //     return res.status(400).json({ message: 'Email is required' });
    // }

    //  Check if the Student is already in the Database
    const email = value.email;

    const findIfStudentExist = await StudentModel.findOne({ email });
    if (findIfStudentExist) {
      return res.status(401).send("Student is already registered");
    } else {
      const hashedPassword = bcrypt.hashSync(value.password, 12);
      value.password = hashedPassword;

      await StudentModel.create(value);
      return res.status(201).send("Student successfully registered");
    }

    // // Check if the Student already exists
    // const existingStudent = await StudentModel.findOne({ email });
    // if (existingStudent) {
    //     return res.status(400).json({ message: 'Student with this email already exists.' });
    // }

    // // Hash the password
    // const hashedPassword = await bcrypt.hash(value.password, 10);

    // Create new Student
    const newStudent = new StudentModel({
      ...value
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    // if (error.code === 11000) {
    //     return res.status(400).json({ message: 'Duplicate key error' });
    // }
    next(error);
  }
};

export const registerTeacher = async (req, res, next) => {
  try {

    const { error, value } = teacherSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // // Validate input
    // const email = value.email 
    // if (!email) {
    //     return res.status(400).json({ message: 'Email is required' });
    // }

    //  Check if the Teacher is already in the Database
    const email = value.email;

    const findIfTeacherExist = await TeacherModel.findOne({ email });
    if (findIfTeacherExist) {
      return res.status(401).send("Teacher is already registered");
    } else {
      const hashedPassword = bcrypt.hashSync(value.password, 12);
      value.password = hashedPassword;

      await TeacherModel.create(value);
      return res.status(201).send("Teacher successfully registered");
    }

    // // Check if the Teacher already exists
    // const existingTeacher = await TeacherModel.findOne({ email });
    // if (existingTeacher) {
    //     return res.status(400).json({ message: 'Teacher with this email already exists.' });
    // }

    // // Hash the password
    // const hashedPassword = await bcrypt.hash(value.password, 10);

    // Create new Teacher
    const newTeacher = new TeacherModel({
      ...value
    });

    await newTeacher.save();

    res.status(201).json({ message: 'Teacher registered successfully' });
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


// export const updateCourse = async (req, res, next) => {
//   try {
//     // validate the input 
//     const {error, value} =updateCourseSchema.validate(req.body);
//     if (error){
//       return res.status(422).json(error);
//     }
//     // Find and update the course
//     const updatedCourse = await CourseModel.findOneAndUpdate({
//       _id: re.params.id,
//       Student: req.admin.id
//     },
//   value,
// {new:true}
// );

// if (!updatedCourse) {
//   return res.status(404).json({mesage:"Course not found"});
// }

// //Respond to request
// re.status(201).json('Course has been updated'); 
//   } catch (error) {
//     next(error);
//   }
// }


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

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await StudentModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: `Retrieved ${students.length} students successfully`,
      students,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    // Validate the request body
    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        message: "Request body cannot be empty",
      });
    }

    // Update the student's details in the database
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: req.params.id }, // Find the student by ID
      { $set: req.body }, // Update the provided fields
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Respond with the updated student details
    res.status(200).json({
      message: "Student details updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};


// export const updateStudent = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     // Validate request body
//     if (!Object.keys(req.body).length) {
//       return res.status(400).send("Request body cannot be empty");
//     }

//     // Find and update the student
//     const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedStudent) {
//       return res.status(404).send("Student not found");
//     }

//     res.status(200).json({
//       message: "Student updated successfully",
//       student: updatedStudent,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the student
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).send("Student not found");
    }

    res.status(200).send("Student deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const searchStudents = async (req, res, next) => {
  try {
    const { query: searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).send("Search term is required");
    }

    const students = await StudentModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { course: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).json({
      message: `Found ${students.length} student(s) for search term "${searchTerm}"`,
      students,
    });
  } catch (error) {
    next(error);
  }
};

export const searchTeachers = async (req, res, next) => {
  try {
    const { query: searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).send("Search term is required");
    }

    const teachers = await TeacherModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { course: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).json({
      message: `Found ${teachers.length} teacher(s) for search term "${searchTerm}"`,
      teachers,
    });
  } catch (error) {
    next(error);
  }
};
