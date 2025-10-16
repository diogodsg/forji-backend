import { useMemo } from "react";
import type { PersonalContribution, UpcomingAction } from "../types";

// Mock data para contribuição pessoal
const generateMockPersonalContribution = (): PersonalContribution => {
  return {
    xpContributed: 3200,
    xpPercentageOfTeam: 18,
    mentorshipsSessions: 4,
    badgesEarned: 7,
    badgesHelpedTeamObjectives: 3,
    growthVsPreviousMonth: 24,
    streakDays: 12,
    rankInTeam: 2,
    totalTeamMembers: 6,
  };
};

// Mock data para próximas ações
const generateMockUpcomingActions = (): UpcomingAction[] => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "action-1",
      type: "badge_close",
      title: 'Badge "Senior Developer" quase seu!',
      description:
        "Você está a 340 XP de conquistar este badge. Complete mais 2 code reviews.",
      priority: "high",
      estimatedTime: "2-3 dias",
      metadata: {
        progressPercentage: 85,
        requiredXP: 340,
        skillArea: "Liderança Técnica",
      },
    },
    {
      id: "action-2",
      type: "pdi_milestone",
      title: 'Milestone "React Avançado" pendente',
      description:
        "Finalize o projeto de Context API para completar este marco.",
      priority: "medium",
      dueDate: nextWeek,
      estimatedTime: "5-8 horas",
      metadata: {
        progressPercentage: 70,
        skillArea: "Frontend Development",
      },
    },
    {
      id: "action-3",
      type: "mentorship_opportunity",
      title: "Pedro precisa de ajuda em TypeScript",
      description:
        "Ofereça uma sessão de mentoria para ajudar com tipos avançados.",
      priority: "medium",
      estimatedTime: "1-2 horas",
      relatedUserId: "user-pedro",
      relatedUserName: "Pedro Santos",
      metadata: {
        skillArea: "TypeScript",
      },
    },
    {
      id: "action-4",
      type: "feedback_pending",
      title: "Feedback de Maria Santos pendente",
      description: "Dê feedback sobre a apresentação da sprint review.",
      priority: "low",
      dueDate: twoWeeks,
      estimatedTime: "15 minutos",
      relatedUserId: "user-maria",
      relatedUserName: "Maria Santos",
    },
    {
      id: "action-5",
      type: "collaboration",
      title: "Pair programming com Ana Costa",
      description: "Sessão agendada para implementar testes automatizados.",
      priority: "medium",
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      estimatedTime: "2 horas",
      relatedUserId: "user-ana",
      relatedUserName: "Ana Costa",
      metadata: {
        skillArea: "Testing",
      },
    },
    {
      id: "action-6",
      type: "pdi_milestone",
      title: "Autoavaliação trimestral",
      description: "Complete sua autoavaliação de desenvolvimento do Q4.",
      priority: "high",
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      estimatedTime: "30 minutos",
      metadata: {
        progressPercentage: 0,
      },
    },
  ];
};

// Hook para contribuição pessoal
export function usePersonalContribution() {
  const contribution = useMemo(() => {
    return generateMockPersonalContribution();
  }, []);

  return {
    contribution,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}

// Hook para próximas ações
export function useUpcomingActions() {
  const actions = useMemo(() => {
    return generateMockUpcomingActions();
  }, []);

  // Filtra por prioridade
  const highPriorityActions = actions.filter(
    (action) => action.priority === "high"
  );
  const mediumPriorityActions = actions.filter(
    (action) => action.priority === "medium"
  );
  const lowPriorityActions = actions.filter(
    (action) => action.priority === "low"
  );

  // Filtra por tipo
  const pdiActions = actions.filter(
    (action) => action.type === "pdi_milestone"
  );
  const mentorshipActions = actions.filter(
    (action) => action.type === "mentorship_opportunity"
  );
  const badgeActions = actions.filter(
    (action) => action.type === "badge_close"
  );
  const feedbackActions = actions.filter(
    (action) => action.type === "feedback_pending"
  );

  return {
    actions,
    highPriorityActions,
    mediumPriorityActions,
    lowPriorityActions,
    pdiActions,
    mentorshipActions,
    badgeActions,
    feedbackActions,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}
