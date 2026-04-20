import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LessonInstancesService } from '../lesson-instances/lesson-instances.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly lessonInstancesService: LessonInstancesService) {}

  /**
   * Cron job that runs daily at 2:00 AM to generate lesson instances
   * for all teacher-classes based on their timeslots
   */
  @Cron('0 2 * * *')
  async handleDailyLessonInstanceGeneration() {
    this.logger.log('Starting daily lesson instance generation');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today

      const result = await this.lessonInstancesService.generateLessonInstancesForAllTeacherClasses(today);

      this.logger.log(
        `Daily lesson instance generation completed. Generated: ${result.generated}, Skipped: ${result.skipped}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error in daily lesson instance generation: ${message}`, stack);
    }
  }
}