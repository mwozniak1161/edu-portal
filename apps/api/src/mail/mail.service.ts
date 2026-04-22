import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly welcomeTemplate: string;
  private readonly resetTemplate: string;

  constructor(private readonly mailer: MailerService) {
    this.welcomeTemplate = readFileSync(join(__dirname, 'templates', 'welcome.html'), 'utf8');
    this.resetTemplate = readFileSync(join(__dirname, 'templates', 'reset-password.html'), 'utf8');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.mailer.sendMail({
        to: process.env['MAIL_USER'] ?? '',
        subject: 'EduPortal — SMTP test',
        text: 'SMTP connection is working.',
      });
      return true;
    } catch (err) {
      this.logger.error(`SMTP test failed: ${(err as Error).message}`);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string, password: string): Promise<void> {
    try {
      const html = this.welcomeTemplate
        .replace(/\{\{firstName\}\}/g, firstName)
        .replace(/\{\{email\}\}/g, to)
        .replace(/\{\{password\}\}/g, password);

      await this.mailer.sendMail({ to, subject: 'Welcome to EduPortal', html });
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send welcome email to ${to}: ${(err as Error).message}` +
          ` | host=${process.env['MAIL_HOST']} port=${process.env['MAIL_PORT']} user=${process.env['MAIL_USER']}`,
      );
    }
  }

  async sendGradeNotificationEmail(
    to: string,
    firstName: string,
    value: string,
    weight: number,
    comment?: string,
  ): Promise<void> {
    try {
      const commentRow = comment ? `<li><strong>Comment:</strong> ${comment}</li>` : '';
      const html = `
        <h2>New Grade Added</h2>
        <p>Hello ${firstName},</p>
        <p>A new grade has been added for you in EduPortal:</p>
        <ul>
          <li><strong>Value:</strong> ${value}</li>
          <li><strong>Weight:</strong> ${weight}</li>
          ${commentRow}
        </ul>
        <p>You can view your updated grade average in your Gradebook.</p>
      `;
      await this.mailer.sendMail({ to, subject: 'New Grade Added — EduPortal', html });
    } catch (err) {
      this.logger.error(`Failed to send grade notification to ${to}: ${(err as Error).message}`);
    }
  }

  async sendPasswordResetEmail(to: string, firstName: string, resetUrl: string): Promise<void> {
    try {
      const html = this.resetTemplate
        .replace(/\{\{firstName\}\}/g, firstName)
        .replace(/\{\{resetUrl\}\}/g, resetUrl);

      await this.mailer.sendMail({ to, subject: 'EduPortal — Reset your password', html });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send reset email to ${to}: ${(err as Error).message}`);
    }
  }
}
