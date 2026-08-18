import { Router } from 'express';
import { adminVerbController } from '../controllers/adminVerbController';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware';
import { validate } from '../middleware/validate';
import { createVerbSchema, updateVerbSchema } from '../validators/schemas';

const router = Router();

// Protect all admin verb routes with adminAuthMiddleware
router.use(adminAuthMiddleware);

router.get('/', (req, res, next) => {
  adminVerbController.getAll(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  adminVerbController.getById(req, res).catch(next);
});

router.post('/', validate(createVerbSchema), (req, res, next) => {
  adminVerbController.create(req, res).catch(next);
});

router.put('/:id', validate(updateVerbSchema), (req, res, next) => {
  adminVerbController.update(req, res).catch(next);
});

router.patch('/:id', validate(updateVerbSchema), (req, res, next) => {
  adminVerbController.update(req, res).catch(next);
});

router.delete('/:id', (req, res, next) => {
  adminVerbController.delete(req, res).catch(next);
});

router.post('/import', (req, res, next) => {
  adminVerbController.importJson(req, res).catch(next);
});

export default router;
