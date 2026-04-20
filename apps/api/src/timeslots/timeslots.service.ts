import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';

function parseTime(timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const d = new Date(1970, 0, 1, hours, minutes, seconds ?? 0);
  return d;
}

@Injectable()
export class TimeslotsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(teacherClassId?: string, classId?: string) {
    return this.prisma.timeslot.findMany({
      where: {
        ...(teacherClassId && { teacherClassId }),
        ...(classId && { teacherClass: { classId } }),
      },
      include: {
        teacherClass: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } },
            subject: true,
            class: true,
          },
        },
      },
      orderBy: [{ weekDay: 'asc' }, { startingHour: 'asc' }],
    });
  }

  async findOne(id: string) {
    const slot = await this.prisma.timeslot.findUnique({
      where: { id },
      include: {
        teacherClass: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } },
            subject: true,
            class: true,
          },
        },
      },
    });
    if (!slot) throw new NotFoundException('Timeslot not found');
    return slot;
  }

  async create(dto: CreateTimeslotDto) {
    const startingHour = parseTime(dto.startingHour);

    const existing = await this.prisma.timeslot.findUnique({
      where: {
        teacherClassId_weekDay_startingHour: {
          teacherClassId: dto.teacherClassId,
          weekDay: dto.weekDay,
          startingHour,
        },
      },
    });
    if (existing) throw new ConflictException('A timeslot already exists for this slot');

    return this.prisma.timeslot.create({
      data: { teacherClassId: dto.teacherClassId, weekDay: dto.weekDay, startingHour },
      include: {
        teacherClass: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } },
            subject: true,
            class: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTimeslotDto) {
    const current = await this.findOne(id);

    const teacherClassId = dto.teacherClassId ?? current.teacherClassId;
    const weekDay = dto.weekDay ?? current.weekDay;
    const startingHour = dto.startingHour ? parseTime(dto.startingHour) : current.startingHour;

    const existing = await this.prisma.timeslot.findUnique({
      where: { teacherClassId_weekDay_startingHour: { teacherClassId, weekDay, startingHour } },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException('A timeslot already exists for this slot');
    }

    return this.prisma.timeslot.update({
      where: { id },
      data: { teacherClassId, weekDay, startingHour },
      include: {
        teacherClass: {
          include: {
            teacher: { select: { id: true, firstName: true, lastName: true } },
            subject: true,
            class: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.timeslot.delete({ where: { id } });
  }
}
