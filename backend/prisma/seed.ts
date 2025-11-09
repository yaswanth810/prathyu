import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@skillswap.com' },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    console.log('📧 Email: admin@skillswap.com');
    console.log('🔑 Password: admin123');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@skillswap.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      bio: 'Platform Administrator',
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('');
  console.log('📧 Email: admin@skillswap.com');
  console.log('🔑 Password: admin123');
  console.log('');
  console.log('⚠️  IMPORTANT: Change this password after first login in production!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
