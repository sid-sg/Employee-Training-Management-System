import { Router } from 'express';
import { updatePhoneNumber, updatePassword, getUsers, getEmployees } from '../controllers/user.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
const router = Router();

router.use(verifyToken, restrictToRoles('EMPLOYEE'));


router.put(
    '/update-phone',
    verifyToken,
    restrictToRoles('EMPLOYEE', 'HR_ADMIN'),
    updatePhoneNumber
);

router.put(
    '/update-password',
    verifyToken,
    restrictToRoles('EMPLOYEE', 'HR_ADMIN'),
    updatePassword
);

router.get(
    '/:department/:role',
    verifyToken,
    restrictToRoles('ADMIN'),
    getUsers
);


router.get(
    '/employees/:department',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    getEmployees
);

export default router;
