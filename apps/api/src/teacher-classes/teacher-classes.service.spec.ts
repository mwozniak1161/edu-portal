import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TeacherClassesService } from './teacher-classes.service';
import { PrismaService } from '../prisma/prisma.service';

const TEACHER_ID = 'teacher-uuid-1';
const SUBJECT_ID = 'subject-uuid-1';
const CLASS_ID = 'class-uuid-1';
const TC_ID = 'tc-uuid-1';

const mockTeacherClass = {
  id: TC_ID,
  teacherId: TEACHER_ID,
  subjectId: SUBJECT_ID,
  classId: CLASS_ID,
  teacher: { id: TEACHER_ID, firstName: 'Anna', lastName: 'Nowak', email: 'anna@school.pl' },
  subject: { id: SUBJECT_ID, name: 'Mathematics', createdAt: new Date(), updatedAt: new Date() },
  class: { id: CLASS_ID, name: '3A', createdAt: new Date(), updatedAt: new Date() },
  createdAt: new Date(),
  updatedAt: new Date(),
};

function buildPrisma() {
  return {
    teacherClass: {
      findMany: jest.fn().mockResolvedValue([mockTeacherClass]),
      findUnique: jest.fn().mockResolvedValue(mockTeacherClass),
      create: jest.fn().mockResolvedValue(mockTeacherClass),
      update: jest.fn().mockResolvedValue(mockTeacherClass),
      delete: jest.fn().mockResolvedValue(mockTeacherClass),
    },
  };
}

describe('TeacherClassesService', () => {
  let service: TeacherClassesService;
  let prisma: ReturnType<typeof buildPrisma>;

  beforeEach(async () => {
    prisma = buildPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherClassesService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(TeacherClassesService);
  });

  describe('findAll', () => {
    it('returns teacher name — not a raw UUID', async () => {
      const result = await service.findAll();
      expect(result[0].teacher.firstName).toBe('Anna');
      expect(result[0].teacher.lastName).toBe('Nowak');
      expect(result[0].teacher).not.toHaveProperty('password');
    });

    it('returns subject name — not a raw UUID', async () => {
      const result = await service.findAll();
      expect(result[0].subject.name).toBe('Mathematics');
      expect(result[0].subject.id).toBe(SUBJECT_ID);
    });

    it('returns class name — not a raw UUID', async () => {
      const result = await service.findAll();
      expect(result[0].class.name).toBe('3A');
      expect(result[0].class.id).toBe(CLASS_ID);
    });

    it('calls findMany with correct includes', async () => {
      await service.findAll();
      expect(prisma.teacherClass.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            teacher: expect.anything(),
            subject: true,
            class: true,
          }),
        }),
      );
    });

    it('filters by classId when provided', async () => {
      await service.findAll(CLASS_ID);
      expect(prisma.teacherClass.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { classId: CLASS_ID } }),
      );
    });
  });

  describe('findOne', () => {
    it('returns nested names for a single record', async () => {
      const result = await service.findOne(TC_ID);
      expect(result.subject.name).toBe('Mathematics');
      expect(result.class.name).toBe('3A');
      expect(result.teacher.firstName).toBe('Anna');
    });

    it('throws NotFoundException when record does not exist', async () => {
      prisma.teacherClass.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
