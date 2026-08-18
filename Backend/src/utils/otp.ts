import crypto from 'crypto';

export function generateOtpCode(): string {
  // Generate cryptographically random 6-digit numeric string
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}
