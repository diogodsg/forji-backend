import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // Create users
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

  const [diego, ana, carlos, maria, joao] = users;
  console.log('✅ Created 5 users');

  // Create workspaces
  const acmeTech = await prisma.workspace.upsert({
    where: { slug: 'acme-tech' },
    update: {},
    create: {
      name: 'Acme Tech',
      slug: 'acme-tech',
      description: 'Main technology workspace',
      status: 'ACTIVE',
    },
  });

  const startupLab = await prisma.workspace.upsert({
    where: { slug: 'startup-lab' },
    update: {},
    create: {
      name: 'Startup Lab',
      slug: 'startup-lab',
      description: 'Innovation and experimentation workspace',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created 2 workspaces');

  // Create workspace memberships
  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: diego.id,
        workspaceId: acmeTech.id,
      },
    },
    update: {},
    create: {
      userId: diego.id,
      workspaceId: acmeTech.id,
      role: 'OWNER',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: ana.id,
        workspaceId: acmeTech.id,
      },
    },
    update: {},
    create: {
      userId: ana.id,
      workspaceId: acmeTech.id,
      role: 'ADMIN',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: carlos.id,
        workspaceId: acmeTech.id,
      },
    },
    update: {},
    create: {
      userId: carlos.id,
      workspaceId: acmeTech.id,
      role: 'MEMBER',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: maria.id,
        workspaceId: acmeTech.id,
      },
    },
    update: {},
    create: {
      userId: maria.id,
      workspaceId: acmeTech.id,
      role: 'ADMIN',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: joao.id,
        workspaceId: acmeTech.id,
      },
    },
    update: {},
    create: {
      userId: joao.id,
      workspaceId: acmeTech.id,
      role: 'MEMBER',
    },
  });

  // Add some users to second workspace
  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: diego.id,
        workspaceId: startupLab.id,
      },
    },
    update: {},
    create: {
      userId: diego.id,
      workspaceId: startupLab.id,
      role: 'OWNER',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      unique_user_workspace: {
        userId: carlos.id,
        workspaceId: startupLab.id,
      },
    },
    update: {},
    create: {
      userId: carlos.id,
      workspaceId: startupLab.id,
      role: 'MEMBER',
    },
  });

  console.log('✅ Created workspace memberships');

  // Create teams in Acme Tech workspace
  const frontendTeam = await prisma.team.upsert({
    where: {
      unique_workspace_team_name: {
        workspaceId: acmeTech.id,
        name: 'Frontend',
      },
    },
    update: {},
    create: {
      name: 'Frontend',
      description: 'Time responsável pela interface e experiência do usuário',
      status: 'ACTIVE',
      workspaceId: acmeTech.id,
    },
  });

  const backendTeam = await prisma.team.upsert({
    where: {
      unique_workspace_team_name: {
        workspaceId: acmeTech.id,
        name: 'Backend',
      },
    },
    update: {},
    create: {
      name: 'Backend',
      description: 'Time responsável pela API e infraestrutura de dados',
      status: 'ACTIVE',
      workspaceId: acmeTech.id,
    },
  });

  const designTeam = await prisma.team.upsert({
    where: {
      unique_workspace_team_name: {
        workspaceId: acmeTech.id,
        name: 'Design',
      },
    },
    update: {},
    create: {
      name: 'Design',
      description: 'Time responsável pelo design e identidade visual',
      status: 'ACTIVE',
      workspaceId: acmeTech.id,
    },
  });

  const devopsTeam = await prisma.team.upsert({
    where: {
      unique_workspace_team_name: {
        workspaceId: acmeTech.id,
        name: 'DevOps',
      },
    },
    update: {},
    create: {
      name: 'DevOps',
      description: 'Time responsável por infraestrutura e deployments',
      status: 'ACTIVE',
      workspaceId: acmeTech.id,
    },
  });

  const teams = [frontendTeam, backendTeam, designTeam, devopsTeam];

  console.log(`✅ Created ${teams.length} teams in Acme Tech`);

  // Add team members
  // Diego (Manager) - Frontend & Backend teams
  await prisma.teamMember.upsert({
    where: { unique_user_team: { userId: users[0].id, teamId: teams[0].id } },
    update: {},
    create: {
      userId: users[0].id,
      teamId: teams[0].id,
      role: 'MANAGER',
    },
  });

  await prisma.teamMember.upsert({
    where: { unique_user_team: { userId: users[0].id, teamId: teams[1].id } },
    update: {},
    create: {
      userId: users[0].id,
      teamId: teams[1].id,
      role: 'MANAGER',
    },
  });

  // Ana - Frontend team
  await prisma.teamMember.upsert({
    where: { unique_user_team: { userId: users[1].id, teamId: teams[0].id } },
    update: {},
    create: {
      userId: users[1].id,
      teamId: teams[0].id,
      role: 'MEMBER',
    },
  });

  // Carlos - Backend team
  await prisma.teamMember.upsert({
    where: { unique_user_team: { userId: users[2].id, teamId: teams[1].id } },
    update: {},
    create: {
      userId: users[2].id,
      teamId: teams[1].id,
      role: 'MEMBER',
    },
  });

  // Maria (Manager) - Design team
  await prisma.teamMember.upsert({
    where: { unique_user_team: { userId: users[3].id, teamId: teams[2].id } },
    update: {},
    create: {
      userId: users[3].id,
      teamId: teams[2].id,
      role: 'MANAGER',
    },
  });

  // João - DevOps team
  await prisma.teamMember.upsert({
    where: { unique_user_team: { userId: users[4].id, teamId: teams[3].id } },
    update: {},
    create: {
      userId: users[4].id,
      teamId: teams[3].id,
      role: 'MEMBER',
    },
  });

  console.log('✅ Created team memberships');

  // Create management rules in Acme Tech workspace
  // Diego manages Ana (individual)
  await prisma.managementRule.upsert({
    where: {
      unique_workspace_manager_subordinate_rule: {
        workspaceId: acmeTech.id,
        managerId: diego.id,
        subordinateId: ana.id,
        ruleType: 'INDIVIDUAL',
      },
    },
    update: {},
    create: {
      workspaceId: acmeTech.id,
      managerId: diego.id,
      subordinateId: ana.id,
      ruleType: 'INDIVIDUAL',
    },
  });

  // Diego manages Carlos (individual)
  await prisma.managementRule.upsert({
    where: {
      unique_workspace_manager_subordinate_rule: {
        workspaceId: acmeTech.id,
        managerId: diego.id,
        subordinateId: carlos.id,
        ruleType: 'INDIVIDUAL',
      },
    },
    update: {},
    create: {
      workspaceId: acmeTech.id,
      managerId: diego.id,
      subordinateId: carlos.id,
      ruleType: 'INDIVIDUAL',
    },
  });

  // Diego manages Frontend team
  await prisma.managementRule.upsert({
    where: {
      unique_workspace_manager_team_rule: {
        workspaceId: acmeTech.id,
        managerId: diego.id,
        teamId: frontendTeam.id,
        ruleType: 'TEAM',
      },
    },
    update: {},
    create: {
      workspaceId: acmeTech.id,
      managerId: diego.id,
      teamId: frontendTeam.id,
      ruleType: 'TEAM',
    },
  });

  // Maria manages Design team
  await prisma.managementRule.upsert({
    where: {
      unique_workspace_manager_team_rule: {
        workspaceId: acmeTech.id,
        managerId: maria.id,
        teamId: designTeam.id,
        ruleType: 'TEAM',
      },
    },
    update: {},
    create: {
      workspaceId: acmeTech.id,
      managerId: maria.id,
      teamId: designTeam.id,
      ruleType: 'TEAM',
    },
  });

  console.log('✅ Created management rules');

  console.log('🎉 Seed completed!');
  console.log('\n📧 Login credentials:');
  console.log('   Email: diego@forge.com | Password: senha123 (Admin)');
  console.log('   Email: ana@forge.com | Password: senha123');
  console.log('   Email: carlos@forge.com | Password: senha123');
  console.log('   Email: maria@forge.com | Password: senha123 (Manager)');
  console.log('   Email: joao@forge.com | Password: senha123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
