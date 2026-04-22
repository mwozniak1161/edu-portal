import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { UpdateTimeslotDto } from './dto/update-timeslot.dto';

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
    const startingHour = this.parseTime(dto.startingHour);

    // Handle unique constraint check for nullable teacherClassId
    const existingTimeslot = await this.findExistingTimeslot(
      dto.weekDay,
      startingHour,
      dto.teacherClassId ?? null,
    );

    if (existingTimeslot) {
      throw new ConflictException('A timeslot already exists for this slot');
    }

    const timeslotData = this.prepareTimeslotData(
      dto.weekDay,
      startingHour,
      dto.teacherClassId ?? null,
    );

    return this.prisma.timeslot.create({
      data: timeslotData,
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
    const startingHour = dto.startingHour ? this.parseTime(dto.startingHour) : current.startingHour;

    // Handle unique constraint check for nullable teacherClassId
    const existingTimeslot = await this.findExistingTimeslot(weekDay, startingHour, teacherClassId);

    if (existingTimeslot && existingTimeslot.id !== id) {
      throw new ConflictException('A timeslot already exists for this slot');
    }

    const timeslotData = this.prepareTimeslotData(weekDay, startingHour, teacherClassId ?? null);

    return this.prisma.timeslot.update({
      where: { id },
      data: timeslotData,
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

  private parseTime(timeStr: string): Date {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return new Date(1970, 0, 1, hours, minutes, seconds ?? 0);
  }

  private findExistingTimeslot(weekDay: number, startingHour: Date, teacherClassId: string | null) {
    return this.prisma.timeslot.findFirst({
      where: { weekDay, startingHour, teacherClassId },
    });
  }

  private prepareTimeslotData(weekDay: number, startingHour: Date, teacherClassId: string | null) {
    return { weekDay, startingHour, teacherClassId };
  }
}
