import express from 'express';
import { createTraining, deleteTraining, getAllTrainings, getTraining, getEnrolledTrainings, updateTraining, enrollUsersInTraining } from '../controllers/training.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
    '/',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    createTraining
);

router.patch(
    '/:id',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    updateTraining
);

router.delete(
    '/:id',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    deleteTraining
);

router.get(
    '/:id',
    verifyToken,
    getTraining
);

router.get(
    '/enrolled',
    verifyToken,
    restrictToRoles('EMPLOYEE'),
    getEnrolledTrainings
);


router.get(
    '/',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    getAllTrainings
);

router.post(
    '/:trainingId/enroll',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    enrollUsersInTraining
);

router.post(
    '/:trainingId/deenroll',
    verifyToken,
    restrictToRoles('HR_ADMIN'),
    enrollUsersInTraining
);

export default router;
