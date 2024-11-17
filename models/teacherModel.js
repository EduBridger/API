
import { model, Schema } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';


// Teacher Schema extends User Schema
const teacherSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true },
    course: { type: String, required: true },
  // yearsOfExperience: { type: Number, required: true },
    // profilePicture: String, // Optional: Users can upload their avatars
  },

  { timestamps: true }

);
  
teacherSchema.plugin(toJSON)

export const TeacherModel = model('teacher', teacherSchema);
