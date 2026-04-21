import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceEntryDto } from './dto/attendance-entry.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Assert that the teacher owns the teacher-class
   * Shared guard logic used in AttendanceService and GradeService
   */
  async assertTeacherOwnsTeacherClass(
    teacherClassId: string,
    teacherId: string,
  ) {
    const tc = await this.prisma.teacherClass.findUniqueOrThrow({
      where: { id: teacherClassId },
    });

    if (tc.teacherId !== teacherId) {
      throw new ConflictException('You do not own this teacher-class');
    }

    return tc;
  }

  async findAll(teacherClassId?: string, date?: string) {
    const where: any = {};

    if (teacherClassId) {
      where.teacherClassId = teacherClassId;
    }

    if (date) {
      where.date = new Date(date);
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        teacherClass: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } },
            subject: true,
            class: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        teacherClass: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } },
            subject: true,
            class: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  async batchUpsertAttendance(
    teacherClassId: string,
    date: Date,
    entries: AttendanceEntryDto[],
    teacherId: string,
  ) {
    // First verify teacher owns the teacher-class
    await this.assertTeacherOwnsTeacherClass(teacherClassId, teacherId);

    return this.prisma.$transaction(
      entries.map((entry) =>
        this.prisma.attendance.upsert({
          where: {
            studentId_teacherClassId_date: {
              studentId: entry.studentId,
              teacherClassId,
              date,
            },
          },
          update: { status: entry.status },
          create: {
            studentId: entry.studentId,
            teacherClassId,
            date,
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