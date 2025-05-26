import express from 'express';
import multer from 'multer';
import { uploadEmployees, uploadHRAdmins } from '../controllers/admin.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

/**
 * @swagger
 * /admin/upload-employees:
 *   post:
 *     summary: Upload Employees from .csv file
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users who are created
 */
router.post(
    '/upload-employees',
    verifyToken,
    restrictToRoles( 'ADMIN'),
    upload.single('file'),
    uploadEmployees
);


/**
 * @swagger
 * /admin/upload-hr-admins:
 *   post:
 *     summary: Upload HR Admins from .csv file
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users who are created
 */
router.post(
    '/upload-hr-admins',
    verifyToken,
    restrictToRoles('ADMIN'),
    upload.single('file'),
    uploadHRAdmins
);


export default router;
