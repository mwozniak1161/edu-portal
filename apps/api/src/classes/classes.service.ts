import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.class.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const cls = await this.prisma.class.findUnique({ where: { id } });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async create(dto: CreateClassDto) {
    const existing = await this.prisma.class.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Class name already exists');
    return this.prisma.class.create({ data: { name: dto.name } });
  }

  async update(id: string, dto: UpdateClassDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.prisma.class.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) throw new ConflictException('Class name already exists');
    }
    return this.prisma.class.update({ where: { id }, data: dto });
  }

  async findStudents(classId: string) {
    await this.findOne(classId);
    return this.prisma.user.findMany({
      where: { classId, role: 'STUDENT' },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true, classId: true, createdAt: true, updatedAt: true },
      orderBy: { lastName: 'asc' },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.class.delete({ where: { id } });
  }
}
