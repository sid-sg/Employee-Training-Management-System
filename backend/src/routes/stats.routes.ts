import express from 'express';
import { getStatistics } from '../controllers/stats.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';

const router = express.Router();

router.get(
    '/stats',
    verifyToken,                    
    restrictToRoles('ADMIN'), 
    getStatistics
);

export default router;
