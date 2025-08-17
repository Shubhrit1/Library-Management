const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const password = await bcrypt.hash('password123', 10);

  // Create librarian
  await prisma.user.upsert({
    where: { email: 'librarian@library.com' },
    update: {},
    create: {
      name: 'Librarian',
      email: 'librarian@library.com',
      passwordHash: password,
      role: 'LIBRARIAN',
    },
  });

  // Create user
  await prisma.user.upsert({
    where: { email: 'user@library.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@library.com',
      passwordHash: password,
      role: 'MEMBER',
    },
  });

  console.log('Demo users created!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
