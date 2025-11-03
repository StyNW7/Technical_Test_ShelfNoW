import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../src/common/enums/user-role-enum';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@shelfnow.com' },
    update: {},
    create: {
      email: 'admin@shelfnow.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    } as any,
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  await prisma.user.upsert({
    where: { email: 'user@shelfnow.com' },
    update: {},
    create: {
      email: 'user@shelfnow.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
    } as any,
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });