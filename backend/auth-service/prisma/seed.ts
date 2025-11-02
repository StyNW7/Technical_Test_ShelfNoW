// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin123!', 10);
  const existing = await prisma.user.findUnique({ where: { email: 'admin@shelfnow.test' } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Admin ShelfNoW',
        email: 'admin@shelfnow.test',
        password,
        role: 'ADMIN',
      },
    });
    console.log('Seeded admin user: admin@shelfnow.test / Admin123!');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });