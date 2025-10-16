import { useMemo } from "react";
import type { TimelineEvent, TeamObjective } from "../types";

// Mock data para Timeline
const generateMockTimelineEvents = (teamId: string): TimelineEvent[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "1",
      type: "badge",
      title: 'João Silva conquistou "Code Master"',
      description: "Completou 50 commits com qualidade excepcional",
      userId: "user-1",
      userName: "João Silva",
      userAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      teamId,
      timestamp: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10h hoje
      metadata: { badgeId: "code-master" },
    },
    {
      id: "2",
      type: "objective",
      title: "Equipe alcançou meta de XP mensal",
      description: "20.000 XP coletivo conquistado antes do prazo",
      teamId,
      timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9h hoje
      metadata: { objectiveId: "monthly-xp", xpAmount: 20000 },
    },
    {
      id: "3",
      type: "collaboration",
      title: "Maria mentorou Pedro em React",
      description: "Sessão de pair programming focada em hooks avançados",
      userId: "user-2",
      userName: "Maria Santos",
      userAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b884?w=32&h=32&fit=crop&crop=face",
      teamId,
      timestamp: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000), // 14h ontem
      metadata: { menteeId: "user-3", skill: "React Hooks" },
    },
    {
      id: "4",
      type: "milestone",
      title: 'Ana completou milestone "Frontend Avançado"',
      description: "Domínio em TypeScript, Testing e Performance",
      userId: "user-4",
      userName: "Ana Costa",
      userAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      teamId,
      timestamp: new Date(yesterday.getTime() + 11 * 60 * 60 * 1000), // 11h ontem
      metadata: { milestoneId: "frontend-advanced" },
    },
    {
      id: "5",
      type: "xp",
      title: "+500 XP coletivo adicionado",
      description: "Sprint Review bem-sucedida com entregas de qualidade",
      teamId,
      timestamp: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000), // 16h ontem
      metadata: { xpAmount: 500, source: "sprint-review" },
    },
    {
      id: "6",
      type: "badge",
      title: 'Equipe desbloqueou "Team Collaboration"',
      description: "Todos os membros participaram de mentorias este mês",
      teamId,
      timestamp: new Date(twoDaysAgo.getTime() + 13 * 60 * 60 * 1000), // 13h há 2 dias
      metadata: { badgeId: "team-collaboration" },
    },
    {
      id: "7",
      type: "member",
      title: "Carlos Silva se juntou à equipe",
      description: "Bem-vindo ao time! Especialista em DevOps",
      userId: "user-5",
      userName: "Carlos Silva",
      userAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      teamId,
      timestamp: new Date(twoDaysAgo.getTime() + 9 * 60 * 60 * 1000), // 9h há 2 dias
      metadata: { role: "DevOps Engineer" },
    },
  ];
};

// Mock data para Objetivos
const generateMockObjectives = (teamId: string): TeamObjective[] => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nextQuarter = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "obj-1",
      title: "XP Coletivo Q4",
      description: "Alcançar 25.000 XP até final do trimestre",
      type: "xp",
      target: 25000,
      current: 18500,
      unit: "XP",
      deadline: nextQuarter,
      status: "active",
      createdBy: "manager-1",
      createdByName: "Roberto Manager",
      teamId,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "obj-2",
      title: "Badges Senior+",
      description: "Todos os membros com pelo menos 1 badge Senior",
      type: "badges",
      target: 5,
      current: 3,
      unit: "membros",
      deadline: nextMonth,
      status: "active",
      createdBy: "manager-1",
      createdByName: "Roberto Manager",
      teamId,
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "obj-3",
      title: "Feedbacks P2P",
      description: "Meta de 20 feedbacks peer-to-peer este mês",
      type: "collaboration",
      target: 20,
      current: 12,
      unit: "feedbacks",
      deadline: nextWeek,
      status: "active",
      createdBy: "manager-1",
      createdByName: "Roberto Manager",
      teamId,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "obj-4",
      title: "PDIs em Progresso",
      description: "Manter 100% dos PDIs com progresso positivo",
      type: "pdi",
      target: 100,
      current: 85,
      unit: "%",
      deadline: nextMonth,
      status: "active",
      createdBy: "manager-1",
      createdByName: "Roberto Manager",
      teamId,
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: "obj-5",
      title: "Engagement Score",
      description: "Meta anterior alcançada com sucesso!",
      type: "performance",
      target: 90,
      current: 92,
      unit: "%",
      deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Prazo já passou
      status: "completed",
      createdBy: "manager-1",
      createdByName: "Roberto Manager",
      teamId,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
  ];
};

// Hook para Timeline
export function useTeamTimeline(teamId: string) {
  const events = useMemo(() => {
    return generateMockTimelineEvents(teamId);
  }, [teamId]);

  return {
    events,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}

// Hook para Objetivos
export function useTeamObjectives(teamId: string) {
  const objectives = useMemo(() => {
    return generateMockObjectives(teamId);
  }, [teamId]);

  const activeObjectives = objectives.filter(
    (obj) => obj.status === "active" || obj.status === "overdue"
  );

  const completedObjectives = objectives.filter(
    (obj) => obj.status === "completed"
  );

  return {
    objectives,
    activeObjectives,
    completedObjectives,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}
