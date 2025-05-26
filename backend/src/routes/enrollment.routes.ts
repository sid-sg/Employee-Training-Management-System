import express from 'express';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
import { rateTraining } from '../controllers/enrollment.controller';

const router = express.Router();

router.post(
    '/:id/rate',
    verifyToken,
    restrictToRoles('EMPLOYEE'),
   rateTraining 
);

export default router;
