import { PrismaClient } from '../../src/generated/prisma/client';

export abstract class BaseSeeder {
  constructor(protected readonly prisma: PrismaClient) {}

  abstract run(): Promise<void>;
}
