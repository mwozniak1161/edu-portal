import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

const mockMailerService = {
  sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService, { provide: MailerService, useValue: mockMailerService }],
    }).compile();

    service = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('sends email to correct recipient with welcome subject', async () => {
      await service.sendWelcomeEmail('jane@example.com', 'Jane', 'P@ssword1');

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jane@example.com',
          subject: expect.stringContaining('Welcome'),
        }),
      );
    });

    it('includes firstName, email, and password in html body', async () => {
      await service.sendWelcomeEmail('jane@example.com', 'Jane', 'P@ssword1');

      const call = mockMailerService.sendMail.mock.calls[0][0] as { html: string };
      expect(call.html).toContain('Jane');
      expect(call.html).toContain('jane@example.com');
      expect(call.html).toContain('P@ssword1');
    });

    it('does not throw when mailer fails', async () => {
      mockMailerService.sendMail.mockRejectedValueOnce(new Error('SMTP down'));

      await expect(
        service.sendWelcomeEmail('jane@example.com', 'Jane', 'P@ssword1'),
      ).resolves.not.toThrow();
    });
  });
});
