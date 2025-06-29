import { Router } from 'express';
import { updatePhoneNumber, updatePassword, getUsers, getUser, getCurrentUser, getEnrolledTrainingsOfUser, searchEmployees, updateUser, deleteUser } from '../controllers/user.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
import { validate, validateQuery, validateParams } from '../middlewares/validation.middleware';
import { userSearchSchema, passwordUpdateSchema } from '../validations/user.validation';
import { phoneNumberUpdateSchema, userIdSchema } from '../validations/employee.validation';

const router = Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get("/me",
    verifyToken,
    getCurrentUser
);

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [EMPLOYEE, HR_ADMIN]
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
    '/users',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    getUsers
);

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Search employees and HR admins (admin users are excluded)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query (legacy parameter)
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query (new parameter)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [EMPLOYEE, HR_ADMIN]
 *         description: Filter by role (ADMIN users are excluded from search results)
 *     responses:
 *       200:
 *         description: Search results (only employees and HR admins)
 *       400:
 *         description: Validation error
 */
router.get(
    '/search',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    validateQuery(userSearchSchema),
    searchEmployees
);

/**
 * @swagger
 * /user/enrolled-trainings:
 *   get:
 *     summary: Get enrolled trainings for current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled trainings
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/enrolled-trainings',
    verifyToken,
    getEnrolledTrainingsOfUser
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.get(
    '/:id',
    verifyToken,
    validateParams(userIdSchema),
    getUser
)

/**
 * @swagger
 * /user/update-phone:
 *   patch:
 *     summary: Update phone number
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phonenumber
 *             properties:
 *               phonenumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 pattern: ^[0-9+\-\s()]+$
 *     responses:
 *       200:
 *         description: Phone number updated successfully
 *       400:
 *         description: Validation error
 */
router.patch(
    '/update-phone',
    verifyToken,
    restrictToRoles('EMPLOYEE', 'HR_ADMIN'),
    validate(phoneNumberUpdateSchema),
    updatePhoneNumber
);

/**
 * @swagger
 * /user/update-password:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error or invalid current password
 */
router.patch(
    '/update-password',
    verifyToken,
    restrictToRoles('EMPLOYEE', 'HR_ADMIN'),
    validate(passwordUpdateSchema),
    updatePassword
);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               employeeid:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               department:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               phonenumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.patch(
    '/:id',
    verifyToken,
    restrictToRoles('ADMIN'),
    validateParams(userIdSchema),
    updateUser
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.delete(
    '/:id',
    verifyToken,
    restrictToRoles('ADMIN'),
    validateParams(userIdSchema),
    deleteUser
);

export default router;
