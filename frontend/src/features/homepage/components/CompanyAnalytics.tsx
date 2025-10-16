import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Clock,
  Award,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface AnalyticsMetric {
  label: string;
  value: number;
  change: number; // percentage change
  format: "number" | "percentage" | "currency" | "time";
  trend: "up" | "down" | "stable";
  target?: number;
}

interface ChartDataPoint {
  period: string;
  value: number;
  target?: number;
}

interface CompanyAnalyticsProps {
  engagementMetrics: {
    weeklyActiveUsers: AnalyticsMetric;
    averageSessionTime: AnalyticsMetric;
    xpPerEmployee: AnalyticsMetric;
    completionRate: AnalyticsMetric;
  };
  retentionMetrics: {
    employeeRetention: AnalyticsMetric;
    managerRetention: AnalyticsMetric;
    satisfactionScore: AnalyticsMetric;
    promotionRate: AnalyticsMetric;
  };
  roiMetrics: {
    savingsFromRetention: AnalyticsMetric;
    recruitmentCostReduction: AnalyticsMetric;
    productivityGain: AnalyticsMetric;
    timeToPromotionReduction: AnalyticsMetric;
  };
  trendData: ChartDataPoint[];
  className?: string;
}

/**
 * Dashboard de analytics executivo com métricas de business intelligence
 * Para CEOs acompanharem KPIs críticos da empresa
 */
export function CompanyAnalytics({
  engagementMetrics,
  retentionMetrics,
  roiMetrics,
  trendData,
  className = "",
}: CompanyAnalyticsProps) {
  const formatValue = (value: number, format: string) => {
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
      case "time":
        return `${value}h`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendConfig = (trend: string, change: number) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    if (trend === "up" && isPositive) {
      return {
        icon: ChevronUp,
        color: "text-success-600",
        bgColor: "bg-success-50",
        borderColor: "border-success-200",
      };
    } else if (trend === "down" && isNegative) {
      return {
        icon: ChevronDown,
        color: "text-error-600",
        bgColor: "bg-error-50",
        borderColor: "border-error-200",
      };
    } else if (trend === "down" && isPositive) {
      return {
        icon: ChevronUp,
        color: "text-error-600",
        bgColor: "bg-error-50",
        borderColor: "border-error-200",
      };
    } else if (trend === "up" && isNegative) {
      return {
        icon: ChevronDown,
        color: "text-success-600",
        bgColor: "bg-success-50",
        borderColor: "border-success-200",
      };
    } else {
      return {
        icon: null,
        color: "text-surface-600",
        bgColor: "bg-surface-50",
        borderColor: "border-surface-200",
      };
    }
  };

  const MetricCard = ({
    metric,
    icon: Icon,
  }: {
    metric: AnalyticsMetric;
    icon: any;
  }) => {
    const trendConfig = getTrendConfig(metric.trend, metric.change);
    const TrendIcon = trendConfig.icon;

    return (
      <div
        className={`
        bg-white border-2 rounded-xl p-4 transition-all duration-200
        ${trendConfig.bgColor} ${trendConfig.borderColor}
      `}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>

          {TrendIcon && (
            <div className={`flex items-center gap-1 ${trendConfig.color}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {Math.abs(metric.change)}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-surface-800">
            {formatValue(metric.value, metric.format)}
          </div>

          <div className="text-sm text-surface-600">{metric.label}</div>

          {metric.target && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-500">Meta:</span>
              <span className="font-medium text-surface-700">
                {formatValue(metric.target, metric.format)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Simple bar chart representation
  const maxValue = Math.max(
    ...trendData.map((d) => Math.max(d.value, d.target || 0))
  );
  const minValue = Math.min(...trendData.map((d) => d.value));

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-800">
            Analytics Executivo
          </h2>
          <p className="text-surface-600 text-sm">
            KPIs e métricas de business intelligence
          </p>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600" />
          Engajamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            metric={engagementMetrics.weeklyActiveUsers}
            icon={Users}
          />
          <MetricCard
            metric={engagementMetrics.averageSessionTime}
            icon={Clock}
          />
          <MetricCard metric={engagementMetrics.xpPerEmployee} icon={Award} />
          <MetricCard metric={engagementMetrics.completionRate} icon={Target} />
        </div>
      </div>

      {/* Retention Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-success-600" />
          Retenção & Satisfação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            metric={retentionMetrics.employeeRetention}
            icon={Users}
          />
          <MetricCard metric={retentionMetrics.managerRetention} icon={Award} />
          <MetricCard
            metric={retentionMetrics.satisfactionScore}
            icon={Target}
          />
          <MetricCard
            metric={retentionMetrics.promotionRate}
            icon={TrendingUp}
          />
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Retorno sobre Investimento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            metric={roiMetrics.savingsFromRetention}
            icon={TrendingUp}
          />
          <MetricCard
            metric={roiMetrics.recruitmentCostReduction}
            icon={Users}
          />
          <MetricCard metric={roiMetrics.productivityGain} icon={Target} />
          <MetricCard
            metric={roiMetrics.timeToPromotionReduction}
            icon={Clock}
          />
        </div>
      </div>

      {/* Trend Chart */}
      <div>
        <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-600" />
          Tendência Trimestral - Saúde da Empresa
        </h3>

        <div className="bg-surface-50 rounded-xl p-6">
          <div className="flex items-end justify-between h-48 gap-2">
            {trendData.map((point, index) => {
              const height =
                ((point.value - minValue) / (maxValue - minValue)) * 100;
              const targetHeight = point.target
                ? ((point.target - minValue) / (maxValue - minValue)) * 100
                : 0;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  {/* Chart Bar */}
                  <div
                    className="relative w-full flex items-end justify-center"
                    style={{ height: "160px" }}
                  >
                    {/* Target line */}
                    {point.target && (
                      <div
                        className="absolute w-full border-t-2 border-dashed border-brand-400"
                        style={{ bottom: `${targetHeight * 1.6}px` }}
                      />
                    )}

                    {/* Value bar */}
                    <div
                      className={`
                        w-3/4 bg-gradient-to-t rounded-t-lg transition-all duration-1000 ease-out
                        ${
                          height >= targetHeight
                            ? "from-success-400 to-success-600"
                            : "from-warning-400 to-warning-600"
                        }
                      `}
                      style={{ height: `${height * 1.6}px` }}
                    />

                    {/* Value label */}
                    <div className="absolute -top-6 text-xs font-medium text-surface-700">
                      {point.value}%
                    </div>
                  </div>

                  {/* Period label */}
                  <div className="text-xs text-surface-600 font-medium">
                    {point.period}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-surface-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-gradient-to-r from-success-400 to-success-600 rounded" />
              <span className="text-surface-600">Acima da meta</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-gradient-to-r from-warning-400 to-warning-600 rounded" />
              <span className="text-surface-600">Abaixo da meta</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-brand-400" />
              <span className="text-surface-600">Meta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
