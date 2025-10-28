import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@eit.ac.nz' },
    update: {},
    create: {
      name: 'Main Tutor',
      email: 'admin@eit.ac.nz',
      password: hashedPassword,
      role: 'Tutor',
    },
  });
  console.log('✅ Super Admin created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
