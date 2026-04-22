import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GithubReviewController } from './github-review.controller';
import { GithubReviewService } from './github-review.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [GithubReviewController],
  providers: [GithubReviewService],
})
export class GithubReviewModule {}
