import express from 'express';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
import { validate, validateParams } from '../middlewares/validation.middleware';
// import { rateTraining } from '../controllers/enrollment.controller';
import { trainingRatingSchema, userIdSchema } from '../validations/employee.validation';

const router = express.Router();

/**
 * @swagger
 * /enrollment/{id}/rate:
 *   post:
 *     summary: Rate a training (employee only) - DISABLED
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating from 0 to 5
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *     deprecated: true
 *     description: This endpoint is disabled because the rating field doesn't exist in the TrainingEnrollment model
 */
/*
router.post(
    '/:id/rate',
    verifyToken,
    restrictToRoles('EMPLOYEE'),
    validateParams(userIdSchema),
    validate(trainingRatingSchema),
    rateTraining 
);
*/

export default router;
