import { useState, useEffect } from "react";
import type { Team, TeamMember, TeamMetrics } from "../types";

// Mock data para desenvolvimento
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    level: 48,
    xp: 2800,
    role: "Senior Developer",
    badges: [],
    isOnline: true,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@example.com",
    level: 32,
    xp: 1950,
    role: "Mid Designer",
    badges: [],
    isOnline: false,
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@example.com",
    level: 41,
    xp: 2100,
    role: "Frontend Developer",
    badges: [],
    isOnline: true,
  },
  {
    id: "4",
    name: "Ana Paula",
    email: "ana@example.com",
    level: 29,
    xp: 1600,
    role: "Junior Developer",
    badges: [],
    isOnline: true,
  },
];

const mockTeam: Team = {
  id: "team-1",
  name: "Equipe de Desenvolvimento Frontend",
  description: "Time líder pelo desenvolvimento da interface web",
  members: mockTeamMembers,
  managerId: "manager-1",
  managerName: "Carlos Mendes",
  totalXP: 12450,
  averageLevel: 37.5,
  streakDays: 12,
  badges: [
    {
      id: "badge-1",
      name: "Team Sprint Master",
      description: "Sprint completo em equipe",
      icon: "🏆",
      earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // há 2 dias
      type: "collaborative",
    },
    {
      id: "badge-2",
      name: "Collaboration Badge",
      description: "10 feedbacks dados entre a equipe",
      icon: "🤝",
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // há 1 semana
      type: "collaborative",
    },
    {
      id: "badge-3",
      name: "Growth Together",
      description: "Todos os membros melhoraram PDI",
      icon: "📈",
      earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // há 2 semanas
      type: "collaborative",
    },
  ],
  performanceScore: 78,
  activePDIs: 8,
  completedMilestones: 23,
  createdAt: new Date("2024-01-01"),
};

export function useMyTeam() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula chamada de API
    const fetchTeam = async () => {
      try {
        setLoading(true);
        // Simula delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTeam(mockTeam);
      } catch (err) {
        setError("Erro ao carregar dados da equipe");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return { team, loading, error };
}

export function useTeamMembers(teamId?: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setMembers(mockTeamMembers);
      } catch (err) {
        setError("Erro ao carregar membros da equipe");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  return { members, loading, error };
}

export function useTeamMetrics(teamId?: string) {
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const mockMetrics: TeamMetrics = {
          totalXP: 12450,
          averageXP: 2490,
          weeklyGrowth: 850,
          monthlyGrowth: 3200,
          performanceScore: 78,
          engagementRate: 85,
          activeMembersCount: 4,
          completedChallenges: 3,
          ranking: {
            position: 3,
            totalTeams: 12,
            trend: "up",
          },
        };

        setMetrics(mockMetrics);
      } catch (err) {
        setError("Erro ao carregar métricas da equipe");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [teamId]);

  return { metrics, loading, error };
}

// Export timeline and objectives hooks
export {
  useTeamTimeline,
  useTeamObjectives,
} from "./useTeamTimelineAndObjectives";

// Export personal data hooks
export { usePersonalContribution, useUpcomingActions } from "./usePersonalData";
