import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

export const localUpload = multer({dest: 'uploads/'});


export const adminAvaterUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/eduBridge-api/admin/*'
    }),
    preservePath: true
});

export const StudentAvatarUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/eduBridge-api/student/*'
    }),
    preservePath: true
});

export const StudentAssignmentSubmission = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/eduBridge-api/student/assignment*'
    }),
    preservePath: true
});