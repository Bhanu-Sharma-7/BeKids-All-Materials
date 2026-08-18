import { Router } from 'express';
import { verbController } from '../controllers/verbController';

const router = Router();

// Public verb catalog routes
router.get('/', (req, res, next) => verbController.getAll(req, res, next));
router.get('/:id', (req, res, next) => verbController.getById(req, res, next));

export default router;
