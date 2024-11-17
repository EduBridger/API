import { model, Schema } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';


const assignmentSchema = new Schema({
    studentId: { type: String, required: true, ref: "Student" },
    title: { type: String, required: true },
    content: { type: String },
    filePath: { type: String },
},

    { timestamps: true }

);

assignmentSchema.plugin(toJSON);

export const AssignmentModel = model('Assignment', assignmentSchema);
