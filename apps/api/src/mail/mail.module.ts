import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env['MAIL_HOST'] ?? 'smtp.gmail.com',
        port: Number(process.env['MAIL_PORT'] ?? 587),
        auth: {
          user: process.env['MAIL_USER'] ?? '',
          pass: process.env['MAIL_PASS'] ?? '',
        },
      },
      defaults: {
        from: process.env['MAIL_FROM'] ?? '',
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
