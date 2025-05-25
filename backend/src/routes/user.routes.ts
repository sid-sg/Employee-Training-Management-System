import { Router } from 'express';
import { updatePhoneNumber, updatePassword } from '../controllers/user.controller';
import { verifyToken, restrictToRoles } from '../middlewares/auth.middleware';
const router = Router();

router.use(verifyToken, restrictToRoles('EMPLOYEE'));


router.put('/update-phone', updatePhoneNumber);
router.put('/update-password', updatePassword);

export default router;
