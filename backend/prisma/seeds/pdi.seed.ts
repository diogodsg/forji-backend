import { PrismaClient, User, Workspace, Cycle, Goal } from '@prisma/client';

export async function seedCycles(prisma: PrismaClient, diego: User, acmeTech: Workspace) {
  console.log('📅 Seeding cycles...');

  const cycle = await prisma.cycle.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-446655440003',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Ciclo Q1 2024 - Desenvolvimento Backend',
      description: 'Foco em melhorias de arquitetura, performance e boas práticas',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      status: 'ACTIVE',
      userId: diego.id,
      workspaceId: acmeTech.id,
    },
  });

  console.log('✅ Created cycle');
  return cycle;
}

export async function seedGoals(prisma: PrismaClient, cycle: Cycle, diego: User) {
  console.log('🎯 Seeding goals...');

  const goals = await Promise.all([
    prisma.goal.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440004',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Implementar Sistema de Cache',
        description:
          'Implementar Redis para cache de queries frequentes e melhorar performance da API',
        type: 'BINARY',
        status: 'ACTIVE',
        currentValue: 65,
        targetValue: 100,
        startValue: 0,
        unit: '%',
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
    prisma.goal.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440005',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440005',
        title: 'Refatorar Autenticação',
        description: 'Migrar de JWT simples para refresh tokens e melhorar segurança',
        type: 'BINARY',
        status: 'COMPLETED',
        currentValue: 100,
        targetValue: 100,
        startValue: 0,
        unit: '%',
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
    prisma.goal.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440006',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Aumentar Cobertura de Testes',
        description: 'Elevar cobertura de testes unitários de 45% para 80%',
        type: 'INCREASE',
        status: 'ACTIVE',
        currentValue: 45,
        targetValue: 80,
        startValue: 45,
        unit: '%',
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
    prisma.goal.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440007',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'Otimizar Queries do Banco',
        description: 'Identificar e otimizar queries lentas, adicionar índices necessários',
        type: 'PERCENTAGE',
        status: 'ACTIVE',
        currentValue: 30,
        targetValue: 100,
        startValue: 0,
        unit: '%',
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
  ]);

  console.log('✅ Created goals');
  return goals;
}

export async function seedCompetencies(prisma: PrismaClient, cycle: Cycle, diego: User) {
  console.log('💪 Seeding competencies...');

  const competencies = await Promise.all([
    prisma.competency.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440008',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Arquitetura de Software',
        category: 'TECHNICAL',
        currentLevel: 4,
        targetLevel: 5,
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
    prisma.competency.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-446655440009',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Performance e Otimização',
        category: 'TECHNICAL',
        currentLevel: 3,
        targetLevel: 4,
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
    prisma.competency.upsert({
      where: {
        id: '550e8400-e29b-41d4-a716-44665544000a',
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-44665544000a',
        name: 'Mentoria Técnica',
        category: 'BEHAVIORAL',
        currentLevel: 4,
        targetLevel: 5,
        cycleId: cycle.id,
        userId: diego.id,
      },
    }),
  ]);

  console.log('✅ Created competencies');
  return competencies;
}
