import { useState } from "react";
import { TeamHealthOverview } from "./TeamHealthOverview";
import { PriorityActionsCard } from "./PriorityActionsCard";
import { TeamMembersGrid } from "./TeamMembersGrid";
import { TeamAnalytics } from "./TeamAnalytics";
import { ManagerCalendar } from "./ManagerCalendar";

interface ManagerDashboardProps {
  className?: string;
}

/**
 * Dashboard principal para managers - integra todos os componentes
 * Layout responsivo focado em team-first metrics e actionable insights
 */
export function ManagerDashboard({ className = "" }: ManagerDashboardProps) {
  // Mock data - em produção viria de APIs específicas
  const [teamHealthData] = useState({
    healthScore: 87,
    criticalAlerts: 2,
    weeklyProgress: {
      completed: 12,
      total: 15,
    },
    teamStats: {
      totalMembers: 8,
      activePDIs: 6,
      upcomingReviews: 3,
    },
  });

  const [priorityActions] = useState([
    {
      id: "joao-no-update",
      type: "critical" as const,
      person: "João Silva",
      title: "Sem atualização há 8 dias",
      description:
        "Último update no PDI foi na semana passada. Pode estar com dificuldades ou sobrecarga.",
      urgency: "today" as const,
      quickActions: {
        primary: {
          label: "Agendar 1:1",
          action: () => console.log("Agendar 1:1 com João"),
        },
        secondary: {
          label: "Enviar check-in",
          action: () => console.log("Enviar check-in para João"),
        },
      },
    },
    {
      id: "maria-goal-behind",
      type: "attention" as const,
      person: "Maria Santos",
      title: "Meta Q4 com atraso",
      description:
        "Certificação React estava programada para esta semana, mas ainda está em 60%.",
      urgency: "this-week" as const,
      quickActions: {
        primary: {
          label: "Revisar escopo",
          action: () => console.log("Revisar escopo da meta da Maria"),
        },
        secondary: {
          label: "Oferecer ajuda",
          action: () => console.log("Oferecer ajuda à Maria"),
        },
      },
    },
    {
      id: "carlos-certification",
      type: "celebrate" as const,
      person: "Carlos Lima",
      title: "Completou certificação AWS",
      description:
        "Finalizou o curso de Solutions Architect com 92% de aproveitamento.",
      quickActions: {
        primary: {
          label: "Reconhecer publicamente",
          action: () => console.log("Reconhecer Carlos publicamente"),
        },
        secondary: {
          label: "Atualizar perfil",
          action: () => console.log("Atualizar skill profile do Carlos"),
        },
      },
    },
  ]);

  const [teamMembers] = useState([
    {
      id: "1",
      name: "João Silva",
      role: "Senior Developer",
      status: "needs-attention" as const,
      pdiProgress: 65,
      lastUpdate: "2024-10-07",
      issues: ["Sem updates há 8 dias", "Meta de Q4 em risco"],
    },
    {
      id: "2",
      name: "Maria Santos",
      role: "Tech Lead",
      status: "on-track" as const,
      pdiProgress: 82,
      lastUpdate: "2024-10-13",
    },
    {
      id: "3",
      name: "Carlos Lima",
      role: "Full Stack Developer",
      status: "exceeding" as const,
      pdiProgress: 95,
      lastUpdate: "2024-10-14",
      achievements: ["Certificação AWS concluída", "Mentorou 2 júniors"],
    },
    {
      id: "4",
      name: "Ana Costa",
      role: "Frontend Developer",
      status: "on-track" as const,
      pdiProgress: 78,
      lastUpdate: "2024-10-12",
    },
  ]);

  const [analyticsData] = useState({
    xpTrend: {
      current: 3240,
      previous: 2890,
      change: 12.1,
    },
    goalCompletion: {
      completed: 12,
      total: 15,
      weeklyRate: 80,
    },
    engagement: {
      score: 8.3,
      trend: "up" as const,
      activities: 12,
    },
    topSkills: [
      { skill: "React Advanced", members: 3, progress: 78 },
      { skill: "AWS Solutions Architect", members: 2, progress: 65 },
      { skill: "TypeScript", members: 4, progress: 85 },
      { skill: "Node.js Performance", members: 2, progress: 55 },
    ],
  });

  const [calendarEvents] = useState([
    {
      id: "1",
      type: "review" as const,
      title: "Review PDI - João Silva",
      description: "Revisar progresso Q4 e ajustar metas",
      date: new Date(2024, 9, 16), // Tomorrow
      urgency: "tomorrow" as const,
      person: "João Silva",
      action: () => console.log("Abrir review do João"),
    },
    {
      id: "2",
      type: "meeting" as const,
      title: "Retrospectiva da Equipe",
      description: "Sprint review e planning da próxima semana",
      date: new Date(2024, 9, 18), // Friday
      urgency: "this-week" as const,
      action: () => console.log("Abrir retrospectiva"),
    },
    {
      id: "3",
      type: "deadline" as const,
      title: "Avaliação de promoção - Maria",
      description: "Finalizar documentação para comitê",
      date: new Date(2024, 9, 22), // Next week
      urgency: "next-week" as const,
      person: "Maria Santos",
      action: () => console.log("Abrir avaliação da Maria"),
    },
  ]);

  const [pendingApprovals] = useState([
    {
      id: "1",
      type: "pdi" as const,
      title: "Atualização PDI Q4 - Ana Costa",
      person: "Ana Costa",
      submittedDate: new Date(2024, 9, 12),
      urgency: "normal" as const,
      action: () => console.log("Aprovar PDI da Ana"),
    },
    {
      id: "2",
      type: "goal" as const,
      title: "Nova meta: Certificação Kubernetes",
      person: "Carlos Lima",
      submittedDate: new Date(2024, 9, 14),
      urgency: "normal" as const,
      action: () => console.log("Aprovar meta do Carlos"),
    },
    {
      id: "3",
      type: "skill-assessment" as const,
      title: "Auto-avaliação React Advanced",
      person: "Maria Santos",
      submittedDate: new Date(2024, 9, 10),
      urgency: "urgent" as const,
      action: () => console.log("Revisar assessment da Maria"),
    },
  ]);

  // Handlers para ações dos componentes
  const handleSchedule1on1 = (memberId: string) => {
    console.log(`Agendar 1:1 com membro ${memberId}`);
    // TODO: Implementar modal de agendamento
  };

  const handleSendMessage = (memberId: string) => {
    console.log(`Enviar mensagem para membro ${memberId}`);
    // TODO: Implementar sistema de mensagens
  };

  const handleViewDetails = (memberId: string) => {
    console.log(`Ver detalhes do membro ${memberId}`);
    // TODO: Navegar para perfil do membro
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-8 ${className}`}>
      {/* Hero Section - Team Health Overview */}
      <TeamHealthOverview
        healthScore={teamHealthData.healthScore}
        criticalAlerts={teamHealthData.criticalAlerts}
        weeklyProgress={teamHealthData.weeklyProgress}
        teamStats={teamHealthData.teamStats}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Priority Actions + Team Members */}
        <div className="xl:col-span-2 space-y-8">
          <PriorityActionsCard actions={priorityActions} />

          <TeamMembersGrid
            members={teamMembers}
            onSchedule1on1={handleSchedule1on1}
            onSendMessage={handleSendMessage}
            onViewDetails={handleViewDetails}
          />
        </div>

        {/* Right Column - Calendar */}
        <div className="space-y-8">
          <ManagerCalendar
            events={calendarEvents}
            pendingApprovals={pendingApprovals}
          />
        </div>
      </div>

      {/* Bottom Section - Team Analytics */}
      <TeamAnalytics data={analyticsData} />
    </div>
  );
}
