import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import verbRoutes from './verbRoutes';
import adminAuthRoutes from './adminAuthRoutes';
import adminVerbRoutes from './adminVerbRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'BeKids Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mobile Endpoints
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/verbs', verbRoutes);

// Admin Endpoints
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/verbs', adminVerbRoutes);

export default router;
