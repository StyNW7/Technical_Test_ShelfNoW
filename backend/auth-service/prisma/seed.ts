import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shelfnow.com' },
    update: {},
    create: {
      name: 'Admin ShelfNow',
      email: 'admin@shelfnow.com',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password,
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin:', admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
