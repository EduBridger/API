
import { model, Schema } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';


// Student Schema extends User Schema
const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    course: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true },
    
    profilePicture: String, // Optional: Users can upload their avatars
  },

  { timestamps: true }

);
  
studentSchema.plugin(toJSON)

export const StudentModel = model('student', studentSchema);
