import { Request, Response } from 'express';
import { config } from '../config/env';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';

export class AdminAuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetEmail = config.adminEmail.trim().toLowerCase();

    if (cleanEmail !== targetEmail || password !== config.adminPassword) {
      throw new AppError(401, 'Invalid admin email or password');
    }

    const token = generateToken({
      userId: 'admin_root',
      username: 'Bhanu Sharma',
      email: config.adminEmail,
      role: 'ADMIN',
    });

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        id: 'admin_root',
        email: config.adminEmail,
        name: 'Bhanu Sharma',
        role: 'ADMIN',
      },
    });
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      admin: req.admin,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

export const adminAuthController = new AdminAuthController();
