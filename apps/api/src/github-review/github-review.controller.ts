import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { GithubReviewService } from './github-review.service';

@Controller('github-webhook')
export class GithubReviewController {
  constructor(private readonly githubService: GithubReviewService) {}

  @Post()
  async handleWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Body() payload: any,
  ): Promise<{ status: string }> {
    const secret = process.env.GH_WEBHOOK_SECRET || '';
    if (!this.validateSignature(signature, JSON.stringify(payload), secret)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    if (['opened', 'synchronized', 'reopened'].includes(payload.action)) {
      await this.githubService.processPrEvent(payload);
    }

    return { status: 'ok' };
  }

  private validateSignature(signature: string, payload: string, secret: string): boolean {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expected = Buffer.from(`sha256=${hmac.digest('hex')}`);
    const received = Buffer.from(signature || '');
    if (expected.length !== received.length) return false;
    return timingSafeEqual(expected, received);
  }
}
