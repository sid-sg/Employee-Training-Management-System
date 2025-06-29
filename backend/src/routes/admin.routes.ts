import express from 'express';
import multer from 'multer';
import { uploadEmployees, uploadHRAdmins } from '../controllers/admin.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
import { uploadCSV } from '../middlewares/upload.middleware';
import { validateAdminBulkUpload } from '../middlewares/validation.middleware';
import { adminUserCreationSchema } from '../validations/admin.validation';

const router = express.Router();

/**
 * @swagger
 * /admin/upload-employees:
 *   post:
 *     summary: Upload Employees from .csv file or create single employee
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file for bulk upload (max 5MB)
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - employeeid
 *               - email
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 pattern: ^[a-zA-Z\s]+$
 *                 description: Employee full name (letters and spaces only)
 *               employeeid:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 pattern: ^[A-Z0-9]+$
 *                 description: Unique employee ID (uppercase letters and numbers only)
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: Employee email address
 *               department:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Employee department
 *               phonenumber:
 *                 type: string
 *                 pattern: ^[0-9+\-\s()]+$
 *                 minLength: 10
 *                 description: Phone number (optional, at least 10 digits)
 *     responses:
 *       200:
 *         description: Bulk users created successfully from CSV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 createdUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       password:
 *                         type: string
 *       201:
 *         description: Single employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     employeeid:
 *                       type: string
 *                     email:
 *                       type: string
 *                     department:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post(
    '/upload-employees',
    verifyToken,
    restrictToRoles('ADMIN'),
    uploadCSV.single('file'),
    validateAdminBulkUpload(adminUserCreationSchema),
    uploadEmployees
);

/**
 * @swagger
 * /admin/upload-hr-admins:
 *   post:
 *     summary: Upload HR Admins from .csv file or create single HR admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file for bulk upload (max 5MB)
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - employeeid
 *               - email
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 pattern: ^[a-zA-Z\s]+$
 *                 description: HR Admin full name (letters and spaces only)
 *               employeeid:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 pattern: ^[A-Z0-9]+$
 *                 description: Unique employee ID (uppercase letters and numbers only)
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: HR Admin email address
 *               department:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: HR Admin department
 *               phonenumber:
 *                 type: string
 *                 pattern: ^[0-9+\-\s()]+$
 *                 minLength: 10
 *                 description: Phone number (optional, at least 10 digits)
 *     responses:
 *       200:
 *         description: Bulk HR admins created successfully from CSV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 createdUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       password:
 *                         type: string
 *       201:
 *         description: Single HR admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     employeeid:
 *                       type: string
 *                     email:
 *                       type: string
 *                     department:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Internal server error
 */
router.post(
    '/upload-hr-admins',
    verifyToken,
    restrictToRoles('ADMIN'),
    uploadCSV.single('file'),
    validateAdminBulkUpload(adminUserCreationSchema),
    uploadHRAdmins
);

export default router;
