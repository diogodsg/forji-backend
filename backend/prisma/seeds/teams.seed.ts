import { PrismaClient, User, Workspace } from '@prisma/client';

export async function seedTeams(prisma: PrismaClient, users: User[], acmeTech: Workspace) {
  console.log('👨‍💼 Seeding teams...');

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

  console.log('✅ Created 4 teams');

  // Add team members
  const [diego, ana, carlos, maria, joao] = users;

  await Promise.all([
    // Diego (Manager) - Frontend & Backend teams
    prisma.teamMember.upsert({
      where: { unique_user_team: { userId: diego.id, teamId: frontendTeam.id } },
      update: {},
      create: { userId: diego.id, teamId: frontendTeam.id, role: 'MANAGER' },
    }),
    prisma.teamMember.upsert({
      where: { unique_user_team: { userId: diego.id, teamId: backendTeam.id } },
      update: {},
      create: { userId: diego.id, teamId: backendTeam.id, role: 'MANAGER' },
    }),
    // Ana - Frontend team
    prisma.teamMember.upsert({
      where: { unique_user_team: { userId: ana.id, teamId: frontendTeam.id } },
      update: {},
      create: { userId: ana.id, teamId: frontendTeam.id, role: 'MEMBER' },
    }),
    // Carlos - Backend team
    prisma.teamMember.upsert({
      where: { unique_user_team: { userId: carlos.id, teamId: backendTeam.id } },
      update: {},
      create: { userId: carlos.id, teamId: backendTeam.id, role: 'MEMBER' },
    }),
    // Maria (Manager) - Design team
    prisma.teamMember.upsert({
      where: { unique_user_team: { userId: maria.id, teamId: designTeam.id } },
      update: {},
      create: { userId: maria.id, teamId: designTeam.id, role: 'MANAGER' },
    }),
    // João - DevOps team
    prisma.teamMember.upsert({
      where: { unique_user_team: { userId: joao.id, teamId: devopsTeam.id } },
      update: {},
      create: { userId: joao.id, teamId: devopsTeam.id, role: 'MEMBER' },
    }),
  ]);

  console.log('✅ Created team memberships');

  return { frontendTeam, backendTeam, designTeam, devopsTeam };
}

export async function seedManagementRules(
  prisma: PrismaClient,
  users: User[],
  acmeTech: Workspace,
  teams: { frontendTeam: any; designTeam: any },
) {
  console.log('📋 Seeding management rules...');

  const [diego, ana, carlos, maria] = users;
  const { frontendTeam, designTeam } = teams;

  await Promise.all([
    // Diego manages Ana (individual)
    prisma.managementRule.upsert({
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
    }),
    // Diego manages Carlos (individual)
    prisma.managementRule.upsert({
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
    }),
    // Diego manages Frontend team
    prisma.managementRule.upsert({
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
    }),
    // Maria manages Design team
    prisma.managementRule.upsert({
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
    }),
  ]);

  console.log('✅ Created management rules');
}
