import { Test, TestingModule } from '@nestjs/testing';
import { LessonInstancesService } from './lesson-instances.service';
import { PrismaService } from '../prisma/prisma.service';

// Basic test to verify Jest is working
describe('LessonInstancesService (basic)', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});

// Now the actual service tests
describe('LessonInstancesService', () => {
  let service: LessonInstancesService;
  let prisma: any;

  beforeEach(async () => {
    // Create mock PrismaService
    prisma = {
      teacherClass: {
        findMany: jest.fn(),
      },
      lessonInstance: {
        count: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonInstancesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(LessonInstancesService);
  });

  describe('generateLessonInstancesForAllTeacherClasses', () => {
    it('should handle empty teacher-classes array', async () => {
      // Arrange
      prisma.teacherClass.findMany.mockResolvedValue([]);

      // Act
      const result = await service.generateLessonInstancesForAllTeacherClasses(new Date());

      // Assert
      expect(result).toEqual({ generated: 0, skipped: 0 });
      expect(prisma.teacherClass.findMany).toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should skip teacher-classes with no matching weekday timeslots', async () => {
      // Arrange
      const testDate = new Date('2024-01-15T00:00:00Z'); // Monday (day 1)
      const mockTeacherClasses = [
        {
          id: 'tc-1',
          teacherId: 'teacher-1',
          timeslots: [
            { id: 'ts-1', teacherClassId: 'tc-1', weekDay: 2 }, // Tuesday (no match)
          ],
        },
      ];
      prisma.teacherClass.findMany.mockResolvedValue(mockTeacherClasses);

      // Act
      const result = await service.generateLessonInstancesForAllTeacherClasses(testDate);

      // Assert
      expect(result).toEqual({ generated: 0, skipped: 0 });
      expect(prisma.teacherClass.findMany).toHaveBeenCalled();
      expect(prisma.lessonInstance.count).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      prisma.teacherClass.findMany.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        service.generateLessonInstancesForAllTeacherClasses(new Date())
      ).rejects.toThrow('Database error');

      expect(prisma.teacherClass.findMany).toHaveBeenCalled();
    });
  });
});