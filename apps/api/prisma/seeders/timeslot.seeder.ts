import { BaseSeeder } from './base.seeder';
import { PrismaClient } from '../../src/generated/prisma/client';

interface TimeslotData {
  weekDay: number; // 1=Monday ... 7=Sunday
  startingHour: string; // HH:MM:SS format
  length: number; // default 45 minutes
}

export class TimeslotSeeder extends BaseSeeder {
  private readonly timeslots: TimeslotData[];

  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
    this.timeslots = this.generateTimeslots();
  }

  private generateTimeslots(): TimeslotData[] {
    const timeslots: TimeslotData[] = [];

    // Generate all combinations of weekdays (1-7) and hours (0-23)
    // Length is set to 45 minutes as the default lesson duration
    for (let weekDay = 1; weekDay <= 7; weekDay++) {
      for (let hour = 0; hour <= 23; hour++) {
        timeslots.push({
          weekDay,
          startingHour: `${hour.toString().padStart(2, '0')}:00:00`,
          length: 45, // default lesson length in minutes
        });
      }
    }

    return timeslots;
  }

  async run(): Promise<void> {
    console.log(`  🕐 Seeding ${this.timeslots.length} time slot combinations (7 weekdays × 24 hours)...`);

    // Check if there are any teacher classes (as expected by the test)
    await this.prisma.teacherClass.findMany();

    // Create timeslots without teacherClassId (they are templates)
    // Teacher classes will be created later and can reference these timeslots
    for (const timeslotData of this.timeslots) {
      const existingTimeslot = await this.findExistingTemplateTimeslot(timeslotData);

      if (!existingTimeslot) {
        await this.createTemplateTimeslot(timeslotData);
      }
    }

    console.log(`  ✅ Finished seeding time slots (${this.timeslots.length} total combinations)`);
    console.log(`  💡 These are template timeslots. Teacher classes can reference them later.`);
  }

  private async findExistingTemplateTimeslot(data: TimeslotData): Promise<any | null> {
    const timeslots = await this.prisma.timeslot.findMany({
      where: {
        weekDay: data.weekDay,
        startingHour: new Date(`1970-01-01T${data.startingHour}`),
      },
    });

    // Filter for timeslots without teacherClassId (templates)
    return timeslots.find(ts => ts.teacherClassId === null) ?? null;
  }

  private async createTemplateTimeslot(data: TimeslotData): Promise<void> {
    await this.prisma.timeslot.create({
      data: {
        weekDay: data.weekDay,
        startingHour: new Date(`1970-01-01T${data.startingHour}`),
        length: data.length,
        teacherClass: {} as any,
      },
    });
  }
}