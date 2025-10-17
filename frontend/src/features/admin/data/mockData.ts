import type { AdminUser } from "../types";
import type { ManagementRule } from "../../management/types";

export const mockUsers: AdminUser[] = [
  {
    id: 1,
    name: "Diego Santos",
    email: "diego@forge.com",
    isAdmin: true,
    position: "Tech Lead",
    bio: "Líder técnico com experiência em desenvolvimento full-stack",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    managers: [{ id: 1 }],
    reports: [{ id: 3 }, { id: 4 }, { id: 8 }],
  },
  {
    id: 2,
    name: "Maria da Silva Sauro",
    email: "maria@forge.com",
    isAdmin: false,
    position: "Product Manager",
    bio: "Gerente de produto focada em UX e estratégia",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    managers: [{ id: 1 }],
    reports: [{ id: 5 }],
  },
  {
    id: 3,
    name: "Ana Silva",
    email: "ana@forge.com",
    isAdmin: false,
    position: "Developer",
    bio: "Desenvolvedora especialista em React e TypeScript",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
    managers: [{ id: 1 }],
    reports: [],
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    email: "carlos@forge.com",
    isAdmin: false,
    position: "Frontend Developer",
    bio: "Desenvolvedor frontend com foco em performance e acessibilidade",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
    managers: [{ id: 1 }],
    reports: [],
  },
  {
    id: 5,
    name: "Pedro Costa",
    email: "pedro@forge.com",
    isAdmin: false,
    position: "UX Designer",
    bio: "Designer UX/UI especialista em design systems",
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
    managers: [{ id: 2 }],
    reports: [],
  },
  {
    id: 6,
    name: "Julia Ferreira",
    email: "julia@forge.com",
    isAdmin: false,
    position: "Backend Developer",
    bio: "Desenvolvedora backend com experiência em Node.js e PostgreSQL",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    managers: [],
    reports: [],
  },
  {
    id: 7,
    name: "Roberto Mendes",
    email: "roberto@forge.com",
    isAdmin: false,
    position: "DevOps Engineer",
    bio: "Engenheiro DevOps especialista em Docker e Kubernetes",
    createdAt: "2024-01-21T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
    managers: [],
    reports: [],
  },
  {
    id: 8,
    name: "Fernanda Lima",
    email: "fernanda@forge.com",
    isAdmin: false,
    position: "QA Engineer",
    bio: "Engenheira de qualidade com foco em automação de testes",
    createdAt: "2024-01-22T10:00:00Z",
    updatedAt: "2024-01-22T10:00:00Z",
    managers: [{ id: 1 }],
    reports: [],
  },
];

// Mock function para simular a busca de usuários
export function getMockUsers(): AdminUser[] {
  return mockUsers;
}

// Mock function para buscar usuário por ID
export function getMockUserById(id: number): AdminUser | undefined {
  return mockUsers.find((user) => user.id === id);
}

// ------------------------------
// Times e Regras de Gestão (mock)
// ------------------------------

import type { TeamSummary, TeamDetail, TeamMetrics } from "../types/team";

export const mockTeams: TeamSummary[] = [
  {
    id: 101,
    name: "Frontend",
    description: "Equipe responsável pelo desenvolvimento da interface",
    members: 5,
    managers: 1,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: 102,
    name: "Backend",
    description: "Equipe de desenvolvimento de APIs e serviços",
    members: 4,
    managers: 1,
    createdAt: "2024-01-11T10:00:00Z",
  },
  {
    id: 103,
    name: "Produto",
    description: "Equipe de gestão de produto e estratégia",
    members: 3,
    managers: 1,
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: 104,
    name: "QA",
    description: "Equipe de qualidade e testes",
    members: 2,
    managers: 0,
    createdAt: "2024-01-13T10:00:00Z",
  },
];

export const mockTeamDetails: Record<number, TeamDetail> = {
  101: {
    id: 101,
    name: "Frontend",
    description: "Equipe responsável pelo desenvolvimento da interface",
    memberships: [
      {
        user: {
          id: 1,
          name: "Diego Santos",
          email: "diego@forge.com",
        },
        role: "MANAGER",
      },
      {
        user: {
          id: 3,
          name: "Ana Silva",
          email: "ana@forge.com",
        },
        role: "MEMBER",
      },
      {
        user: {
          id: 4,
          name: "Carlos Oliveira",
          email: "carlos@forge.com",
        },
        role: "MEMBER",
      },
    ],
  },
  102: {
    id: 102,
    name: "Backend",
    description: "Equipe de desenvolvimento de APIs e serviços",
    memberships: [
      {
        user: {
          id: 1,
          name: "Diego Santos",
          email: "diego@forge.com",
        },
        role: "MANAGER",
      },
    ],
  },
  103: {
    id: 103,
    name: "Produto",
    description: "Equipe de gestão de produto e estratégia",
    memberships: [
      {
        user: {
          id: 2,
          name: "Maria da Silva Sauro",
          email: "maria@forge.com",
        },
        role: "MANAGER",
      },
      {
        user: {
          id: 5,
          name: "Paula Souza",
          email: "paula@forge.com",
        },
        role: "MEMBER",
      },
    ],
  },
  104: {
    id: 104,
    name: "QA",
    description: "Equipe de qualidade e testes",
    memberships: [],
  },
};

export const mockTeamMetrics: TeamMetrics = {
  totalTeams: 4,
  totalManagers: 3,
  totalMembers: 6,
  usersWithoutTeam: 3,
  lastTeamCreatedAt: "2024-01-13T10:00:00Z",
};

// Regras por equipe pré-definidas
const teamRulesByManager: Record<number, number[]> = {
  // Diego
  1: [101, 102, 104],
  // Maria
  2: [103],
};

function buildIndividualRulesForManager(managerId: number): ManagementRule[] {
  const manager = getMockUserById(managerId);
  if (!manager) return [];
  return (manager.reports || []).map((rep, idx) => {
    const subordinate = getMockUserById(rep.id);
    return {
      id: Number(`${managerId}00${idx}`),
      ruleType: "INDIVIDUAL",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      managerId,
      subordinateId: subordinate?.id,
      subordinate: subordinate
        ? {
            id: subordinate.id,
            name: subordinate.name,
            email: subordinate.email,
          }
        : undefined,
    } as ManagementRule;
  });
}

function buildTeamRulesForManager(managerId: number): ManagementRule[] {
  const teamIds = teamRulesByManager[managerId] || [];
  return teamIds.map((teamId, idx) => {
    const team = mockTeams.find((t) => t.id === teamId);
    return {
      id: Number(`${managerId}10${idx}`),
      ruleType: "TEAM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      managerId,
      teamId: team?.id,
      team: team ? { id: team.id, name: team.name } : undefined,
    } as ManagementRule;
  });
}

export function getMockManagementRulesByManagerId(
  managerId: number
): ManagementRule[] {
  return [
    ...buildTeamRulesForManager(managerId),
    ...buildIndividualRulesForManager(managerId),
  ];
}

export function getMockTeams(): TeamSummary[] {
  return JSON.parse(JSON.stringify(mockTeams));
}

export function getMockTeamById(id: number): TeamDetail | undefined {
  const team = mockTeamDetails[id];
  return team ? JSON.parse(JSON.stringify(team)) : undefined;
}

export function getMockTeamMetrics(): TeamMetrics {
  return JSON.parse(JSON.stringify(mockTeamMetrics));
}
