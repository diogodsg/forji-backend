import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding users...');

  const hashedPassword = await bcrypt.hash('senha123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'diego@forji.com' },
      update: {},
      create: {
        email: 'diego@forji.com',
        password: hashedPassword,
        name: 'Diego Santos',
        position: 'Engineering Manager',
        bio: 'Líder técnico focado em cultura de desenvolvimento',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ana@forji.com' },
      update: {},
      create: {
        email: 'ana@forji.com',
        password: hashedPassword,
        name: 'Ana Silva',
        position: 'Senior Frontend Developer',
        bio: 'Especialista em React e Design Systems',
      },
    }),
    prisma.user.upsert({
      where: { email: 'carlos@forji.com' },
      update: {},
      create: {
        email: 'carlos@forji.com',
        password: hashedPassword,
        name: 'Carlos Oliveira',
        position: 'Backend Developer',
        bio: 'Node.js e arquitetura de microsserviços',
      },
    }),
    prisma.user.upsert({
      where: { email: 'maria@forji.com' },
      update: {},
      create: {
        email: 'maria@forji.com',
        password: hashedPassword,
        name: 'Maria Costa',
        position: 'Product Designer',
        bio: 'UX/UI e Design Thinking',
      },
    }),
    prisma.user.upsert({
      where: { email: 'joao@forji.com' },
      update: {},
      create: {
        email: 'joao@forji.com',
        password: hashedPassword,
        name: 'João Souza',
        position: 'DevOps Engineer',
        bio: 'Cloud infrastructure e CI/CD',
      },
    }),
  ]);

  console.log('✅ Created 5 users');
  return users;
}
