import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeacherClassesModule } from './teacher-classes/teacher-classes.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GradesModule } from './grades/grades.module';
import { LessonInstancesModule } from './lesson-instances/lesson-instances.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ClassesModule, SubjectsModule, TeacherClassesModule, TimeslotsModule, AttendanceModule, GradesModule, LessonInstancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
