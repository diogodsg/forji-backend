import {
  AlertTriangle,
  Calendar,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";

interface PriorityAction {
  id: string;
  type: "critical" | "attention" | "celebrate";
  person: string;
  title: string;
  description: string;
  timeAgo?: string;
  urgency?: "today" | "this-week" | "soon";
  quickActions: {
    primary: {
      label: string;
      action: () => void;
    };
    secondary?: {
      label: string;
      action: () => void;
    };
  };
}

interface PriorityActionsCardProps {
  actions: PriorityAction[];
  className?: string;
}

/**
 * Lista prioritizada de ações para o manager - máximo 5 itens
 * Categoriza em Critical/Attention/Celebrate com quick actions
 */
export function PriorityActionsCard({
  actions,
  className = "",
}: PriorityActionsCardProps) {
  // Ordenar por prioridade: critical > attention > celebrate
  const sortedActions = [...actions]
    .sort((a, b) => {
      const priority = { critical: 3, attention: 2, celebrate: 1 };
      return priority[b.type] - priority[a.type];
    })
    .slice(0, 5); // Máximo 5 ações

  const getActionConfig = (type: PriorityAction["type"]) => {
    switch (type) {
      case "critical":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: "bg-error-50",
          borderColor: "border-error-200",
          iconColor: "text-error-600",
          titleColor: "text-error-800",
          badge: "CRÍTICO",
          badgeColor: "bg-error-500 text-white",
        };
      case "attention":
        return {
          icon: <Clock className="w-5 h-5" />,
          bgColor: "bg-warning-50",
          borderColor: "border-warning-200",
          iconColor: "text-warning-600",
          titleColor: "text-warning-800",
          badge: "ATENÇÃO",
          badgeColor: "bg-warning-500 text-white",
        };
      case "celebrate":
        return {
          icon: <Award className="w-5 h-5" />,
          bgColor: "bg-success-50",
          borderColor: "border-success-200",
          iconColor: "text-success-600",
          titleColor: "text-success-800",
          badge: "CELEBRAR",
          badgeColor: "bg-success-500 text-white",
        };
    }
  };

  const getUrgencyText = (urgency: PriorityAction["urgency"]) => {
    switch (urgency) {
      case "today":
        return "Hoje";
      case "this-week":
        return "Esta semana";
      case "soon":
        return "Em breve";
      default:
        return "";
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-800">
              Ações Prioritárias
            </h2>
            <p className="text-surface-600 text-sm">
              O que precisa da sua atenção agora
            </p>
          </div>
        </div>

        {sortedActions.length > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-surface-800">
              {sortedActions.length}
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              AÇÕES
            </div>
          </div>
        )}
      </div>

      {/* Actions List */}
      {sortedActions.length === 0 ? (
        <div className="text-center py-8 bg-surface-50 rounded-xl">
          <Award className="w-12 h-12 text-surface-400 mx-auto mb-3" />
          <p className="text-surface-600 text-lg font-medium mb-1">
            Tudo em ordem! 🎉
          </p>
          <p className="text-surface-500 text-sm">
            Sua equipe está bem e não há ações urgentes pendentes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedActions.map((action, index) => {
            const config = getActionConfig(action.type);

            return (
              <div
                key={action.id}
                className={`
                  ${config.bgColor} ${config.borderColor}
                  border rounded-xl p-4 transition-all duration-200
                  hover:shadow-md hover:scale-[1.01]
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`${config.iconColor} flex-shrink-0 mt-1`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        {/* Badge + Priority Number */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`
                            inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                            ${config.badgeColor}
                          `}
                          >
                            #{index + 1} {config.badge}
                          </span>
                          {action.urgency && (
                            <span className="text-xs text-surface-600 font-medium">
                              {getUrgencyText(action.urgency)}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-semibold text-sm ${config.titleColor} mb-1`}
                        >
                          {action.person}: {action.title}
                        </h3>

                        {/* Description */}
                        <p className="text-surface-600 text-sm leading-relaxed">
                          {action.description}
                        </p>

                        {action.timeAgo && (
                          <p className="text-surface-500 text-xs mt-1">
                            {action.timeAgo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={action.quickActions.primary.action}
                        className="inline-flex items-center gap-1 bg-white text-surface-700 border border-surface-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-50 transition-colors"
                      >
                        {action.quickActions.primary.label}
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {action.quickActions.secondary && (
                        <button
                          onClick={action.quickActions.secondary.action}
                          className="inline-flex items-center gap-1 text-surface-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/50 transition-colors"
                        >
                          {action.quickActions.secondary.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer CTA */}
      {sortedActions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-surface-200">
          <button className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:opacity-90">
            <Calendar className="w-4 h-4" />
            Ver Agenda Completa
          </button>
        </div>
      )}
    </div>
  );
}
