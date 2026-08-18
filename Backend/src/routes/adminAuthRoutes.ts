import { Router } from 'express';
import { adminAuthController } from '../controllers/adminAuthController';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware';

const router = Router();

router.post('/login', (req, res, next) => {
  adminAuthController.login(req, res).catch(next);
});

router.get('/me', adminAuthMiddleware, (req, res, next) => {
  adminAuthController.me(req, res).catch(next);
});

router.post('/logout', (req, res, next) => {
  adminAuthController.logout(req, res).catch(next);
});

export default router;
