import { OtpVerification } from '@prisma/client';
import { prisma } from '../config/db';

export class OtpRepository {
  async create(data: {
    target: string;
    code: string;
    flow: string;
    expiresAt: Date;
  }): Promise<OtpVerification> {
    // Invalidate previous unexpired OTPs for the same target and flow
    await prisma.otpVerification.updateMany({
      where: {
        target: data.target,
        flow: data.flow,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    return prisma.otpVerification.create({
      data: {
        target: data.target,
        code: data.code,
        flow: data.flow,
        expiresAt: data.expiresAt,
        attempts: 0,
        isUsed: false,
      },
    });
  }

  async findLatestValid(target: string, flow: string): Promise<OtpVerification | null> {
    return prisma.otpVerification.findFirst({
      where: {
        target,
        flow,
        isUsed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async incrementAttempts(id: string): Promise<OtpVerification> {
    return prisma.otpVerification.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    });
  }

  async markAsUsed(id: string): Promise<OtpVerification> {
    return prisma.otpVerification.update({
      where: { id },
      data: {
        isUsed: true,
      },
    });
  }
}

export const otpRepository = new OtpRepository();
