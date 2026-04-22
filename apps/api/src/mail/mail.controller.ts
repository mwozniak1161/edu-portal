import { Controller, Get, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail() {
    const success = await this.mailService.testConnection();
    return {
      success,
      message: success ? 'Mail test successful' : 'Mail test failed - check logs',
    };
  }

  @Post('welcome')
  async sendWelcomeEmail(@Body() body: { to: string; firstName: string; password: string }) {
    await this.mailService.sendWelcomeEmail(body.to, body.firstName, body.password);
    return { message: 'Welcome email queued for sending' };
  }
}
