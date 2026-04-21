import { Module } from '@nestjs/common';
import { TeacherClassesService } from './teacher-classes.service';
import { TeacherClassesController } from './teacher-classes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [TeacherClassesService],
  controllers: [TeacherClassesController],
  exports: [TeacherClassesService],
})
export class TeacherClassesModule {}
