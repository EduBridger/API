import { model, Schema } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';

// Course Schema
const courseSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true, min: [0, 'Duration must be a positive number'] },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        teacher: { type: String, required: true },
    },
    { timestamps: true }
);

courseSchema.plugin(toJSON);

export const CourseModel = model('Course', courseSchema);