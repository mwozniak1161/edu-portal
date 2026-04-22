import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GradesService } from './grades.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

const mockMailService = { sendGradeNotificationEmail: jest.fn().mockResolvedValue(undefined) };

const TEACHER_ID = 'teacher-1';
const STUDENT_ID = 'student-1';
const TC_ID = 'tc-1';
const GRADE_ID = 'grade-1';

const SUBJECT_ID = 'subject-1';
const CLASS_ID = 'class-1';

const mockTeacherClass = {
  id: TC_ID,
  teacherId: TEACHER_ID,
  subjectId: SUBJECT_ID,
  classId: CLASS_ID,
  subject: { id: SUBJECT_ID, name: 'Mathematics', createdAt: new Date(), updatedAt: new Date() },
  class: { id: CLASS_ID, name: '3A', createdAt: new Date(), updatedAt: new Date() },
};

const mockGrade = {
  id: GRADE_ID,
  value: 4,
  weight: 2,
  comment: null,
  isExcluded: false,
  studentId: STUDENT_ID,
  teacherClassId: TC_ID,
  correctionForId: null,
  student: { id: STUDENT_ID, firstName: 'Jan', lastName: 'Kowalski' },
  teacherClass: mockTeacherClass,
  correctionFor: null,
  correction: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function buildPrisma() {
  return {
    teacherClass: {
      findUniqueOrThrow: jest.fn().mockResolvedValue(mockTeacherClass),
    },
    grade: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(mockGrade),
      create: jest.fn().mockResolvedValue(mockGrade),
      update: jest.fn().mockResolvedValue(mockGrade),
      delete: jest.fn().mockResolvedValue(mockGrade),
    },
    $transaction: jest.fn(),
  };
}

describe('GradesService', () => {
  let service: GradesService;
  let prisma: ReturnType<typeof buildPrisma>;

  beforeEach(async () => {
    prisma = buildPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradesService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();
    service = module.get(GradesService);
  });

  describe('findAll — response shape includes names not raw IDs', () => {
    beforeEach(() => {
      prisma.grade.findMany.mockResolvedValue([mockGrade]);
    });

    it('returns student first and last name', async () => {
      const [grade] = await service.findAll();
      expect(grade.student.firstName).toBe('Jan');
      expect(grade.student.lastName).toBe('Kowalski');
    });

    it('returns subject name inside teacherClass — not a raw UUID', async () => {
      const [grade] = await service.findAll();
      expect(grade.teacherClass.subject.name).toBe('Mathematics');
    });

    it('returns class name inside teacherClass — not a raw UUID', async () => {
      const [grade] = await service.findAll();
      expect(grade.teacherClass.class.name).toBe('3A');
    });

    it('calls findMany with student and teacherClass includes', async () => {
      await service.findAll();
      expect(prisma.grade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            student: expect.anything(),
            teacherClass: expect.objectContaining({
              include: expect.objectContaining({ subject: true, class: true }),
            }),
          }),
        }),
      );
    });
  });

  describe('getWeightedAverage', () => {
    it('returns null when no grades', async () => {
      prisma.grade.findMany.mockResolvedValue([]);
      const result = await service.getWeightedAverage(TC_ID, STUDENT_ID);
      expect(result).toEqual({ average: null, gradeCount: 0 });
    });

    it('calculates weighted average correctly', async () => {
      prisma.grade.findMany.mockResolvedValue([
        { value: '5', weight: 2 },
        { value: '3', weight: 1 },
      ]);
      const result = await service.getWeightedAverage(TC_ID, STUDENT_ID);
      // (5*2 + 3*1) / (2+1) = 13/3 ≈ 4.333
      expect(result.average).toBeCloseTo(13 / 3, 5);
      expect(result.gradeCount).toBe(2);
    });

    it('excludes grades with isExcluded=true from query', async () => {
      await service.getWeightedAverage(TC_ID, STUDENT_ID);
      expect(prisma.grade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isExcluded: false }),
        }),
      );
    });

    it('handles single grade with weight 1', async () => {
      prisma.grade.findMany.mockResolvedValue([{ value: '4', weight: 1 }]);
      const result = await service.getWeightedAverage(TC_ID, STUDENT_ID);
      expect(result.average).toBe(4);
    });
  });

  describe('ownership guard', () => {
    it('throws ConflictException when teacher does not own teacher-class', async () => {
      prisma.teacherClass.findUniqueOrThrow.mockResolvedValue({
        id: TC_ID,
        teacherId: 'other-teacher',
      });
      await expect(
        service.create({ value: 5, studentId: STUDENT_ID, teacherClassId: TC_ID }, TEACHER_ID),
      ).rejects.toThrow(ConflictException);
    });

    it('allows creation when teacher owns teacher-class', async () => {
      prisma.$transaction = jest.fn();
      await service.create({ value: 5, studentId: STUDENT_ID, teacherClassId: TC_ID }, TEACHER_ID);
      expect(prisma.grade.create).toHaveBeenCalled();
    });
  });

  describe('createCorrection', () => {
    it('throws ConflictException when grade already has a correction', async () => {
      prisma.grade.findUnique.mockResolvedValue({
        ...mockGrade,
        correction: { id: 'existing-correction', value: 5 },
      });
      await expect(
        service.createCorrection({ correctionForId: GRADE_ID, value: 5 }, TEACHER_ID),
      ).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when original grade does not exist', async () => {
      prisma.grade.findUnique.mockResolvedValue(null);
      await expect(
        service.createCorrection({ correctionForId: 'nonexistent', value: 5 }, TEACHER_ID),
      ).rejects.toThrow(NotFoundException);
    });

    it('marks original grade as excluded in transaction', async () => {
      const tx = {
        grade: {
          update: jest.fn().mockResolvedValue({ ...mockGrade, isExcluded: true }),
          create: jest
            .fn()
            .mockResolvedValue({ ...mockGrade, id: 'correction-id', correctionForId: GRADE_ID }),
        },
      };
      prisma.$transaction.mockImplementation((fn: (tx: typeof tx) => Promise<unknown>) => fn(tx));

      await service.createCorrection({ correctionForId: GRADE_ID, value: 5 }, TEACHER_ID);

      expect(tx.grade.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: GRADE_ID }, data: { isExcluded: true } }),
      );
    });
  });
});
