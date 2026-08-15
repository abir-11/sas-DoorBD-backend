import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/client';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const superAdminRole = await prisma.role.upsert({
    where: { roleName: 'SUPER_ADMIN' },
    update: {},
    create: {
      roleName: 'SUPER_ADMIN',
      description: 'System Owner with full bypass permissions',
    },
  });
  await prisma.role.upsert({
    where: { roleName: 'CUSTOMER' },
    update: {},
    create: {
      roleName: 'CUSTOMER',
      description: 'Default role for registered public users',
    },
  });
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@system.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@system.com',
      password: hashedPassword,
      roleId: superAdminRole.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Hardcoded Super Admin Role & User Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });