import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubReviewService {
  private readonly logger = new Logger(GithubReviewService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async processPrEvent(payload: any) {
    try {
      const prNumber = payload.pull_request.number;
      const repoOwner = payload.repository.owner.login;
      const repoName = payload.repository.name;

      const diff = await this.fetchPrDiff(repoOwner, repoName, prNumber);
      if (!diff || diff.length < 50) return;

      const review = await this.getClaudeReview(diff, payload);
      if (review && review.length > 20) {
        await this.postPrComment(repoOwner, repoName, prNumber, review);
      }
    } catch (error) {
      this.logger.error('Error processing PR event', error);
    }
  }

  private async fetchPrDiff(owner: string, repo: string, prNumber: number): Promise<string> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}.diff`;
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3.diff' };
    const token = this.configService.get<string>('GH_TOKEN');
    if (token) headers.Authorization = `token ${token}`;
    const response = await this.httpService.axiosRef.get(url, { headers });
    return response.data;
  }

  private async getClaudeReview(diff: string, payload: any): Promise<string> {
    if (diff.length > 10000)
      return 'PR diff is too large for automated review. Please review manually.';

    const prompt = `Please review this GitHub PR diff and provide constructive feedback:

PR Title: ${payload.pull_request.title}
PR Description: ${payload.pull_request.body || 'No description'}

Diff:
${diff.substring(0, 8000)}

Focus on: obvious bugs, security issues, and major style problems. Be concise and helpful.`;

    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'x-api-key': this.configService.get<string>('CLAUDE_API_KEY') || '',
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        },
      );
      return response.data.content[0].text;
    } catch (error) {
      this.logger.error('Claude API error', error);
      return 'Unable to generate review due to service error.';
    }
  }

  private async postPrComment(owner: string, repo: string, prNumber: number, comment: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
    await this.httpService.axiosRef.post(
      url,
      {
        body: `## 🤖 Claude Code Review\n\n${comment}\n\n*This is an automated review. Feedback is advisory only.*`,
      },
      {
        headers: { Authorization: `token ${this.configService.get<string>('GH_TOKEN') || ''}` },
      },
    );
  }
}
