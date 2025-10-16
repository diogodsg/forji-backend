import type { TeamQuickAction, UserRole } from "../types";

interface TeamQuickActionsProps {
  userRole: UserRole;
  onAction?: (actionId: string) => void;
}

// Componente de ícone reutilizável
const ActionIcon = ({
  type,
  className = "w-4 h-4",
}: {
  type: string;
  className?: string;
}) => {
  const icons = {
    feedback: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
    ranking: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    target: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    calendar: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    users: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    reports: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    chat: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    clipboard: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    plus: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    settings: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    user: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    analytics: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    zap: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  };

  return icons[type as keyof typeof icons] || icons.target;
};

export function TeamQuickActions({
  userRole,
  onAction,
}: TeamQuickActionsProps) {
  const getActionsForRole = (role: UserRole): TeamQuickAction[] => {
    switch (role) {
      case "collaborator":
        return [
          {
            id: "give-feedback",
            label: "Dar Feedback",
            description: "Para colegas da equipe",
            icon: "feedback",
            action: () => onAction?.("give-feedback"),
            variant: "primary",
          },
          {
            id: "view-ranking",
            label: "Ver Ranking",
            description: "Posição da equipe",
            icon: "ranking",
            action: () => onAction?.("view-ranking"),
            variant: "secondary",
          },
          {
            id: "view-challenges",
            label: "Desafios",
            description: "2 ativos",
            icon: "target",
            action: () => onAction?.("view-challenges"),
            variant: "secondary",
          },
          {
            id: "team-calendar",
            label: "Calendário",
            description: "Eventos da equipe",
            icon: "calendar",
            action: () => onAction?.("team-calendar"),
            variant: "secondary",
          },
        ];

      case "manager":
        return [
          {
            id: "manage-teams",
            label: "Gerenciar Equipes",
            description: "3 equipes",
            icon: "users",
            action: () => onAction?.("manage-teams"),
            variant: "primary",
          },
          {
            id: "create-challenge",
            label: "Criar Desafio",
            description: "Para as equipes",
            icon: "target",
            action: () => onAction?.("create-challenge"),
            variant: "secondary",
          },
          {
            id: "performance-reports",
            label: "Relatórios",
            description: "Performance mensal",
            icon: "reports",
            action: () => onAction?.("performance-reports"),
            variant: "secondary",
          },
          {
            id: "team-feedback",
            label: "Feedback 1:1",
            description: "5 pendentes",
            icon: "chat",
            action: () => onAction?.("team-feedback"),
            variant: "secondary",
          },
          {
            id: "resource-planning",
            label: "Planejamento",
            description: "Recursos da equipe",
            icon: "clipboard",
            action: () => onAction?.("resource-planning"),
            variant: "secondary",
          },
        ];

      case "admin":
        return [
          {
            id: "view-executive-dashboard",
            label: "Dashboard Executivo",
            description: "Métricas organizacionais",
            icon: "ranking",
            action: () => onAction?.("view-executive-dashboard"),
            variant: "primary",
          },
          {
            id: "view-performance-reports",
            label: "Relatórios de Performance",
            description: "Análise de equipes",
            icon: "reports",
            action: () => onAction?.("view-performance-reports"),
            variant: "secondary",
          },
          {
            id: "view-health-insights",
            label: "Health Insights",
            description: "Saúde organizacional",
            icon: "analytics",
            action: () => onAction?.("view-health-insights"),
            variant: "secondary",
          },
          {
            id: "access-admin-panel",
            label: "Administração",
            description: "Configurações estruturais",
            icon: "settings",
            action: () => (window.location.href = "/admin"),
            variant: "secondary",
          },
        ];

      default:
        return [];
    }
  };

  const actions = getActionsForRole(userRole);

  const handleActionClick = (action: TeamQuickAction) => {
    // Placeholder para implementação futura
    console.log(`Ação clicada: ${action.id}`);
    action.action();
  };

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
            <ActionIcon type="zap" className="w-5 h-5" />
          </span>
          Ferramentas
        </h3>
      </header>

      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] ${
              action.variant === "primary"
                ? "bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 text-white border-transparent hover:opacity-90 focus:ring-2 focus:ring-indigo-400"
                : "border-surface-300 bg-white text-gray-700 hover:bg-surface-50 focus:ring-2 focus:ring-indigo-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  action.variant === "primary"
                    ? "bg-white/20 text-white"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <ActionIcon type={action.icon} className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium text-sm ${
                    action.variant === "primary"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {action.label}
                </div>
                {action.description && (
                  <div
                    className={`text-xs ${
                      action.variant === "primary"
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    {action.description}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
