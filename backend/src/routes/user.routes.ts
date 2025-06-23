import { Router } from 'express';
import { updatePhoneNumber, updatePassword, getUsers, getUser, getCurrentUser, getEnrolledTrainingsOfUser } from '../controllers/user.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
const router = Router();


router.get("/me",
    verifyToken,
    getCurrentUser
);

router.get(
    '/users',
    verifyToken,
    restrictToRoles('HR_ADMIN', 'ADMIN'),
    getUsers
);

router.get(
    '/enrolled-trainings',
    verifyToken,
    getEnrolledTrainingsOfUser
);

router.get(
    '/:id',
    verifyToken,
    getUser
)

router.patch(
    '/update-phone',
    verifyToken,
    restrictToRoles('EMPLOYEE', 'HR_ADMIN'),
    updatePhoneNumber
);

router.patch(
    '/update-password',
    verifyToken,
    restrictToRoles('EMPLOYEE', 'HR_ADMIN'),
    updatePassword
);

// router.get(
//     '/:id/enrolled-trainings',
//     verifyToken,
//     getEnrolledTrainingsOfUser
// );




export default router;
