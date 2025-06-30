import express from 'express';
import { createTraining, deleteTraining, getAllTrainings, getTraining, getEnrolledUsersOfTraining, getAvailableEmployeesForTraining, getTrainingFeedbacks, updateTraining, enrollUsersInTraining, deenrollUsersFromTraining, submitTrainingFeedback } from '../controllers/training.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
import { validate, validateParams } from '../middlewares/validation.middleware';
import { 
  trainingSchema, 
  trainingUpdateSchema, 
  userEnrollmentSchema, 
  trainingIdSchema, 
  trainingIdEnrollmentSchema 
} from '../validations/training.validation';
import { trainingFeedbackSchema, trainingIdFeedbackSchema } from '../validations/employee.validation';

const router = express.Router();

/**
 * @swagger
 * /training:
 *   post:
 *     summary: Create a new training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - mode
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               mode:
 *                 type: string
 *                 enum: [ONLINE, OFFLINE]
 *               location:
 *                 type: string
 *               platform:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Training created successfully
 *       400:
 *         description: Validation error
 */
router.post(
    '/',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validate(trainingSchema),
    createTraining
);

/**
 * @swagger
 * /training/{id}:
 *   patch:
 *     summary: Update a training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               mode:
 *                 type: string
 *                 enum: [ONLINE, OFFLINE]
 *               location:
 *                 type: string
 *               platform:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Training updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Training not found
 */
router.patch(
    '/:id',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdSchema),
    validate(trainingUpdateSchema),
    updateTraining
);

/**
 * @swagger
 * /training/{id}:
 *   delete:
 *     summary: Delete a training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Training deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Training not found
 */
router.delete(
    '/:id',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdSchema),
    deleteTraining
);

/**
 * @swagger
 * /training/{id}:
 *   get:
 *     summary: Get a specific training (ADMIN, HR_ADMIN and EMPLOYEE)
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     responses:
 *       200:
 *         description: Training details
 *       400:
 *         description: Validation error
 *       404:
 *         description: Training not found
 *       403:
 *         description: Forbidden - User not authorized
 */
router.get(
    '/:id',
    verifyToken,
    restrictToRoles('ADMIN', 'HR_ADMIN', 'EMPLOYEE'),
    validateParams(trainingIdSchema),
    getTraining
);

/**
 * @swagger
 * /training/{trainingId}/enrolled-users:
 *   get:
 *     summary: Get enrolled users for a training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of enrolled users
 *       400:
 *         description: Validation error
 */
router.get(
    '/:trainingId/enrolled-users',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdEnrollmentSchema),
    getEnrolledUsersOfTraining
);

/**
 * @swagger
 * /training/{trainingId}/available-employees:
 *   get:
 *     summary: Get available employees for a training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available employees
 *       400:
 *         description: Validation error
 */
router.get(
    '/:trainingId/available-employees',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdEnrollmentSchema),
    getAvailableEmployeesForTraining
);

/**
 * @swagger
 * /training/{trainingId}/feedbacks:
 *   get:
 *     summary: Get training feedbacks
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of training feedbacks
 *       400:
 *         description: Validation error
 */
router.get(
    '/:trainingId/feedbacks',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdEnrollmentSchema),
    getTrainingFeedbacks
);

/**
 * @swagger
 * /training:
 *   get:
 *     summary: Get all trainings
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all trainings
 */
router.get(
    '/',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    getAllTrainings
);

/**
 * @swagger
 * /training/{trainingId}/enroll:
 *   post:
 *     summary: Enroll users in a training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 100
 *     responses:
 *       201:
 *         description: Users enrolled successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Training not found
 */
router.post(
    '/:trainingId/enroll',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdEnrollmentSchema),
    validate(userEnrollmentSchema),
    enrollUsersInTraining
);

/**
 * @swagger
 * /training/{trainingId}/deenroll:
 *   post:
 *     summary: Disenroll users from a training
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 100
 *     responses:
 *       200:
 *         description: Users disenrolled successfully
 *       400:
 *         description: Validation error
 */
router.post(
    '/:trainingId/deenroll',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    validateParams(trainingIdEnrollmentSchema),
    validate(userEnrollmentSchema),
    deenrollUsersFromTraining
);

/**
 * @swagger
 * /training/{id}/feedback:
 *   post:
 *     summary: Submit training feedback (employee only)
 *     tags: [Training]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Training ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userInfo
 *               - trainingFeedback
 *               - trainerFeedback
 *               - comments
 *               - modeOfAttendance
 *             properties:
 *               userInfo:
 *                 type: object
 *                 required:
 *                   - name
 *                   - department
 *                 properties:
 *                   name:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 100
 *                   department:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 100
 *               trainingFeedback:
 *                 type: object
 *                 required:
 *                   - duration
 *                   - pace
 *                   - content
 *                   - relevance
 *                   - usefulness
 *                   - confidence
 *                 properties:
 *                   duration:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   pace:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   content:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   relevance:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   usefulness:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   confidence:
 *                     type: string
 *                     pattern: ^[1-5]$
 *               trainerFeedback:
 *                 type: object
 *                 required:
 *                   - knowledge
 *                   - explanation
 *                   - answers
 *                   - utility
 *                   - information
 *                 properties:
 *                   knowledge:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   explanation:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   answers:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   utility:
 *                     type: string
 *                     pattern: ^[1-5]$
 *                   information:
 *                     type: string
 *                     pattern: ^[1-5]$
 *               comments:
 *                 type: object
 *                 properties:
 *                   trainingLikes:
 *                     type: string
 *                     maxLength: 500
 *                   trainingImprovements:
 *                     type: string
 *                     maxLength: 500
 *                   trainerStrengths:
 *                     type: string
 *                     maxLength: 500
 *                   trainerRecommendations:
 *                     type: string
 *                     maxLength: 500
 *               modeOfAttendance:
 *                 type: string
 *                 enum: [IN_PERSON, VIRTUAL]
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Validation error or feedback already submitted
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/:id/feedback',
    verifyToken,
    restrictToRoles('EMPLOYEE'),
    validateParams(trainingIdFeedbackSchema),
    validate(trainingFeedbackSchema),
    submitTrainingFeedback
);

export default router;
