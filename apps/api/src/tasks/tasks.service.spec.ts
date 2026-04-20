import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { LessonInstancesService } from '../lesson-instances/lesson-instances.service';

// Basic test to verify Jest is working
describe('TasksService (basic)', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});

// Now the actual service tests
describe('TasksService', () => {
  let service: TasksService;
  let lessonInstancesService: any;

  beforeEach(async () => {
    // Create mock LessonInstancesService
    lessonInstancesService = {
      generateLessonInstancesForAllTeacherClasses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: LessonInstancesService, useValue: lessonInstancesService },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  describe('handleDailyLessonInstanceGeneration', () => {
    it('should call lesson instances service to generate lesson instances', async () => {
      // Arrange
      const mockResult = { generated: 5, skipped: 2 };
      lessonInstancesService.generateLessonInstancesForAllTeacherClasses.mockResolvedValue(mockResult);

      // Act
      await service.handleDailyLessonInstanceGeneration();

      // Assert
      expect(lessonInstancesService.generateLessonInstancesForAllTeacherClasses).toHaveBeenCalledWith(
        expect.any(Date)
      );
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      lessonInstancesService.generateLessonInstancesForAllTeacherClasses.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.handleDailyLessonInstanceGeneration()).resolves.toBeUndefined();

      expect(lessonInstancesService.generateLessonInstancesForAllTeacherClasses).toHaveBeenCalled();
    });
  });
});