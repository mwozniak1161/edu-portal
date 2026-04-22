import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceEntryDto } from './dto/attendance-entry.dto';

const lessonInstanceInclude = {
  teacherClass: {
    include: {
      teacher: { select: { id: true, firstName: true, lastName: true } },
      subject: true,
      class: true,
    },
  },
};

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertTeacherOwnsLessonInstance(lessonInstanceId: string, teacherId: string) {
    const instance = await this.prisma.lessonInstance.findUniqueOrThrow({
      where: { id: lessonInstanceId },
      include: { teacherClass: true },
    });

    if (instance.teacherClass.teacherId !== teacherId) {
      throw new ConflictException('You do not own this lesson instance');
    }

    return instance;
  }

  async assertTeacherOwnsTeacherClass(teacherClassId: string, teacherId: string) {
    const tc = await this.prisma.teacherClass.findUniqueOrThrow({
      where: { id: teacherClassId },
    });

    if (tc.teacherId !== teacherId) {
      throw new ConflictException('You do not own this teacher-class');
    }

    return tc;
  }

  async findAll(lessonInstanceId?: string) {
    return this.prisma.attendance.findMany({
      where: lessonInstanceId ? { lessonInstanceId } : {},
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
        lessonInstance: {
          include: lessonInstanceInclude,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
        lessonInstance: {
          include: lessonInstanceInclude,
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  async batchUpsertAttendance(
    lessonInstanceId: string,
    entries: AttendanceEntryDto[],
    teacherId: string,
  ) {
    await this.assertTeacherOwnsLessonInstance(lessonInstanceId, teacherId);

    return this.prisma.$transaction(
      entries.map((entry) =>
        this.prisma.attendance.upsert({
          where: {
            studentId_lessonInstanceId: {
              studentId: entry.studentId,
              lessonInstanceId,
            },
          },
          update: { status: entry.status },
          create: {
            studentId: entry.studentId,
            lessonInstanceId,
            status: entry.status,
          },
        }),
      ),
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.attendance.delete({ where: { id } });
  }
}
