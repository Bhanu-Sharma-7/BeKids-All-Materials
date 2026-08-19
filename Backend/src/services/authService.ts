import { userRepository } from '../repositories/userRepository';
import { otpService } from './otpService';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { SafeUser } from '../types';
import { config } from '../config/env';

export class AuthService {
  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }): Promise<{
    target: string;
    flow: 'register';
    message: string;
    devOtp?: string;
  }> {
    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername) {
      const error = new Error('Username is already taken');
      (error as any).statusCode = 400;
      throw error;
    }

    const existingEmail = await userRepository.findByEmail(data.email.toLowerCase());
    if (existingEmail) {
      const error = new Error('Email address is already registered');
      (error as any).statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(data.password);
    await userRepository.create({
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash,
      fullName: data.fullName || data.username,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    });

    const { code } = await otpService.generateOtp(
      data.email.toLowerCase(),
      'register',
      data.email.toLowerCase()
    );

    return {
      target: data.email.toLowerCase(),
      flow: 'register',
      message: 'Registration initiated. Please verify your OTP to complete login.',
      ...(config.isDev ? { devOtp: code } : {}),
    };
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<{
    target: string;
    flow: 'login';
    message: string;
    devOtp?: string;
  }> {
    const user = await userRepository.findByUsernameOrEmail(data.username);
    if (!user) {
      const error = new Error('Invalid username or password');
      (error as any).statusCode = 401;
      throw error;
    }

    if (user.status === 'DEACTIVATED') {
      const error = new Error('This account has been deactivated');
      (error as any).statusCode = 403;
      throw error;
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid username or password');
      (error as any).statusCode = 401;
      throw error;
    }

    const { code } = await otpService.generateOtp(user.username, 'login', user.email);

    return {
      target: user.username,
      flow: 'login',
      message: 'Login credentials verified. Please enter the OTP to continue.',
      ...(config.isDev ? { devOtp: code } : {}),
    };
  }

  async verifyOtp(data: {
    target: string;
    code: string;
    flow: 'login' | 'register';
  }): Promise<{
    token: string;
    user: SafeUser;
    message: string;
  }> {
    const verification = await otpService.verifyOtp(data.target, data.code, data.flow);
    if (!verification.valid) {
      const error = new Error(verification.message || 'Invalid OTP code');
      (error as any).statusCode = 400;
      throw error;
    }

    const user = await userRepository.findByUsernameOrEmail(data.target);
    if (!user) {
      const error = new Error('User account not found');
      (error as any).statusCode = 404;
      throw error;
    }

    if (user.status === 'DEACTIVATED') {
      const error = new Error('This account has been deactivated');
      (error as any).statusCode = 403;
      throw error;
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || user.username,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
    };

    return {
      token,
      user: safeUser,
      message: 'Authentication successful',
    };
  }

  async resendOtp(target: string): Promise<{
    target: string;
    message: string;
    devOtp?: string;
  }> {
    const user = await userRepository.findByUsernameOrEmail(target);
    const flow: 'login' | 'register' = target.includes('@') && !user ? 'register' : 'login';
    const recipientEmail = user?.email || (target.includes('@') ? target : undefined);

    const { code } = await otpService.generateOtp(target, flow, recipientEmail);

    return {
      target,
      message: 'A new verification code has been generated.',
      ...(config.isDev ? { devOtp: code } : {}),
    };
  }
}

export const authService = new AuthService();
