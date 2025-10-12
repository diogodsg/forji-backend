import { FiTrendingUp, FiCalendar, FiAward, FiTarget } from "react-icons/fi";

interface PdiSummaryProps {
  userId?: number;
}

interface SummaryMetric {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function PdiSummary({ userId: _userId }: PdiSummaryProps) {
  // TODO: Implementar hook para buscar dados do backend
  const metrics: SummaryMetric[] = [
    {
      label: "Ciclos Completados",
      value: 8,
      trend: "up",
      trendValue: "+2",
      icon: FiCalendar,
      color: "text-blue-600",
    },
    {
      label: "Competências Desenvolvidas",
      value: 15,
      trend: "up",
      trendValue: "+3",
      icon: FiTrendingUp,
      color: "text-green-600",
    },
    {
      label: "Metas Alcançadas",
      value: 24,
      trend: "up",
      trendValue: "+6",
      icon: FiTarget,
      color: "text-purple-600",
    },
    {
      label: "Conquistas",
      value: 12,
      trend: "neutral",
      trendValue: "0",
      icon: FiAward,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumo da Jornada Profissional
        </h3>
        <span className="text-sm text-gray-500">Últimos 12 meses</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {metric.trend && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      metric.trend === "up"
                        ? "bg-green-100 text-green-800"
                        : metric.trend === "down"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {metric.trendValue}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {metric.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progresso geral da carreira:</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-3/4"></div>
            </div>
            <span className="font-medium text-gray-900">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
