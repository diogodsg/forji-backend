import { CheckCircle, Users, MessageCircle, Star, Target } from "lucide-react";
import type { UpcomingAction } from "../types";

interface UpcomingActionsProps {
  actions?: UpcomingAction[];
  loading?: boolean;
}

// Componente de ícone para cada tipo de ação
const ActionTypeIcon = ({
  type,
  className = "w-4 h-4",
}: {
  type: UpcomingAction["type"];
  className?: string;
}) => {
  const icons = {
    pdi_milestone: <CheckCircle className={className} />,
    mentorship_opportunity: <Users className={className} />,
    badge_close: <Star className={className} />,
    feedback_pending: <MessageCircle className={className} />,
    collaboration: <Target className={className} />,
  };

  return icons[type] || icons.collaboration;
};

// Cores para cada tipo de ação
const getActionColors = (
  type: UpcomingAction["type"],
  priority: UpcomingAction["priority"]
) => {
  const baseColors = {
    pdi_milestone: "text-success-600 bg-success-50 border-success-200",
    mentorship_opportunity: "text-brand-600 bg-brand-50 border-brand-200",
    badge_close: "text-warning-600 bg-warning-50 border-warning-200",
    feedback_pending: "text-brand-600 bg-brand-50 border-brand-200",
    collaboration: "text-brand-600 bg-brand-50 border-brand-200",
  };

  // Se é alta prioridade, sobrescreve com cores de atenção
  if (priority === "high") {
    return "text-red-600 bg-red-50 border-red-200";
  }

  return baseColors[type] || baseColors.collaboration;
};

// Badge de prioridade
const PriorityBadge = ({
  priority,
}: {
  priority: UpcomingAction["priority"];
}) => {
  const styles = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labels = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
};

export function UpcomingActions({
  actions = [],
  loading = false,
}: UpcomingActionsProps) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Ordena por prioridade e data
  const sortedActions = actions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-surface-300/60">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </span>
          Próximas Ações
        </h3>
      </header>

      {sortedActions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">Tudo em dia!</p>
          <p className="text-gray-500 text-xs mt-1">
            Novas oportunidades aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedActions.slice(0, 5).map((action) => (
            <div
              key={action.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center ${getActionColors(
                    action.type,
                    action.priority
                  )}`}
                >
                  <ActionTypeIcon type={action.type} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h4>
                    <PriorityBadge priority={action.priority} />
                  </div>

                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {action.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {action.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {action.estimatedTime}
                      </span>
                    )}

                    {action.relatedUserName && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
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
                        {action.relatedUserName}
                      </span>
                    )}

                    {action.metadata?.progressPercentage && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
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
                        {action.metadata.progressPercentage}% completo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sortedActions.length > 5 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
                Ver mais {sortedActions.length - 5} ações
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
