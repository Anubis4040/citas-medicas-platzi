import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  // Crear usuarios
  const user1 = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: '123456789',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Ana Gómez',
      email: 'ana@example.com',
      password: '123456789',
      role: 'ADMIN',
    },
  });

  // Crear bloques de tiempo (DateTime)
  const block1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-09-01T14:00:00Z'),
      endTime: new Date('2025-09-01T15:00:00Z'),
    },
  });

  const block2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-09-01T15:00:00Z'),
      endTime: new Date('2025-09-01T16:00:00Z'),
    },
  });

  // Crear citas
  await prisma.appointment.create({
    data: {
      date: new Date('2025-09-01T14:00:00Z'),
      userId: user1.id,
      timeBlockId: block1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date('2025-09-01T15:00:00Z'),
      userId: user2.id,
      timeBlockId: block2.id,
    },
  });

  console.log('Datos de ejemplo cargados correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });