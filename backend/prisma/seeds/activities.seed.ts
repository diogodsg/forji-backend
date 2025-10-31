import { PrismaClient, User, Cycle } from '@prisma/client';

export async function seedActivities(
  prisma: PrismaClient,
  cycle: Cycle,
  diego: User,
  carlos: User,
) {
  console.log('📋 Seeding activities...');

  // Create Activity entries
  const oneOnOneActivity = await prisma.activity.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-44665544000b',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-44665544000b',
      type: 'ONE_ON_ONE',
      title: 'Reunião 1:1 com Carlos',
      description: 'Discussão sobre progresso no sistema de cache',
      xpEarned: 50,
      duration: 30,
      cycleId: cycle.id,
      userId: diego.id,
    },
  });

  const mentoringActivity = await prisma.activity.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-44665544000c',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-44665544000c',
      type: 'MENTORING',
      title: 'Sessão de Mentoria com Ana',
      description: 'Padrões de arquitetura e design patterns',
      xpEarned: 75,
      duration: 60,
      cycleId: cycle.id,
      userId: diego.id,
    },
  });

  const certificationActivity = await prisma.activity.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-44665544000d',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-44665544000d',
      type: 'CERTIFICATION',
      title: 'AWS Certified Solutions Architect',
      description: 'Certificação completa em arquitetura AWS',
      xpEarned: 200,
      cycleId: cycle.id,
      userId: diego.id,
    },
  });

  console.log('✅ Created activities');

  // Create OneOnOneActivity
  await prisma.oneOnOneActivity.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-44665544000b',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-44665544000b',
      activityId: oneOnOneActivity.id,
      participantId: carlos.id,
      participantName: 'Carlos Oliveira',
      completedAt: new Date('2025-10-25T14:00:00Z'),
      workingOn: ['Implementação de sistema de cache com Redis', 'Testes de integração'],
      generalNotes: 'Reunião produtiva, Carlos está progredindo bem',
      positivePoints: [
        'Ótimo progresso na implementação',
        'Código limpo e bem documentado',
        'Boa comunicação sobre bloqueios',
      ],
      improvementPoints: [
        'Poderia adicionar mais testes de integração',
        'Documentar edge cases identificados',
      ],
      nextSteps: [
        'Implementar testes de integração para cache',
        'Revisar documentação do módulo',
        'Preparar apresentação para o time',
      ],
    },
  });

  console.log('✅ Created OneOnOneActivity');

  // Create MentoringActivity
  await prisma.mentoringActivity.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-44665544000c',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-44665544000c',
      activityId: mentoringActivity.id,
      menteeName: 'Diego Santos (Mentee)',
      topics: ['Padrões de arquitetura', 'Clean Code', 'Design Patterns', 'SOLID Principles'],
      progressFrom: 60,
      progressTo: 75,
      outcomes: 'Boa evolução no entendimento de padrões, aplicou conceitos no projeto atual',
      nextSteps: [
        'Estudar SOLID principles em profundidade',
        'Implementar Repository Pattern no projeto',
        'Revisar código do módulo de autenticação',
        'Preparar apresentação sobre Clean Architecture',
      ],
    },
  });

  console.log('✅ Created MentoringActivity');

  // Create CertificationActivity
  await prisma.certificationActivity.upsert({
    where: {
      id: '550e8400-e29b-41d4-a716-44665544000d',
    },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-44665544000d',
      activityId: certificationActivity.id,
      certificationName: 'AWS Certified Solutions Architect',
      topics: [
        'Cloud Architecture',
        'AWS Services (EC2, S3, RDS, Lambda)',
        'System Design',
        'Scalability and High Availability',
        'Security Best Practices',
      ],
      outcomes: 'Certificação obtida com sucesso, conhecimentos aplicáveis ao projeto',
      rating: 4,
      nextSteps: [
        'Aplicar conceitos de HA no projeto atual',
        'Propor migração de serviços para Lambda',
        'Estudar AWS Well-Architected Framework',
        'Preparar workshop sobre AWS para o time',
      ],
    },
  });

  console.log('✅ Created CertificationActivity');
}
