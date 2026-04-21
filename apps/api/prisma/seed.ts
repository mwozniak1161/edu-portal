import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { UserSeeder } from './seeders/user.seeder';
import { BaseSeeder } from './seeders/base.seeder';
import { TimeslotSeeder } from './seeders/timeslot.seeder';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

const seeders: (new (prisma: PrismaClient) => BaseSeeder)[] = [
  UserSeeder,
  TimeslotSeeder,
  // GradeSeeder,
  // ClassSeeder,
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const Seeder of seeders) {
    const name = Seeder.name;
    console.log(`\n[${name}]`);
    await new Seeder(prisma).run();
  }

  console.log('\n✅ Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
