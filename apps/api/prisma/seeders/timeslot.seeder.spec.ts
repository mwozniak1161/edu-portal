import { PrismaClient } from '../../src/generated/prisma/client';
import { TimeslotSeeder } from './timeslot.seeder';

describe('TimeslotSeeder (unit)', () => {
  let prisma: Partial<PrismaClient>;
  let seeder: TimeslotSeeder;

  beforeEach(() => {
    // Create mock PrismaClient
    prisma = {
      teacherClass: {
        findMany: jest.fn(),
      },
      timeslot: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };

    seeder = new TimeslotSeeder(prisma as PrismaClient);
  });

  describe('run', () => {
    it('should seed time slots as templates (no teacher class)', async () => {
      // Arrange
      (prisma.teacherClass.findMany as jest.Mock).mockResolvedValue([]); // No teacher classes yet
      (prisma.timeslot.findMany as jest.Mock).mockResolvedValue([]); // No existing template timeslots

      // Act
      await seeder.run();

      // Assert
      expect(prisma.teacherClass.findMany).toHaveBeenCalled();
      // Should call findMany and create for each timeslot combination (168 total)
      expect(prisma.timeslot.findMany).toHaveBeenCalledTimes(168);
      expect(prisma.timeslot.create).toHaveBeenCalledTimes(168);
    });

    it('should skip existing time slot templates', async () => {
      // Arrange
      (prisma.teacherClass.findMany as jest.Mock).mockResolvedValue([]); // No teacher classes
      // Mock that all template timeslots already exist
      (prisma.timeslot.findMany as jest.Mock).mockImplementation((where) => {
        // Return a matching timeslot for any query
        return [{
          id: 'existing-ts',
          weekDay: where.weekDay,
          startingHour: where.startingHour,
          length: 45,
          teacherClassId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }];
      });

      // Act
      await seeder.run();

      // Assert
      expect(prisma.teacherClass.findMany).toHaveBeenCalled();
      // Should call findMany for each timeslot but never create since they all exist
      expect(prisma.timeslot.findMany).toHaveBeenCalledTimes(168);
      expect(prisma.timeslot.create).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      (prisma.teacherClass.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(seeder.run()).rejects.toThrow('Database error');

      expect(prisma.teacherClass.findMany).toHaveBeenCalled();
    });
  });
});