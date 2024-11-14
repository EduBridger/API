
import { model, Schema } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';


// User Schema 
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true },
    profilePicture: String, // Optional: Users can upload their avatars
  },

  { timestamps: true }

);

userSchema.plugin(toJSON)

export const UserModel = model('User', userSchema);


