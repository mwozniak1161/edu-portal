import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonInstanceDto } from './dto/create-lesson-instance.dto';
import { UpdateLessonInstanceDto } from './dto/update-lesson-instance.dto';
import { GenerateLessonInstancesDto } from './dto/generate-lesson-instances.dto';

@Injectable()
export class LessonInstancesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertTeacherOwnsTeacherClass(
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
    return this.prisma.lessonInstance.findMany({
      where: {
        ...(teacherClassId && { teacherClassId }),
        ...(date && { date: new Date(date) }),
      },
      include: {
        teacherClass: {
          include: {
            subject: true,
            class: true,
            teacher: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const instance = await this.prisma.lessonInstance.findUnique({
      where: { id },
      include: {
        teacherClass: {
          include: {
            subject: true,
            class: true,
            teacher: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Lesson instance not found');
    }

    return instance;
  }

  async create(dto: CreateLessonInstanceDto, teacherId: string) {
    await this.assertTeacherOwnsTeacherClass(dto.teacherClassId, teacherId);

    return this.prisma.lessonInstance.create({
      data: {
        teacherClassId: dto.teacherClassId,
        date: new Date(dto.date),
        topic: dto.topic,
        comment: dto.comment,
      },
    });
  }

  async update(id: string, dto: UpdateLessonInstanceDto, teacherId: string) {
    const instance = await this.findOne(id);
    await this.assertTeacherOwnsTeacherClass(
      instance.teacherClassId,
      teacherId,
    );

    return this.prisma.lessonInstance.update({
      where: { id },
      data: {
        ...(dto.topic !== undefined && { topic: dto.topic }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
      },
    });
  }

  async remove(id: string, teacherId: string) {
    const instance = await this.findOne(id);
    await this.assertTeacherOwnsTeacherClass(
      instance.teacherClassId,
      teacherId,
    );
    await this.prisma.lessonInstance.delete({ where: { id } });
  }

  /**
   * Generate lesson instances from timeslots for a given date.
   * Skips timeslots that already have an instance for that date (no overwrite).
   */
  async generateForDate(dto: GenerateLessonInstancesDto, teacherId: string) {
    const date = new Date(dto.date);
    await this.assertTeacherOwnsTeacherClass(dto.teacherClassId, teacherId);

    const weekDay = date.getDay();

    const timeslots = await this.prisma.timeslot.findMany({
      where: { teacherClassId: dto.teacherClassId, weekDay },
    });

    if (timeslots.length === 0) {
      return { created: [], skipped: 0 };
    }

    const existing = await this.prisma.lessonInstance.findMany({
      where: { teacherClassId: dto.teacherClassId, date },
    });

    const existingCount = existing.length;

    if (existingCount >= timeslots.length) {
      return { created: [], skipped: timeslots.length };
    }

    const toCreate = timeslots.slice(existingCount);

    const created = await this.prisma.$transaction(
      toCreate.map(() =>
        this.prisma.lessonInstance.create({
          data: {
            teacherClassId: dto.teacherClassId,
            date,
          },
        }),
      ),
    );

    return { created, skipped: existingCount };
  }
}
