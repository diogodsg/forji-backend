import { PrismaClient, User, Workspace } from '@prisma/client';

export async function seedGamification(prisma: PrismaClient, users: User[], acmeTech: Workspace) {
  console.log('🎮 Seeding gamification profiles...');

  const [diego, ana, carlos, maria, joao] = users;

  const gamificationProfiles = await Promise.all([
    prisma.gamificationProfile.upsert({
      where: {
        unique_user_workspace_gamification: {
          userId: diego.id,
          workspaceId: acmeTech.id,
        },
      },
      update: {},
      create: {
        userId: diego.id,
        workspaceId: acmeTech.id,
        level: 12,
        currentXP: 2840,
        totalXP: 15420,
        streak: 7,
        lastActiveAt: new Date(),
      },
    }),
    prisma.gamificationProfile.upsert({
      where: {
        unique_user_workspace_gamification: {
          userId: ana.id,
          workspaceId: acmeTech.id,
        },
      },
      update: {},
      create: {
        userId: ana.id,
        workspaceId: acmeTech.id,
        level: 8,
        currentXP: 1250,
        totalXP: 8500,
        streak: 3,
        lastActiveAt: new Date(),
      },
    }),
    prisma.gamificationProfile.upsert({
      where: {
        unique_user_workspace_gamification: {
          userId: carlos.id,
          workspaceId: acmeTech.id,
        },
      },
      update: {},
      create: {
        userId: carlos.id,
        workspaceId: acmeTech.id,
        level: 10,
        currentXP: 1800,
        totalXP: 11200,
        streak: 14,
        lastActiveAt: new Date(),
      },
    }),
    prisma.gamificationProfile.upsert({
      where: {
        unique_user_workspace_gamification: {
          userId: maria.id,
          workspaceId: acmeTech.id,
        },
      },
      update: {},
      create: {
        userId: maria.id,
        workspaceId: acmeTech.id,
        level: 15,
        currentXP: 3100,
        totalXP: 22500,
        streak: 21,
        lastActiveAt: new Date(),
      },
    }),
    prisma.gamificationProfile.upsert({
      where: {
        unique_user_workspace_gamification: {
          userId: joao.id,
          workspaceId: acmeTech.id,
        },
      },
      update: {},
      create: {
        userId: joao.id,
        workspaceId: acmeTech.id,
        level: 5,
        currentXP: 420,
        totalXP: 3200,
        streak: 2,
        lastActiveAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Created gamification profiles');

  // Create badges
  await prisma.badge.createMany({
    data: [
      // Diego's badges
      {
        gamificationProfileId: gamificationProfiles[0].id,
        type: 'STREAK_7',
        name: '7 Dias de Fogo 🔥',
        description: 'Manteve streak de 7 dias consecutivos',
      },
      {
        gamificationProfileId: gamificationProfiles[0].id,
        type: 'MENTOR',
        name: 'Mentor Dedicado 🎓',
        description: 'Realizou 5 sessões de mentoria',
      },
      {
        gamificationProfileId: gamificationProfiles[0].id,
        type: 'TEAM_PLAYER',
        name: 'Jogador de Equipe 🤝',
        description: 'Realizou 10 reuniões 1:1',
      },
      // Maria's badges
      {
        gamificationProfileId: gamificationProfiles[3].id,
        type: 'STREAK_7',
        name: '7 Dias de Fogo 🔥',
        description: 'Manteve streak de 7 dias consecutivos',
      },
      {
        gamificationProfileId: gamificationProfiles[3].id,
        type: 'GOAL_MASTER',
        name: 'Mestre das Metas 🎯',
        description: 'Completou 10 metas',
      },
      {
        gamificationProfileId: gamificationProfiles[3].id,
        type: 'CERTIFIED',
        name: 'Certificado 📜',
        description: 'Obteve 3 certificações',
      },
      // Carlos's badges
      {
        gamificationProfileId: gamificationProfiles[2].id,
        type: 'STREAK_7',
        name: '7 Dias de Fogo 🔥',
        description: 'Manteve streak de 7 dias consecutivos',
      },
      {
        gamificationProfileId: gamificationProfiles[2].id,
        type: 'FAST_LEARNER',
        name: 'Aprendiz Rápido 🚀',
        description: 'Subiu 3 níveis em uma competência',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created badges');
}
