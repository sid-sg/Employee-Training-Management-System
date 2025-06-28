import express from 'express';
import multer from 'multer';
import { uploadEmployees, uploadHRAdmins } from '../controllers/admin.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
import { uploadCSV } from '../middlewares/upload.middleware';

const router = express.Router();

/**
 * @swagger
 * /admin/upload-employees:
 *   post:
 *     summary: Upload Employees from .csv file or create single employee
 *     tags: [Admin]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file for bulk upload
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               employeeid:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of users who are created
 *       201:
 *         description: Single user created successfully
 */
router.post(
    '/upload-employees',
    verifyToken,
    restrictToRoles('ADMIN'),
    uploadCSV.single('file'),
    uploadEmployees
);

/**
 * @swagger
 * /admin/upload-hr-admins:
 *   post:
 *     summary: Upload HR Admins from .csv file or create single HR admin
 *     tags: [Admin]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file for bulk upload
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               employeeid:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of users who are created
 *       201:
 *         description: Single user created successfully
 */
router.post(
    '/upload-hr-admins',
    verifyToken,
    restrictToRoles('ADMIN'),
    uploadCSV.single('file'),
    uploadHRAdmins
);

export default router;
