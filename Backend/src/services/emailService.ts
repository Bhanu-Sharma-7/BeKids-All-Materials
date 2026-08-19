import { Resend } from 'resend';
import { config } from '../config/env';

export class EmailService {
  private resend: Resend | null = null;

  private getClient(): Resend | null {
    if (!this.resend && config.resendApiKey) {
      this.resend = new Resend(config.resendApiKey);
    }
    return this.resend;
  }

  async sendOtpEmail(
    targetEmail: string,
    otpCode: string,
    flow: 'login' | 'register'
  ): Promise<void> {
    const client = this.getClient();

    if (!client) {
      if (config.isDev) {
        console.warn('[EmailService] RESEND_API_KEY not configured. Skipping email dispatch in development.');
        return;
      }
      throw new Error('Email delivery service is not configured on the server.');
    }

    const expiryMinutes = config.otpExpiryMinutes;
    const subject = 'Your BeKids verification code';
    const actionText = flow === 'register' ? 'complete your registration' : 'log in to your account';

    const textContent = `Your BeKids verification code is: ${otpCode}\n\nUse this code to ${actionText}. This code expires in ${expiryMinutes} minutes.\n\nIf you did not request this code, you can safely ignore this email.\nDo not share this code with anyone.`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; background-color: #2563EB; color: #ffffff; border-radius: 14px; font-size: 28px; font-weight: 800;">
              B
            </div>
            <h2 style="color: #1e293b; margin: 12px 0 4px 0; font-size: 22px; font-weight: 700;">BeKids</h2>
            <p style="color: #64748b; margin: 0; font-size: 14px;">English Learning Application</p>
          </div>

          <div style="text-align: center; padding: 20px 0;">
            <p style="color: #334155; font-size: 16px; margin: 0 0 16px 0;">
              Use the following verification code to <strong>${actionText}</strong>:
            </p>

            <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 14px 32px; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #2563EB; font-family: monospace;">
              ${otpCode}
            </div>

            <p style="color: #64748b; font-size: 13px; margin: 16px 0 0 0;">
              ⏱️ This code expires in <strong>${expiryMinutes} minutes</strong>.
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 20px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; line-height: 1.5;">
              ⚠️ <strong>Security Notice:</strong> Do not share this code with anyone. BeKids support will never ask for your verification code.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
              If you did not request this verification, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const response = await client.emails.send({
        from: config.emailFrom,
        to: targetEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      if (response.error) {
        console.error('[EmailService] Resend API rejected message:', response.error.message);
        throw new Error(`Failed to send verification email: ${response.error.message}`);
      }
    } catch (err: any) {
      console.error('[EmailService] Email dispatch failed:', err?.message || 'Unknown network error');
      throw new Error(err?.message || 'Failed to deliver verification email. Please try again.');
    }
  }
}

export const emailService = new EmailService();
