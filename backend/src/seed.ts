import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin se não existir
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@forge.com" },
    update: {},
    create: {
      email: "admin@forge.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      name: "Admin User",
      isAdmin: true,
    },
  });

  // Criar usuário teste
  const testUser = await prisma.user.upsert({
    where: { email: "test@forge.com" },
    update: {},
    create: {
      email: "test@forge.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      name: "Test User",
      position: "Software Developer",
      bio: "Test user for gamification system",
    },
  });

  // Criar times de exemplo
  const teamAlpha = await prisma.team.upsert({
    where: { name: "Team Alpha" },
    update: {},
    create: {
      name: "Team Alpha",
      description: "Equipe de desenvolvimento frontend",
    },
  });

  const teamBeta = await prisma.team.upsert({
    where: { name: "Team Beta" },
    update: {},
    create: {
      name: "Team Beta", 
      description: "Equipe de desenvolvimento backend",
    },
  });

  // Adicionar usuário teste ao Team Alpha
  await prisma.teamMembership.upsert({
    where: {
      teamId_userId: {
        teamId: teamAlpha.id,
        userId: testUser.id,
      },
    },
    update: {},
    create: {
      teamId: teamAlpha.id,
      userId: testUser.id,
      role: "MEMBER",
    },
  });

  // Criar perfil de gamificação para o usuário teste
  await prisma.gamificationProfile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      totalXP: 250,
      weeklyXP: 150,
    },
  });

  // Criar alguns badges de exemplo
  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: testUser.id,
        badgeId: "first_milestone",
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      badgeId: "first_milestone",
      name: "First Steps",
      description: "Complete seu primeiro milestone de PDI",
      icon: "🎯",
      rarity: "common",
      category: "development",
    },
  });

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: testUser.id,
        badgeId: "team_player",
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      badgeId: "team_player",
      name: "Team Player",
      description: "Participe de 5 atividades colaborativas",
      icon: "🤝",
      rarity: "common",
      category: "collaboration",
    },
  });

  // Criar histórico de XP
  await prisma.xpHistory.createMany({
    data: [
      {
        userId: testUser.id,
        action: "pdi_milestone_completed",
        points: 100,
        category: "development",
        description: "Completed first PDI milestone",
      },
      {
        userId: testUser.id,
        action: "daily_activity",
        points: 50,
        category: "learning",
        description: "Daily activity completion",
      },
      {
        userId: testUser.id,
        action: "peer_feedback_given",
        points: 25,
        category: "collaboration",
        description: "Gave constructive feedback",
      },
      {
        userId: testUser.id,
        action: "login_daily",
        points: 25,
        category: "learning",
        description: "Daily platform engagement",
      },
    ],
    skipDuplicates: true,
  });

  console.log({ adminUser, testUser });
  console.log("Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
