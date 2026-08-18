import { Router } from 'express';
import { userController } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import { updateProfileSchema } from '../validators/schemas';

const router = Router();

// Protected user routes
router.patch('/me', requireAuth, validateBody(updateProfileSchema), (req, res, next) =>
  userController.updateProfile(req, res, next)
);

router.post('/me/deactivate', requireAuth, (req, res, next) =>
  userController.deactivate(req, res, next)
);

export default router;
