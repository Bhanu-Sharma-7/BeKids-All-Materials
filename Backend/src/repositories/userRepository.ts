import { User } from '@prisma/client';
import { prisma } from '../config/db';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier } },
          { email: { equals: identifier } },
        ],
      },
    });
  }

  async create(data: {
    username: string;
    email: string;
    passwordHash: string;
    fullName?: string;
    avatarUrl?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName || data.username,
        avatarUrl: data.avatarUrl || null,
        status: 'ACTIVE',
      },
    });
  }

  async update(
    id: string,
    data: {
      username?: string;
      email?: string;
      passwordHash?: string;
      fullName?: string;
      avatarUrl?: string | null;
      status?: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async setStatus(id: string, status: 'ACTIVE' | 'DEACTIVATED'): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { status },
    });
  }
}

export const userRepository = new UserRepository();
