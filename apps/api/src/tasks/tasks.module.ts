import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LessonInstancesService } from '../lesson-instances/lesson-instances.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [LessonInstancesService],
})
export class TasksModule {}
