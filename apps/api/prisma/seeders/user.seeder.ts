import * as bcrypt from 'bcrypt';
import { BaseSeeder } from './base.seeder';
import { Role } from '../../src/generated/prisma/client';

interface UserSeed {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive?: boolean;
}

const users: UserSeed[] = [
  {
    email: 'admin@edu-portal.dev',
    password: 'Admin1234!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    isActive: true,
  },
];

export class UserSeeder extends BaseSeeder {
  async run() {
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);

      const created = await this.prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          password: hashed,
          isActive: user.isActive ?? true,
        },
      });

      console.log(`  ✓ ${created.role}: ${created.email}`);
    }
  }
}
