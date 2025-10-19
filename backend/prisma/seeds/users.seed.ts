import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding users...');

  const hashedPassword = await bcrypt.hash('senha123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'diego@forge.com' },
      update: {},
      create: {
        email: 'diego@forge.com',
        password: hashedPassword,
        name: 'Diego Santos',
        position: 'Engineering Manager',
        bio: 'Líder técnico focado em cultura de desenvolvimento',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ana@forge.com' },
      update: {},
      create: {
        email: 'ana@forge.com',
        password: hashedPassword,
        name: 'Ana Silva',
        position: 'Senior Frontend Developer',
        bio: 'Especialista em React e Design Systems',
      },
    }),
    prisma.user.upsert({
      where: { email: 'carlos@forge.com' },
      update: {},
      create: {
        email: 'carlos@forge.com',
        password: hashedPassword,
        name: 'Carlos Oliveira',
        position: 'Backend Developer',
        bio: 'Node.js e arquitetura de microsserviços',
      },
    }),
    prisma.user.upsert({
      where: { email: 'maria@forge.com' },
      update: {},
      create: {
        email: 'maria@forge.com',
        password: hashedPassword,
        name: 'Maria Costa',
        position: 'Product Designer',
        bio: 'UX/UI e Design Thinking',
      },
    }),
    prisma.user.upsert({
      where: { email: 'joao@forge.com' },
      update: {},
      create: {
        email: 'joao@forge.com',
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
