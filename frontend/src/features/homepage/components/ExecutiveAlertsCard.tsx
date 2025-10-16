import {
  AlertTriangle,
  TrendingDown,
  UserX,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";

interface ExecutiveAlert {
  id: string;
  type: "critical" | "warning" | "opportunity";
  category:
    | "performance"
    | "retention"
    | "leadership"
    | "development"
    | "growth";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  teamAffected?: string;
  managerAffected?: string;
  actionRequired: string;
  urgency: "immediate" | "this_week" | "this_month";
  createdAt: string;
}

interface ExecutiveAlertsCardProps {
  alerts: ExecutiveAlert[];
  onAlertClick?: (alertId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

/**
 * Card de alertas executivos para CEOs
 * Mostra questões críticas que precisam de atenção imediata
 */
export function ExecutiveAlertsCard({
  alerts,
  onAlertClick,
  onViewAll,
  className = "",
}: ExecutiveAlertsCardProps) {
  const getAlertConfig = (alert: ExecutiveAlert) => {
    const baseConfig = {
      critical: {
        bgColor: "bg-error-50",
        borderColor: "border-error-200",
        iconColor: "text-error-600",
        icon: AlertTriangle,
        badgeColor: "bg-error-100 text-error-700",
      },
      warning: {
        bgColor: "bg-warning-50",
        borderColor: "border-warning-200",
        iconColor: "text-warning-600",
        icon: Clock,
        badgeColor: "bg-warning-100 text-warning-700",
      },
      opportunity: {
        bgColor: "bg-success-50",
        borderColor: "border-success-200",
        iconColor: "text-success-600",
        icon: Target,
        badgeColor: "bg-success-100 text-success-700",
      },
    };

    return baseConfig[alert.type];
  };

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return {
          color: "text-error-700",
          bg: "bg-error-100",
          text: "URGENTE",
          dot: "bg-error-500",
        };
      case "this_week":
        return {
          color: "text-warning-700",
          bg: "bg-warning-100",
          text: "ESTA SEMANA",
          dot: "bg-warning-500",
        };
      case "this_month":
        return {
          color: "text-brand-700",
          bg: "bg-brand-100",
          text: "ESTE MÊS",
          dot: "bg-brand-500",
        };
      default:
        return {
          color: "text-surface-700",
          bg: "bg-surface-100",
          text: "BAIXA",
          dot: "bg-surface-500",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return TrendingDown;
      case "retention":
        return UserX;
      case "leadership":
        return AlertTriangle;
      case "development":
        return Target;
      case "growth":
        return Target;
      default:
        return AlertTriangle;
    }
  };

  // Ordenar por urgência e impacto
  const sortedAlerts = [...alerts].sort((a, b) => {
    const urgencyOrder = { immediate: 3, this_week: 2, this_month: 1 };
    const impactOrder = { high: 3, medium: 2, low: 1 };

    const aScore = urgencyOrder[a.urgency] + impactOrder[a.impact];
    const bScore = urgencyOrder[b.urgency] + impactOrder[b.impact];

    return bScore - aScore;
  });

  const criticalCount = alerts.filter((a) => a.type === "critical").length;
  const warningCount = alerts.filter((a) => a.type === "warning").length;
  const opportunityCount = alerts.filter(
    (a) => a.type === "opportunity"
  ).length;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-800">
              Alertas Executivos
            </h2>
            <p className="text-surface-600 text-sm">
              Questões críticas que precisam da sua atenção
            </p>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <div className="px-3 py-1 bg-error-100 text-error-700 rounded-lg text-sm font-medium">
              {criticalCount} críticos
            </div>
          )}
          {warningCount > 0 && (
            <div className="px-3 py-1 bg-warning-100 text-warning-700 rounded-lg text-sm font-medium">
              {warningCount} atenção
            </div>
          )}
          {opportunityCount > 0 && (
            <div className="px-3 py-1 bg-success-100 text-success-700 rounded-lg text-sm font-medium">
              {opportunityCount} oportunidades
            </div>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedAlerts.slice(0, 8).map((alert) => {
          const alertConfig = getAlertConfig(alert);
          const urgencyConfig = getUrgencyConfig(alert.urgency);
          const CategoryIcon = getCategoryIcon(alert.category);
          const AlertIcon = alertConfig.icon;

          return (
            <div
              key={alert.id}
              onClick={() => onAlertClick?.(alert.id)}
              className={`
                border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer
                hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                ${alertConfig.bgColor} ${alertConfig.borderColor}
              `}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <AlertIcon className={`w-5 h-5 ${alertConfig.iconColor}`} />
                    <CategoryIcon className="w-4 h-4 text-surface-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${urgencyConfig.dot} animate-pulse`}
                    />
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${urgencyConfig.bg} ${urgencyConfig.color}`}
                    >
                      {urgencyConfig.text}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-surface-400" />
              </div>

              {/* Alert Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-surface-800 text-sm">
                  {alert.title}
                </h3>

                <p className="text-surface-700 text-sm leading-relaxed">
                  {alert.description}
                </p>

                {/* Affected Team/Manager */}
                {(alert.teamAffected || alert.managerAffected) && (
                  <div className="flex items-center gap-2 text-xs text-surface-600">
                    {alert.teamAffected && (
                      <span className="bg-surface-100 px-2 py-1 rounded">
                        Time: {alert.teamAffected}
                      </span>
                    )}
                    {alert.managerAffected && (
                      <span className="bg-surface-100 px-2 py-1 rounded">
                        Manager: {alert.managerAffected}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Required */}
                <div className="bg-white/50 border border-surface-200 rounded-lg p-3 mt-3">
                  <div className="text-xs text-surface-600 mb-1">
                    Ação necessária:
                  </div>
                  <div className="text-sm font-medium text-surface-800">
                    {alert.actionRequired}
                  </div>
                </div>
              </div>

              {/* Alert Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${alertConfig.badgeColor}`}
                  >
                    {alert.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-surface-500">
                    {alert.impact.toUpperCase()} IMPACTO
                  </span>
                </div>

                <div className="text-xs text-surface-500">
                  {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with View All */}
      {alerts.length > 8 && (
        <div className="mt-6 pt-4 border-t border-surface-200">
          <button
            onClick={onViewAll}
            className="w-full py-3 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Ver todos os {alerts.length} alertas
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-success-100 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-800 mb-2">
            Nenhum alerta ativo
          </h3>
          <p className="text-surface-600 text-sm">
            Sua empresa está operando dentro dos parâmetros normais.
          </p>
        </div>
      )}
    </div>
  );
}
