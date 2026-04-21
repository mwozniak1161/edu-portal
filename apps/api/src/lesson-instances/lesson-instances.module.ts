import { Module } from '@nestjs/common';
import { LessonInstancesService } from './lesson-instances.service';
import { LessonInstancesController } from './lesson-instances.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LessonInstancesController],
  providers: [LessonInstancesService],
})
export class LessonInstancesModule {}
