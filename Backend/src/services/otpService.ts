import { otpRepository } from '../repositories/otpRepository';
import { generateOtpCode } from '../utils/otp';
import { emailService } from './emailService';
import { config } from '../config/env';

export class OtpService {
  async generateOtp(
    target: string,
    flow: 'login' | 'register',
    recipientEmail?: string
  ): Promise<{ code: string; expiresAt: Date }> {
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    await otpRepository.create({
      target,
      code,
      flow,
      expiresAt,
    });

    const emailDestination = recipientEmail || (target.includes('@') ? target : undefined);
    if (emailDestination) {
      await emailService.sendOtpEmail(emailDestination, code, flow);
    } else {
      console.warn(`[OtpService] Could not resolve email address for target: ${target}`);
    }

    if (config.isDev) {
      console.log(`[DEV ONLY] OTP generated for ${target} (${flow})`);
    }

    return { code, expiresAt };
  }

  async verifyOtp(target: string, code: string, flow: 'login' | 'register'): Promise<{ valid: boolean; message?: string }> {
    const record = await otpRepository.findLatestValid(target, flow);

    if (!record) {
      return { valid: false, message: 'No active OTP verification found. Please request a new code.' };
    }

    if (record.isUsed) {
      return { valid: false, message: 'This OTP has already been used. Please request a new code.' };
    }

    if (new Date() > record.expiresAt) {
      return { valid: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (record.attempts >= config.otpMaxAttempts) {
      return { valid: false, message: 'Too many failed verification attempts. Please request a new OTP.' };
    }

    if (record.code !== code) {
      await otpRepository.incrementAttempts(record.id);
      const remainingAttempts = config.otpMaxAttempts - (record.attempts + 1);
      return {
        valid: false,
        message: `Invalid OTP code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Please request a new code.'}`,
      };
    }

    // Success: Mark as used
    await otpRepository.markAsUsed(record.id);
    return { valid: true };
  }
}

export const otpService = new OtpService();
