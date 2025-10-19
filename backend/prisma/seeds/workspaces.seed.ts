import { PrismaClient, User, Workspace } from '@prisma/client';

export async function seedWorkspaces(prisma: PrismaClient) {
  console.log('🏢 Seeding workspaces...');

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
  return { acmeTech, startupLab };
}

export async function seedWorkspaceMembers(
  prisma: PrismaClient,
  users: User[],
  workspaces: { acmeTech: Workspace; startupLab: Workspace },
) {
  console.log('👥 Seeding workspace members...');

  const [diego, ana, carlos, maria, joao] = users;
  const { acmeTech, startupLab } = workspaces;

  // Acme Tech members
  await Promise.all([
    prisma.workspaceMember.upsert({
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
    }),
    prisma.workspaceMember.upsert({
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
    }),
    prisma.workspaceMember.upsert({
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
    }),
    prisma.workspaceMember.upsert({
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
    }),
    prisma.workspaceMember.upsert({
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
    }),
    // Startup Lab members
    prisma.workspaceMember.upsert({
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
    }),
    prisma.workspaceMember.upsert({
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
    }),
  ]);

  console.log('✅ Created workspace memberships');
}
