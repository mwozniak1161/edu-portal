import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CreateCorrectionGradeDto } from './dto/create-correction-grade.dto';

@Injectable()
export class GradesService {
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

  async findAll(teacherClassId?: string, studentId?: string) {
    return this.prisma.grade.findMany({
      where: {
        ...(teacherClassId && { teacherClassId }),
        ...(studentId && { studentId }),
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        teacherClass: {
          include: {
            subject: true,
            class: true,
          },
        },
        correctionFor: { select: { id: true, value: true } },
        correction: { select: { id: true, value: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        teacherClass: { include: { subject: true, class: true } },
        correctionFor: { select: { id: true, value: true } },
        correction: { select: { id: true, value: true } },
      },
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    return grade;
  }

  async create(dto: CreateGradeDto, teacherId: string) {
    await this.assertTeacherOwnsTeacherClass(dto.teacherClassId, teacherId);

    return this.prisma.grade.create({
      data: {
        value: dto.value,
        weight: dto.weight ?? 1,
        comment: dto.comment,
        studentId: dto.studentId,
        teacherClassId: dto.teacherClassId,
      },
    });
  }

  async update(id: string, dto: UpdateGradeDto, teacherId: string) {
    const grade = await this.findOne(id);
    await this.assertTeacherOwnsTeacherClass(grade.teacherClassId, teacherId);

    return this.prisma.grade.update({
      where: { id },
      data: {
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.weight !== undefined && { weight: dto.weight }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
      },
    });
  }

  async remove(id: string, teacherId: string) {
    const grade = await this.findOne(id);
    await this.assertTeacherOwnsTeacherClass(grade.teacherClassId, teacherId);
    await this.prisma.grade.delete({ where: { id } });
  }

  async createCorrection(
    dto: CreateCorrectionGradeDto,
    teacherId: string,
  ) {
    const original = await this.findOne(dto.correctionForId);

    if (original.correction) {
      throw new ConflictException('This grade already has a correction');
    }

    await this.assertTeacherOwnsTeacherClass(
      original.teacherClassId,
      teacherId,
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.grade.update({
        where: { id: dto.correctionForId },
        data: { isExcluded: true },
      });

      return tx.grade.create({
        data: {
          value: dto.value,
          weight: dto.weight ?? original.weight,
          comment: dto.comment,
          studentId: original.studentId,
          teacherClassId: original.teacherClassId,
          correctionForId: dto.correctionForId,
        },
      });
    });
  }

  async getWeightedAverage(teacherClassId: string, studentId: string) {
    const grades = await this.prisma.grade.findMany({
      where: { teacherClassId, studentId, isExcluded: false },
    });

    if (grades.length === 0) {
      return { average: null, gradeCount: 0 };
    }

    const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    const weightedSum = grades.reduce(
      (sum, g) => sum + Number(g.value) * g.weight,
      0,
    );

    return {
      average: totalWeight > 0 ? weightedSum / totalWeight : null,
      gradeCount: grades.length,
    };
  }
}
