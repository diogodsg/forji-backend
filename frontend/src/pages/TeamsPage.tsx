import { useParams } from "react-router-dom";
import { Circle } from "lucide-react";

// Components
import { MyContribution } from "../features/teams/components/MyContribution";
import { UpcomingActions } from "../features/teams/components/UpcomingActions";
import { TeamTimeline } from "../features/teams/components/TeamTimeline";
import { TeamObjectives } from "../features/teams/components/TeamObjectives";
import { DebugRoleSwitcher, useDebugRole } from "@/shared";

// Hooks
import {
  usePersonalContribution,
  useUpcomingActions,
} from "../features/teams/hooks/usePersonalData";

export function TeamsPage() {
  const { teamId } = useParams<{ teamId?: string }>();

  // Debug: Hook para alternar entre papéis durante desenvolvimento
  const { debugRole, setDebugRole } = useDebugRole("collaborator");
  const effectiveRole = debugRole;

  // Helper function for status indicator
  const getStatusIndicator = (status: "online" | "away" | "offline") => {
    const colors = {
      online: "text-success-600",
      away: "text-warning-600",
      offline: "text-gray-500",
    };
    return <Circle className={`w-2 h-2 fill-current ${colors[status]}`} />;
  };

  // Personal data hooks
  const { contribution, isLoading: personalContributionLoading } =
    usePersonalContribution();
  const { actions, isLoading: upcomingActionsLoading } = useUpcomingActions();

  // Mock data
  const currentTeamId = teamId || "1";
  const timelineEvents = [
    {
      id: "1",
      type: "badge" as const,
      title: 'João conquistou badge "Code Master"',
      description: "Completou 50 pull requests com qualidade",
      timestamp: new Date("2024-10-10"),
      teamId: currentTeamId,
      userId: "user-1",
      userName: "João Silva",
      userAvatar: "/avatars/joao.jpg",
      metadata: { badgeId: "badge-1", xpAmount: 500 },
    },
    {
      id: "2",
      type: "collaboration" as const,
      title: "Ana iniciou mentoria com Carlos",
      description: "Foco em desenvolvimento frontend",
      timestamp: new Date("2024-10-09"),
      teamId: currentTeamId,
      userId: "user-2",
      userName: "Ana Costa",
      userAvatar: "/avatars/ana.jpg",
    },
    {
      id: "3",
      type: "xp" as const,
      title: "Equipe atingiu meta mensal",
      description: "120% da meta de XP coletivo",
      timestamp: new Date("2024-10-08"),
      teamId: currentTeamId,
      metadata: { xpAmount: 2500 },
    },
  ];

  const activeObjectives = [
    {
      id: "1",
      title: "Implementar sistema de notificações",
      description: "Desenvolver módulo completo de notificações push",
      type: "performance" as const,
      target: 100,
      current: 75,
      unit: "%",
      deadline: new Date("2024-10-20"),
      status: "active" as const,
      createdBy: "manager-1",
      createdByName: "Roberto Silva",
      teamId: currentTeamId,
      createdAt: new Date("2024-10-01"),
    },
    {
      id: "2",
      title: "Documentação API v2",
      description: "Atualizar docs da nova versão da API",
      type: "collaboration" as const,
      target: 100,
      current: 40,
      unit: "%",
      deadline: new Date("2024-10-25"),
      status: "active" as const,
      createdBy: "manager-1",
      createdByName: "Roberto Silva",
      teamId: currentTeamId,
      createdAt: new Date("2024-10-01"),
    },
  ];

  const mockTeamData = {
    id: currentTeamId,
    name: "Equipe Alpha",
    description: "Time de desenvolvimento frontend",
    totalXP: 24500,
    avgPerformance: 87,
    members: [
      {
        id: "1",
        name: "João Silva",
        role: "Senior Developer",
        avatar: "/avatars/joao.jpg",
        xp: 8500,
        badges: 7,
        status: "online",
        lastActivity: "Há 5 min",
      },
      {
        id: "2",
        name: "Ana Costa",
        role: "Frontend Developer",
        avatar: "/avatars/ana.jpg",
        xp: 6200,
        badges: 5,
        status: "away",
        lastActivity: "Há 1 hora",
      },
      {
        id: "3",
        name: "Carlos Santos",
        role: "Junior Developer",
        avatar: "/avatars/carlos.jpg",
        xp: 4300,
        badges: 3,
        status: "offline",
        lastActivity: "Ontem",
      },
      {
        id: "4",
        name: "Marina Oliveira",
        role: "UX Designer",
        avatar: "/avatars/marina.jpg",
        xp: 5500,
        badges: 4,
        status: "online",
        lastActivity: "Há 10 min",
      },
    ],
    recentActivities: [
      {
        id: "1",
        user: "João Silva",
        action: 'completou task "Refatorar componente Button"',
        timestamp: "10 min atrás",
        xpGained: 150,
      },
      {
        id: "2",
        user: "Ana Costa",
        action: "iniciou mentoria com Carlos",
        timestamp: "1 hora atrás",
        xpGained: 50,
      },
      {
        id: "3",
        user: "Marina Oliveira",
        action: "publicou nova documentação de UX",
        timestamp: "2 horas atrás",
        xpGained: 200,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
                {effectiveRole === "admin"
                  ? "Monitoramento Organizacional"
                  : effectiveRole === "manager"
                  ? "Minhas Equipes"
                  : "Minha Equipe"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {effectiveRole === "admin"
                  ? "Insights e métricas operacionais"
                  : effectiveRole === "manager"
                  ? "Dashboard executivo e gestão multi-team"
                  : "Colaboração e crescimento coletivo"}
              </p>
            </div>

            {/* Debug Role Switcher */}
            <DebugRoleSwitcher
              currentRole={debugRole}
              onRoleChange={setDebugRole}
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-8">
        {effectiveRole === "collaborator" ? (
          /* Layout 3 colunas iguais para colaboradores - balanceado 1-1-1 */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Coluna 1 - Minha Contribuição */}
            <div className="space-y-8">
              <MyContribution
                contribution={contribution}
                loading={personalContributionLoading}
              />

              <UpcomingActions
                actions={actions}
                loading={upcomingActionsLoading}
              />
            </div>

            {/* Coluna 2 - Equipe Alpha */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-gray-300 bg-white shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-6">
                  {mockTeamData.name}
                </h2>
                <div className="space-y-6">
                  {/* Métricas compactas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {(mockTeamData.totalXP / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-gray-600">XP Total</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {mockTeamData.avgPerformance}%
                      </div>
                      <div className="text-xs text-gray-600">Performance</div>
                    </div>
                  </div>

                  {/* Membros compactos */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3 text-sm">
                      Membros da Equipe
                    </h3>
                    <div className="space-y-2">
                      {mockTeamData.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-800">
                                {member.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {member.role}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-800">
                              {(member.xp / 1000).toFixed(1)}K
                            </div>
                            <div
                              className={`text-xs flex items-center justify-end gap-1 ${
                                member.status === "online"
                                  ? "text-success-600"
                                  : member.status === "away"
                                  ? "text-warning-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {getStatusIndicator(
                                member.status as "online" | "away" | "offline"
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 3 - Timeline e Objetivos */}
            <div className="space-y-8">
              <TeamTimeline teamId={currentTeamId} events={timelineEvents} />

              <TeamObjectives
                teamId={currentTeamId}
                objectives={activeObjectives}
                canEdit={false}
              />
            </div>
          </div>
        ) : (
          /* Layout 3 colunas iguais para managers e admins - consistente 1-1-1 */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Coluna 1 - Dashboard Principal */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-gray-300 bg-white shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {effectiveRole === "admin"
                    ? "Business Intelligence"
                    : "Dashboard Executivo"}
                </h2>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {effectiveRole === "admin"
                      ? "Métricas organizacionais"
                      : "Visão executiva"}
                  </p>

                  {/* Métricas compactas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {mockTeamData.members.length}
                      </div>
                      <div className="text-xs text-gray-600">Membros</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">
                        {mockTeamData.avgPerformance}%
                      </div>
                      <div className="text-xs text-gray-600">Performance</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {(mockTeamData.totalXP / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-gray-600">XP Total</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-600">8</div>
                      <div className="text-xs text-gray-600">
                        {effectiveRole === "admin" ? "Alertas" : "Badges"}
                      </div>
                    </div>
                  </div>

                  {effectiveRole === "admin" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2 text-sm">
                        Top Equipes
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Equipe Alpha</span>
                          <span className="font-medium text-gray-800">92%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Equipe Beta</span>
                          <span className="font-medium text-gray-800">88%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Equipe Gamma</span>
                          <span className="font-medium text-gray-800">85%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna 2 - Equipe Detail */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-gray-300 bg-white shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {mockTeamData.name}
                </h2>
                <div className="space-y-4">
                  {/* Team members compacto */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3 text-sm">
                      Membros da Equipe
                    </h3>
                    <div className="space-y-2">
                      {mockTeamData.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-800">
                                {member.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {member.role}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-800">
                              {(member.xp / 1000).toFixed(1)}K
                            </div>
                            <div
                              className={`text-xs flex items-center justify-end gap-1 ${
                                member.status === "online"
                                  ? "text-success-600"
                                  : member.status === "away"
                                  ? "text-warning-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {getStatusIndicator(
                                member.status as "online" | "away" | "offline"
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent activities compacto */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3 text-sm">
                      Atividades Recentes
                    </h3>
                    <div className="space-y-2">
                      {mockTeamData.recentActivities
                        .slice(0, 3)
                        .map((activity) => (
                          <div
                            key={activity.id}
                            className="p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="text-xs text-gray-800">
                              {activity.user}
                            </div>
                            <div className="text-xs text-gray-600">
                              {activity.action}
                            </div>
                            <div className="text-xs text-blue-600">
                              +{activity.xpGained} XP
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 3 - Timeline e Objetivos */}
            <div className="space-y-8">
              <TeamTimeline teamId={currentTeamId} events={timelineEvents} />

              <TeamObjectives
                teamId={currentTeamId}
                objectives={activeObjectives}
                canEdit={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamsPage;
