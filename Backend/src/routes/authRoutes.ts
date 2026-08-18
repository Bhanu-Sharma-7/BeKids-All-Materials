import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from '../validators/schemas';

const router = Router();

// Public auth routes
router.post('/register', validateBody(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validateBody(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/verify-otp', validateBody(verifyOtpSchema), (req, res, next) =>
  authController.verifyOtp(req, res, next)
);

router.post('/resend-otp', validateBody(resendOtpSchema), (req, res, next) =>
  authController.resendOtp(req, res, next)
);

router.post('/logout', (req, res, next) =>
  authController.logout(req, res, next)
);

// Protected auth route
router.get('/me', requireAuth, (req, res, next) =>
  authController.getMe(req, res, next)
);

export default router;
