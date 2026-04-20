import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async create(dto: CreateSubjectDto) {
    const existing = await this.prisma.subject.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Subject name already exists');
    return this.prisma.subject.create({ data: { name: dto.name } });
  }

  async update(id: string, dto: UpdateSubjectDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.subject.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) throw new ConflictException('Subject name already exists');
    }
    return this.prisma.subject.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.subject.delete({ where: { id } });
  }
}
