import { userRepository } from '../repositories/userRepository';
import { hashPassword } from '../utils/password';
import { SafeUser } from '../types';

export class UserService {
  async getProfile(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || user.username,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(
    userId: string,
    data: {
      username?: string;
      email?: string;
      fullName?: string;
      password?: string;
      avatarUrl?: string;
    }
  ): Promise<SafeUser> {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if new username is taken by someone else
    if (data.username && data.username !== currentUser.username) {
      const existingUser = await userRepository.findByUsername(data.username);
      if (existingUser && existingUser.id !== userId) {
        const error = new Error('Username is already taken');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    // Check if new email is taken by someone else
    if (data.email && data.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      const existingUser = await userRepository.findByEmail(data.email.toLowerCase());
      if (existingUser && existingUser.id !== userId) {
        const error = new Error('Email address is already in use');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    const updateData: {
      username?: string;
      email?: string;
      fullName?: string;
      passwordHash?: string;
      avatarUrl?: string | null;
    } = {};

    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl || null;

    if (data.password && data.password.trim().length > 0) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updated = await userRepository.update(userId, updateData);

    return {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      fullName: updated.fullName || updated.username,
      avatarUrl: updated.avatarUrl,
      status: updated.status,
      createdAt: updated.createdAt,
    };
  }

  async deactivateAccount(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    await userRepository.setStatus(userId, 'DEACTIVATED');

    return {
      success: true,
      message: 'Account successfully deactivated. You have been logged out.',
    };
  }
}

export const userService = new UserService();
