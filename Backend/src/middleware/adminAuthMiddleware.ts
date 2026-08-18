import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';

export function adminAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized: Admin authentication token required');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload || payload.role !== 'ADMIN') {
    throw new AppError(403, 'Forbidden: Admin access required');
  }

  req.admin = {
    id: payload.userId,
    email: payload.email,
    name: payload.username,
    role: 'ADMIN',
  };

  next();
}
