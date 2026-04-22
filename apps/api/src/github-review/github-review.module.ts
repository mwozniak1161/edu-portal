import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubReviewController } from './github-review.controller';
import { GithubReviewService } from './github-review.service';

@Module({
  imports: [HttpModule],
  controllers: [GithubReviewController],
  providers: [GithubReviewService],
})
export class GithubReviewModule {}
