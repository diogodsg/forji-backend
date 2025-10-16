import { TrendingUp, Target, Users, BarChart3 } from "lucide-react";

interface TeamAnalyticsData {
  xpTrend: {
    current: number;
    previous: number;
    change: number; // percentage
  };
  goalCompletion: {
    completed: number;
    total: number;
    weeklyRate: number; // percentage
  };
  engagement: {
    score: number; // 1-10
    trend: "up" | "down" | "stable";
    activities: number; // daily average
  };
  topSkills: {
    skill: string;
    members: number;
    progress: number; // percentage
  }[];
}

interface TeamAnalyticsProps {
  data: TeamAnalyticsData;
  className?: string;
}

/**
 * Métricas visuais de performance da equipe
 * Foco em trends, completion rates e engagement
 */
export function TeamAnalytics({ data, className = "" }: TeamAnalyticsProps) {
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-success-600";
    if (change < 0) return "text-error-600";
    return "text-surface-600";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return "↗";
    if (change < 0) return "↘";
    return "→";
  };

  const getEngagementConfig = (score: number) => {
    if (score >= 8) {
      return {
        label: "Excelente",
        color: "text-success-600",
        bgColor: "bg-success-50",
        barColor: "bg-gradient-to-r from-success-400 to-success-600",
      };
    } else if (score >= 6) {
      return {
        label: "Bom",
        color: "text-warning-600",
        bgColor: "bg-warning-50",
        barColor: "bg-gradient-to-r from-warning-400 to-warning-600",
      };
    } else {
      return {
        label: "Precisa atenção",
        color: "text-error-600",
        bgColor: "bg-error-50",
        barColor: "bg-gradient-to-r from-error-400 to-error-600",
      };
    }
  };

  const engagementConfig = getEngagementConfig(data.engagement.score);

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
            Performance da Equipe
          </h2>
          <p className="text-surface-600 text-sm">
            Tendências e métricas semanais
          </p>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* XP Trend */}
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-4 border border-brand-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-brand-800 text-sm">
              XP da Equipe
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-700">
                {data.xpTrend.current.toLocaleString()}
              </span>
              <span className="text-xs text-brand-600 font-medium">
                XP TOTAL
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${getChangeColor(
                  data.xpTrend.change
                )}`}
              >
                {getChangeIcon(data.xpTrend.change)}{" "}
                {Math.abs(data.xpTrend.change)}%
              </span>
              <span className="text-brand-600 text-xs">vs semana anterior</span>
            </div>

            {/* Simple trend line visualization */}
            <div className="mt-3">
              <div className="w-full bg-brand-200 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (data.xpTrend.current / (data.xpTrend.current + 1000)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-brand-600 text-xs mt-1">
                Progresso desta semana
              </p>
            </div>
          </div>
        </div>

        {/* Goal Completion */}
        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-success-600" />
            <h3 className="font-semibold text-success-800 text-sm">
              Metas Concluídas
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-success-700">
                {data.goalCompletion.weeklyRate}%
              </span>
              <span className="text-xs text-success-600 font-medium">
                ESTA SEMANA
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-success-600 text-sm">
                {data.goalCompletion.completed} de {data.goalCompletion.total}{" "}
                metas
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-success-200 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-500"
                  style={{ width: `${data.goalCompletion.weeklyRate}%` }}
                />
              </div>
              <p className="text-success-600 text-xs mt-1">
                Taxa de conclusão semanal
              </p>
            </div>
          </div>
        </div>

        {/* Engagement Score */}
        <div
          className={`bg-gradient-to-br from-surface-50 to-surface-100 rounded-xl p-4 border border-surface-200 ${engagementConfig.bgColor}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-surface-600" />
            <h3 className="font-semibold text-surface-800 text-sm">
              Engajamento
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-surface-700">
                {data.engagement.score.toFixed(1)}
              </span>
              <span className="text-xs text-surface-600 font-medium">/10</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${engagementConfig.color}`}>
                {engagementConfig.label}
              </span>
              <span className="text-surface-600 text-xs">
                {data.engagement.activities} atividades/dia
              </span>
            </div>

            {/* Engagement bar */}
            <div className="mt-3">
              <div className="w-full bg-surface-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${engagementConfig.barColor}`}
                  style={{ width: `${(data.engagement.score / 10) * 100}%` }}
                />
              </div>
              <p className="text-surface-600 text-xs mt-1">
                Score baseado em atividade e feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Skills Development */}
      <div>
        <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-600" />
          Top Skills em Desenvolvimento
        </h3>

        <div className="space-y-3">
          {data.topSkills.slice(0, 4).map((skill, index) => (
            <div key={skill.skill} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                #{index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-surface-800 text-sm">
                    {skill.skill}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-surface-600">
                    <Users className="w-3 h-3" />
                    <span>{skill.members} pessoas</span>
                  </div>
                </div>

                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>

              <span className="text-brand-600 font-medium text-sm">
                {skill.progress}%
              </span>
            </div>
          ))}
        </div>

        {data.topSkills.length === 0 && (
          <div className="text-center py-4 bg-surface-50 rounded-lg">
            <p className="text-surface-500 text-sm">
              Nenhuma skill em desenvolvimento ativo no momento.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-surface-200">
        <button className="w-full inline-flex items-center justify-center gap-2 text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors">
          <BarChart3 className="w-4 h-4" />
          Ver Relatório Detalhado
        </button>
      </div>
    </div>
  );
}
