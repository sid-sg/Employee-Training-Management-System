import express from 'express';
import multer from 'multer';
import { uploadEmployees, uploadHRAdmins } from '../controllers/admin.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';


const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post(
    '/upload-employees',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    upload.single('file'),
    uploadEmployees
);

router.post(
    '/upload-hr-admins',
    verifyToken,
    restrictToRoles('ADMIN'),
    upload.single('file'),
    uploadHRAdmins
);


export default router;
