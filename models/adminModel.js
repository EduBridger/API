
import { model, Schema } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';


// Admin Schema 
const adminSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        school: { type: String, required: true },
        role: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true },
        profilePicture: String, // Optional: Users can upload their avatars
    },

    { timestamps: true }

);

adminSchema.plugin(toJSON)

export const AdminModel = model('Admin', adminSchema);


