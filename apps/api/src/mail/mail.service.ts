import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly welcomeTemplate: string;

  constructor(private readonly mailer: MailerService) {
    this.welcomeTemplate = readFileSync(
      join(__dirname, 'templates', 'welcome.html'),
      'utf8',
    );
  }

  async sendWelcomeEmail(to: string, firstName: string, password: string): Promise<void> {
    try {
      const html = this.welcomeTemplate
        .replace(/\{\{firstName\}\}/g, firstName)
        .replace(/\{\{email\}\}/g, to)
        .replace(/\{\{password\}\}/g, password);

      await this.mailer.sendMail({
        to,
        subject: 'Welcome to EduPortal',
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send welcome email to ${to}: ${(err as Error).message}`);
    }
  }
}
