import { useState, useEffect } from "react";
import type {
  Team,
  ManagerTeamOverview,
  AdminCompanyOverview,
  TeamAlert,
} from "../types";

// Mock data para gestores
const mockManagerTeams: Team[] = [
  {
    id: "team-backend",
    name: "Backend Team",
    members: [],
    managerId: "current-manager",
    managerName: "Você",
    totalXP: 15200,
    averageLevel: 42,
    streakDays: 15,
    badges: [],
    performanceScore: 85,
    activePDIs: 10,
    completedMilestones: 28,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "team-frontend",
    name: "Frontend Team",
    members: [],
    managerId: "current-manager",
    managerName: "Você",
    totalXP: 12450,
    averageLevel: 38,
    streakDays: 12,
    badges: [],
    performanceScore: 78,
    activePDIs: 8,
    completedMilestones: 23,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "team-mobile",
    name: "Mobile Team",
    members: [],
    managerId: "current-manager",
    managerName: "Você",
    totalXP: 6550,
    averageLevel: 28,
    streakDays: 8,
    badges: [],
    performanceScore: 65,
    activePDIs: 6,
    completedMilestones: 15,
    createdAt: new Date("2024-01-01"),
  },
];

// Mock data para admins
const mockAllTeams: Team[] = [
  ...mockManagerTeams,
  {
    id: "team-design",
    name: "Design Team",
    members: [],
    managerId: "other-manager",
    managerName: "Maria Costa",
    totalXP: 8200,
    averageLevel: 35,
    streakDays: 10,
    badges: [],
    performanceScore: 72,
    activePDIs: 6,
    completedMilestones: 18,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "team-qa",
    name: "QA Team",
    members: [],
    managerId: "other-manager-2",
    managerName: "João Oliveira",
    totalXP: 9800,
    averageLevel: 40,
    streakDays: 18,
    badges: [],
    performanceScore: 88,
    activePDIs: 8,
    completedMilestones: 25,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "team-devops",
    name: "DevOps Team",
    members: [],
    managerId: "other-manager-3",
    managerName: "Lucas Lima",
    totalXP: 7400,
    averageLevel: 45,
    streakDays: 20,
    badges: [],
    performanceScore: 92,
    activePDIs: 4,
    completedMilestones: 22,
    createdAt: new Date("2024-01-01"),
  },
];

export function useManagerTeams() {
  const [overview, setOverview] = useState<ManagerTeamOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagerOverview = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 600));

        const alerts: TeamAlert[] = [
          {
            id: "alert-1",
            type: "warning",
            message: "Mobile Team: Performance abaixo da média (65%)",
            teamId: "team-mobile",
            createdAt: new Date(),
            isRead: false,
          },
          {
            id: "alert-2",
            type: "warning",
            message: "Ana Paula: PDI sem update há 2 semanas",
            teamId: "team-frontend",
            memberId: "ana-paula",
            createdAt: new Date(),
            isRead: false,
          },
          {
            id: "alert-3",
            type: "info",
            message: "Carlos: Próximo de deadline importante",
            teamId: "team-backend",
            memberId: "carlos",
            createdAt: new Date(),
            isRead: false,
          },
        ];

        const mockOverview: ManagerTeamOverview = {
          teams: mockManagerTeams,
          totalMembers: 12,
          totalXP: 34200,
          averagePerformance: 76,
          teamsNeedingAttention: [mockManagerTeams[2]], // Mobile Team
          topPerformingTeam: mockManagerTeams[0], // Backend Team
          alerts,
        };

        setOverview(mockOverview);
      } catch (err) {
        setError("Erro ao carregar visão consolidada das equipes");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerOverview();
  }, []);

  return { overview, loading, error };
}

export function useAdminCompanyOverview() {
  const [overview, setOverview] = useState<AdminCompanyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyOverview = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockOverview: AdminCompanyOverview = {
          totalTeams: 8,
          totalEmployees: 45,
          totalXP: 125850,
          averageEngagement: 78,
          activePDIs: 87,
          systemHealth: {
            status: "online",
            adoptionRate: 89,
            activeUsers: 38,
            lastUpdateAt: new Date(),
          },
          topPerformingTeams: [
            mockAllTeams.find((t) => t.id === "team-devops")!,
            mockAllTeams.find((t) => t.id === "team-qa")!,
            mockAllTeams.find((t) => t.id === "team-backend")!,
          ],
          teamsNeedingAttention: [
            mockAllTeams.find((t) => t.id === "team-mobile")!,
          ],
        };

        setOverview(mockOverview);
      } catch (err) {
        setError("Erro ao carregar visão organizacional");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyOverview();
  }, []);

  return { overview, loading, error };
}

export function useAllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTeams(mockAllTeams);
      } catch (err) {
        setError("Erro ao carregar todas as equipes");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTeams();
  }, []);

  return { teams, loading, error };
}

// Hook para verificar se o manager tem apenas uma equipe
export function useManagerTeamCount() {
  const [teamCount, setTeamCount] = useState<number>(0);
  const [singleTeam, setSingleTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamCount = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Mock: simula manager com apenas 1 equipe
        const teams = mockManagerTeams.slice(0, 1); // Pega apenas a primeira equipe

        setTeamCount(teams.length);
        setSingleTeam(teams.length === 1 ? teams[0] : null);
      } catch (err) {
        console.error("Erro ao verificar equipes do manager:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamCount();
  }, []);

  return {
    teamCount,
    singleTeam,
    isSingleTeamManager: teamCount === 1,
    loading,
  };
}
