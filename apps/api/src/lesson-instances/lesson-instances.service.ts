import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonInstanceDto } from './dto/create-lesson-instance.dto';
import { UpdateLessonInstanceDto } from './dto/update-lesson-instance.dto';
import { GenerateLessonInstancesDto } from './dto/generate-lesson-instances.dto';

@Injectable()
export class LessonInstancesService {
  private readonly logger = new Logger(LessonInstancesService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async assertTeacherOwnsTeacherClass(teacherClassId: string, teacherId: string) {
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
    await this.assertTeacherOwnsTeacherClass(instance.teacherClassId, teacherId);

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
    await this.assertTeacherOwnsTeacherClass(instance.teacherClassId, teacherId);
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

  /**
   * System-level method to generate lesson instances for all teacher-classes
   * Used by cron jobs - bypasses teacher authorization
   */
  async generateLessonInstancesForAllTeacherClasses(date: Date) {
    this.logger.log(`Generating lesson instances for all teacher-classes on ${date}`);

    // Get all teacher-classes with their timeslots
    const teacherClasses = await this.prisma.teacherClass.findMany({
      include: {
        timeslots: true,
      },
    });

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Normalize to start of day
    const weekDay = targetDate.getDay();

    let totalGenerated = 0;
    let totalSkipped = 0;

    // Process each teacher-class
    for (const teacherClass of teacherClasses) {
      // Filter timeslots for the specific weekday
      const timeslotsForDay = teacherClass.timeslots.filter((ts) => ts.weekDay === weekDay);

      if (timeslotsForDay.length === 0) {
        continue;
      }

      // Check existing lesson instances for this teacher-class and date
      const existingInstances = await this.prisma.lessonInstance.count({
        where: {
          teacherClassId: teacherClass.id,
          date: targetDate,
        },
      });

      const existingCount = existingInstances;

      if (existingCount >= timeslotsForDay.length) {
        totalSkipped += timeslotsForDay.length;
        continue;
      }

      // Create missing lesson instances
      const toCreate = timeslotsForDay.slice(existingCount);

      const createdInstances = await this.prisma.$transaction(
        toCreate.map(() =>
          this.prisma.lessonInstance.create({
            data: {
              teacherClassId: teacherClass.id,
              date: targetDate,
            },
          }),
        ),
      );

      totalGenerated += createdInstances.length;
    }

    this.logger.log(
      `Lesson instance generation completed. Generated: ${totalGenerated}, Skipped: ${totalSkipped}`,
    );

    return { generated: totalGenerated, skipped: totalSkipped };
  }
}
