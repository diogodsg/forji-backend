import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedWorkspaces, seedWorkspaceMembers } from './seeds/workspaces.seed';
import { seedTeams, seedManagementRules } from './seeds/teams.seed';
import { seedGamification } from './seeds/gamification.seed';
import { seedCycles, seedGoals, seedCompetencies } from './seeds/pdi.seed';
import { seedActivities } from './seeds/activities.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. Create users
  const users = await seedUsers(prisma);
  const [diego, ana, carlos, maria, joao] = users;

  // 2. Create workspaces
  const { acmeTech, startupLab } = await seedWorkspaces(prisma);

  // 3. Create workspace memberships
  await seedWorkspaceMembers(prisma, users, { acmeTech, startupLab });

  // 4. Create teams
  const teams = await seedTeams(prisma, users, acmeTech);

  // 5. Create management rules
  await seedManagementRules(prisma, users, acmeTech, teams);

  // 6. Create gamification profiles and badges
  await seedGamification(prisma, users, acmeTech);

  // 7. Create cycle for Diego
  const cycle = await seedCycles(prisma, diego, acmeTech);

  // 8. Create goals for Diego
  await seedGoals(prisma, cycle, diego);

  // 9. Create competencies for Diego
  await seedCompetencies(prisma, cycle, diego);

  // 10. Create activities
  await seedActivities(prisma, cycle, diego);

  console.log('\n🎉 Seed completed!');
  console.log('\n📧 Login credentials:');
  console.log('   Email: diego@forge.com | Password: senha123 (Admin)');
  console.log('   Email: ana@forge.com | Password: senha123');
  console.log('   Email: carlos@forge.com | Password: senha123');
  console.log('   Email: maria@forge.com | Password: senha123 (Manager)');
  console.log('   Email: joao@forge.com | Password: senha123\n');
  console.log('🎮 Gamification & PDI System:');
  console.log('   ✅ Gamification profiles created for all users');
  console.log('   ✅ Badges assigned');
  console.log('   ✅ Active cycle: Ciclo Q1 2024 - Desenvolvimento Backend');
  console.log('   ✅ 4 goals created for Diego');
  console.log('   ✅ 3 competencies created for Diego');
  console.log('   ✅ 3 activities created (1:1, Mentoring, Certification)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
