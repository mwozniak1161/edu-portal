import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '../generated/prisma/enums';

const TEACHER_ID = 'teacher-1';
const STUDENT_ID = 'student-1';
const TC_ID = 'tc-1';

const mockTeacherClass = { id: TC_ID, teacherId: TEACHER_ID };

function buildPrisma() {
  return {
    teacherClass: {
      findUniqueOrThrow: jest.fn().mockResolvedValue(mockTeacherClass),
    },
    lessonInstance: {
      findUniqueOrThrow: jest.fn(),
    },
    attendance: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

describe('AttendanceService', () => {
  let service: AttendanceService;
  let prisma: ReturnType<typeof buildPrisma>;

  beforeEach(async () => {
    prisma = buildPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(AttendanceService);
  });

  describe('assertTeacherOwnsTeacherClass', () => {
    it('succeeds when teacher owns the class', async () => {
      await expect(
        service.assertTeacherOwnsTeacherClass(TC_ID, TEACHER_ID),
      ).resolves.toEqual(mockTeacherClass);
    });

    it('throws ConflictException when teacher does not own the class', async () => {
      prisma.teacherClass.findUniqueOrThrow.mockResolvedValue({ id: TC_ID, teacherId: 'other-teacher' });
      await expect(
        service.assertTeacherOwnsTeacherClass(TC_ID, TEACHER_ID),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('batchUpsertAttendance', () => {
    const entries = [
      { studentId: STUDENT_ID, status: AttendanceStatus.PRESENT },
      { studentId: 'student-2', status: AttendanceStatus.ABSENT },
    ];
    const date = new Date('2024-03-15');

    it('calls prisma.$transaction with correct upsert operations', async () => {
      // Mock lesson instance to belong to the teacher (ownership check passes)
      prisma.lessonInstance.findUniqueOrThrow.mockResolvedValue({
        id: TC_ID,
        teacherClass: { teacherId: TEACHER_ID }
      });
      prisma.$transaction.mockResolvedValue([]);
      await service.batchUpsertAttendance(TC_ID, entries, TEACHER_ID);

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('verifies teacher ownership before saving', async () => {
      // Mock lesson instance to belong to a different teacher (ownership check fails)
      prisma.lessonInstance.findUniqueOrThrow.mockResolvedValue({
        id: TC_ID,
        teacherClass: { teacherId: 'different-teacher' }
      });
      await expect(
        service.batchUpsertAttendance(TC_ID, entries, TEACHER_ID),
      ).rejects.toThrow(ConflictException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('creates one upsert per student entry', async () => {
      // Mock lesson instance to belong to the teacher (ownership check passes)
      prisma.lessonInstance.findUniqueOrThrow.mockResolvedValue({
        id: TC_ID,
        teacherClass: { teacherId: TEACHER_ID }
      });
      let capturedOps: unknown[] = [];
      prisma.$transaction.mockImplementation((ops: unknown[]) => {
        capturedOps = ops;
        return Promise.resolve([]);
      });

      await service.batchUpsertAttendance(TC_ID, entries, TEACHER_ID);
      expect(capturedOps).toHaveLength(entries.length);
    });
  });
});
