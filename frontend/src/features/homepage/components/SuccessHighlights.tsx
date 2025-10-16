import { Trophy, Star, Award, Users, Target, Sparkles } from "lucide-react";

interface SuccessHighlight {
  id: string;
  type: "achievement" | "milestone" | "recognition" | "win";
  title: string;
  description: string;
  impact: string;
  date: string;
  teamInvolved?: string;
  employeeInvolved?: string;
  metric?: {
    value: number;
    label: string;
    format: "number" | "percentage" | "currency";
  };
}

interface SuccessHighlightsProps {
  highlights: SuccessHighlight[];
  weeklyWins: number;
  monthlyAchievements: number;
  totalMilestones: number;
  onViewAll?: () => void;
  className?: string;
}

/**
 * Card com highlights de sucesso da empresa
 * Mostra conquistas, milestones e wins recentes para motivar o CEO
 */
export function SuccessHighlights({
  highlights,
  weeklyWins,
  monthlyAchievements,
  totalMilestones,
  onViewAll,
  className = "",
}: SuccessHighlightsProps) {
  const getHighlightConfig = (type: string) => {
    switch (type) {
      case "achievement":
        return {
          icon: Trophy,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-700",
          gradientFrom: "from-yellow-500",
          gradientTo: "to-yellow-600",
        };
      case "milestone":
        return {
          icon: Target,
          iconColor: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          badgeColor: "bg-emerald-100 text-emerald-700",
          gradientFrom: "from-emerald-500",
          gradientTo: "to-emerald-600",
        };
      case "recognition":
        return {
          icon: Award,
          iconColor: "text-brand-600",
          bgColor: "bg-brand-50",
          borderColor: "border-brand-200",
          badgeColor: "bg-brand-100 text-brand-700",
          gradientFrom: "from-brand-500",
          gradientTo: "to-brand-600",
        };
      case "win":
        return {
          icon: Star,
          iconColor: "text-success-600",
          bgColor: "bg-success-50",
          borderColor: "border-success-200",
          badgeColor: "bg-success-100 text-success-700",
          gradientFrom: "from-success-500",
          gradientTo: "to-success-600",
        };
      default:
        return {
          icon: Sparkles,
          iconColor: "text-surface-600",
          bgColor: "bg-surface-50",
          borderColor: "border-surface-200",
          badgeColor: "bg-surface-100 text-surface-700",
          gradientFrom: "from-surface-500",
          gradientTo: "to-surface-600",
        };
    }
  };

  const formatMetricValue = (value: number, format: string) => {
    switch (format) {
      case "percentage":
        return `${value}%`;
      case "currency":
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value);
      default:
        return value.toLocaleString();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "achievement":
        return "CONQUISTA";
      case "milestone":
        return "MARCO";
      case "recognition":
        return "RECONHECIMENTO";
      case "win":
        return "VITÓRIA";
      default:
        return "DESTAQUE";
    }
  };

  // Ordenar por data mais recente
  const sortedHighlights = [...highlights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-800">
              Sucessos & Conquistas
            </h2>
            <p className="text-surface-600 text-sm">
              Celebrando os wins da nossa empresa
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-success-600">
              {weeklyWins}
            </div>
            <div className="text-xs text-surface-500">Esta semana</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {monthlyAchievements}
            </div>
            <div className="text-xs text-surface-500">Este mês</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">
              {totalMilestones}
            </div>
            <div className="text-xs text-surface-500">Total marcos</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-success-50 to-success-100 border border-success-200 rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-success-700 mb-1">
            {weeklyWins}
          </div>
          <div className="text-sm text-success-600">Wins esta semana</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-yellow-700 mb-1">
            {monthlyAchievements}
          </div>
          <div className="text-sm text-yellow-600">Conquistas do mês</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mb-1">
            {totalMilestones}
          </div>
          <div className="text-sm text-emerald-600">Marcos alcançados</div>
        </div>
      </div>

      {/* Recent Highlights */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {sortedHighlights.slice(0, 6).map((highlight) => {
          const config = getHighlightConfig(highlight.type);
          const HighlightIcon = config.icon;

          return (
            <div
              key={highlight.id}
              className={`
                border-2 rounded-xl p-4 transition-all duration-200
                ${config.bgColor} ${config.borderColor}
                hover:shadow-md hover:scale-[1.01]
              `}
            >
              {/* Highlight Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} rounded-lg flex items-center justify-center shadow-lg`}
                  >
                    <HighlightIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded ${config.badgeColor}`}
                    >
                      {getTypeLabel(highlight.type)}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-surface-500">
                  {new Date(highlight.date).toLocaleDateString("pt-BR")}
                </div>
              </div>

              {/* Highlight Content */}
              <div className="space-y-3">
                <h3 className="font-semibold text-surface-800">
                  {highlight.title}
                </h3>

                <p className="text-surface-700 text-sm leading-relaxed">
                  {highlight.description}
                </p>

                {/* Impact & Metric */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-surface-600">Impacto: </span>
                    <span className="font-medium text-surface-800">
                      {highlight.impact}
                    </span>
                  </div>

                  {highlight.metric && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-surface-800">
                        {formatMetricValue(
                          highlight.metric.value,
                          highlight.metric.format
                        )}
                      </div>
                      <div className="text-xs text-surface-600">
                        {highlight.metric.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team/Employee Involved */}
                {(highlight.teamInvolved || highlight.employeeInvolved) && (
                  <div className="flex items-center gap-2 text-xs">
                    {highlight.teamInvolved && (
                      <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded">
                        <Users className="w-3 h-3 text-brand-600" />
                        <span className="text-surface-700">
                          {highlight.teamInvolved}
                        </span>
                      </div>
                    )}
                    {highlight.employeeInvolved && (
                      <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded">
                        <Award className="w-3 h-3 text-success-600" />
                        <span className="text-surface-700">
                          {highlight.employeeInvolved}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {highlights.length > 6 && (
        <div className="mt-6 pt-4 border-t border-surface-200">
          <button
            onClick={onViewAll}
            className="w-full py-3 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Ver todos os {highlights.length} destaques
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {highlights.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-800 mb-2">
            Pronto para celebrar!
          </h3>
          <p className="text-surface-600 text-sm">
            Os sucessos da empresa aparecerão aqui conforme forem alcançados.
          </p>
        </div>
      )}
    </div>
  );
}
