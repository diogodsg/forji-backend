import {
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Target,
  Users,
  ChevronRight,
  Brain,
  Zap,
} from "lucide-react";

interface StrategicInsight {
  id: string;
  type: "opportunity" | "risk" | "trend" | "recommendation";
  priority: "high" | "medium" | "low";
  category: "people" | "growth" | "efficiency" | "innovation" | "culture";
  title: string;
  description: string;
  dataSource: string;
  potentialImpact: string;
  suggestedAction: string;
  timeline: "immediate" | "short_term" | "long_term"; // <30 days, 30-90 days, >90 days
  confidence: number; // 0-100 confidence in the insight
  relatedMetrics?: {
    current: number;
    potential: number;
    unit: string;
  };
}

interface StrategicInsightsProps {
  insights: StrategicInsight[];
  onInsightClick?: (insightId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

/**
 * Card com insights estratégicos e recomendações baseadas em dados
 * Para CEOs tomarem decisões informadas baseadas em analytics
 */
export function StrategicInsights({
  insights,
  onInsightClick,
  onViewAll,
  className = "",
}: StrategicInsightsProps) {
  const getInsightConfig = (insight: StrategicInsight) => {
    const typeConfigs = {
      opportunity: {
        icon: TrendingUp,
        iconColor: "text-success-600",
        bgColor: "bg-success-50",
        borderColor: "border-success-200",
        badgeColor: "bg-success-100 text-success-700",
        gradientFrom: "from-success-500",
        gradientTo: "to-success-600",
      },
      risk: {
        icon: AlertCircle,
        iconColor: "text-error-600",
        bgColor: "bg-error-50",
        borderColor: "border-error-200",
        badgeColor: "bg-error-100 text-error-700",
        gradientFrom: "from-error-500",
        gradientTo: "to-error-600",
      },
      trend: {
        icon: TrendingUp,
        iconColor: "text-brand-600",
        bgColor: "bg-brand-50",
        borderColor: "border-brand-200",
        badgeColor: "bg-brand-100 text-brand-700",
        gradientFrom: "from-brand-500",
        gradientTo: "to-brand-600",
      },
      recommendation: {
        icon: Lightbulb,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        badgeColor: "bg-yellow-100 text-yellow-700",
        gradientFrom: "from-yellow-500",
        gradientTo: "to-yellow-600",
      },
    };

    return typeConfigs[insight.type];
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          color: "text-error-700",
          bg: "bg-error-100",
          text: "ALTA",
          dot: "bg-error-500",
        };
      case "medium":
        return {
          color: "text-warning-700",
          bg: "bg-warning-100",
          text: "MÉDIA",
          dot: "bg-warning-500",
        };
      case "low":
        return {
          color: "text-success-700",
          bg: "bg-success-100",
          text: "BAIXA",
          dot: "bg-success-500",
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

  const getTimelineConfig = (timeline: string) => {
    switch (timeline) {
      case "immediate":
        return {
          text: "Imediato",
          color: "text-error-700",
          bg: "bg-error-50",
        };
      case "short_term":
        return {
          text: "30-90 dias",
          color: "text-warning-700",
          bg: "bg-warning-50",
        };
      case "long_term":
        return {
          text: "Longo prazo",
          color: "text-brand-700",
          bg: "bg-brand-50",
        };
      default:
        return {
          text: "A definir",
          color: "text-surface-700",
          bg: "bg-surface-50",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "people":
        return Users;
      case "growth":
        return TrendingUp;
      case "efficiency":
        return Zap;
      case "innovation":
        return Brain;
      case "culture":
        return Target;
      default:
        return Lightbulb;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "opportunity":
        return "OPORTUNIDADE";
      case "risk":
        return "RISCO";
      case "trend":
        return "TENDÊNCIA";
      case "recommendation":
        return "RECOMENDAÇÃO";
      default:
        return "INSIGHT";
    }
  };

  // Ordenar por prioridade e confiança
  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    return b.confidence - a.confidence;
  });

  const highPriorityCount = insights.filter(
    (i) => i.priority === "high"
  ).length;
  const opportunityCount = insights.filter(
    (i) => i.type === "opportunity"
  ).length;
  const riskCount = insights.filter((i) => i.type === "risk").length;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-800">
              Insights Estratégicos
            </h2>
            <p className="text-surface-600 text-sm">
              Recomendações baseadas em dados para decisões executivas
            </p>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex items-center gap-2">
          {highPriorityCount > 0 && (
            <div className="px-3 py-1 bg-error-100 text-error-700 rounded-lg text-sm font-medium">
              {highPriorityCount} alta prioridade
            </div>
          )}
          {opportunityCount > 0 && (
            <div className="px-3 py-1 bg-success-100 text-success-700 rounded-lg text-sm font-medium">
              {opportunityCount} oportunidades
            </div>
          )}
          {riskCount > 0 && (
            <div className="px-3 py-1 bg-warning-100 text-warning-700 rounded-lg text-sm font-medium">
              {riskCount} riscos
            </div>
          )}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedInsights.slice(0, 6).map((insight) => {
          const insightConfig = getInsightConfig(insight);
          const priorityConfig = getPriorityConfig(insight.priority);
          const timelineConfig = getTimelineConfig(insight.timeline);
          const CategoryIcon = getCategoryIcon(insight.category);
          const InsightIcon = insightConfig.icon;

          return (
            <div
              key={insight.id}
              onClick={() => onInsightClick?.(insight.id)}
              className={`
                border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer
                hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                ${insightConfig.bgColor} ${insightConfig.borderColor}
              `}
            >
              {/* Insight Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${insightConfig.gradientFrom} ${insightConfig.gradientTo} rounded-lg flex items-center justify-center shadow-lg`}
                  >
                    <InsightIcon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-surface-600" />
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${insightConfig.badgeColor}`}
                    >
                      {getTypeLabel(insight.type)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}
                  />
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${priorityConfig.bg} ${priorityConfig.color}`}
                  >
                    {priorityConfig.text}
                  </span>
                  <ChevronRight className="w-4 h-4 text-surface-400" />
                </div>
              </div>

              {/* Insight Content */}
              <div className="space-y-3">
                <h3 className="font-semibold text-surface-800">
                  {insight.title}
                </h3>

                <p className="text-surface-700 text-sm leading-relaxed">
                  {insight.description}
                </p>

                {/* Data Source & Confidence */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-600">
                    Fonte: {insight.dataSource}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-surface-600">Confiança:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="font-medium text-surface-700 text-xs">
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Potential Impact */}
                <div className="bg-white/50 border border-surface-200 rounded-lg p-3">
                  <div className="text-xs text-surface-600 mb-1">
                    Impacto potencial:
                  </div>
                  <div className="text-sm font-medium text-surface-800 mb-2">
                    {insight.potentialImpact}
                  </div>

                  {insight.relatedMetrics && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-surface-600">Atual:</span>
                      <span className="font-medium text-surface-800">
                        {insight.relatedMetrics.current}
                        {insight.relatedMetrics.unit}
                      </span>
                      <span className="text-surface-600">Potencial:</span>
                      <span className="font-medium text-success-700">
                        {insight.relatedMetrics.potential}
                        {insight.relatedMetrics.unit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Suggested Action */}
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
                  <div className="text-xs text-brand-600 mb-1">
                    Ação sugerida:
                  </div>
                  <div className="text-sm font-medium text-brand-800">
                    {insight.suggestedAction}
                  </div>
                </div>
              </div>

              {/* Insight Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-200">
                <div
                  className={`text-xs px-2 py-1 rounded ${timelineConfig.bg} ${timelineConfig.color}`}
                >
                  Timeline: {timelineConfig.text}
                </div>

                <div className="text-xs text-surface-500 capitalize">
                  Categoria: {insight.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {insights.length > 6 && (
        <div className="mt-6 pt-4 border-t border-surface-200">
          <button
            onClick={onViewAll}
            className="w-full py-3 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Ver todos os {insights.length} insights
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {insights.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-800 mb-2">
            Analisando dados...
          </h3>
          <p className="text-surface-600 text-sm">
            Insights estratégicos serão gerados conforme mais dados ficarem
            disponíveis.
          </p>
        </div>
      )}
    </div>
  );
}
