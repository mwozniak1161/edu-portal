import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherClassDto } from './dto/create-teacher-class.dto';
import { UpdateTeacherClassDto } from './dto/update-teacher-class.dto';

@Injectable()
export class TeacherClassesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(classId?: string) {
    return this.prisma.teacherClass.findMany({
      where: classId ? { classId } : undefined,
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
        subject: true,
        class: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tc = await this.prisma.teacherClass.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
        subject: true,
        class: true,
      },
    });
    if (!tc) throw new NotFoundException('TeacherClass not found');
    return tc;
  }

  async create(dto: CreateTeacherClassDto) {
    const existing = await this.prisma.teacherClass.findUnique({
      where: {
        teacherId_subjectId_classId: {
          teacherId: dto.teacherId,
          subjectId: dto.subjectId,
          classId: dto.classId,
        },
      },
    });
    if (existing) throw new ConflictException('This teacher-subject-class combination already exists');

    return this.prisma.teacherClass.create({
      data: dto,
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
        subject: true,
        class: true,
      },
    });
  }

  async update(id: string, dto: UpdateTeacherClassDto) {
    const current = await this.findOne(id);

    const teacherId = dto.teacherId ?? current.teacherId;
    const subjectId = dto.subjectId ?? current.subjectId;
    const classId = dto.classId ?? current.classId;

    const existing = await this.prisma.teacherClass.findUnique({
      where: { teacherId_subjectId_classId: { teacherId, subjectId, classId } },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException('This teacher-subject-class combination already exists');
    }

    return this.prisma.teacherClass.update({
      where: { id },
      data: dto,
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
        subject: true,
        class: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.teacherClass.delete({ where: { id } });
  }
}
