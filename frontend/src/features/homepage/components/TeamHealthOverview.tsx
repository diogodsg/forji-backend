import { Heart, AlertTriangle, TrendingUp, Users } from "lucide-react";

interface TeamHealthOverviewProps {
  healthScore: number;
  criticalAlerts: number;
  weeklyProgress: {
    completed: number;
    total: number;
  };
  teamStats: {
    totalMembers: number;
    activePDIs: number;
    upcomingReviews: number;
  };
  className?: string;
}

/**
 * Hero section para managers - visão geral da saúde da equipe
 * Health score visual, alertas críticos e estatísticas rápidas
 */
export function TeamHealthOverview({
  healthScore,
  criticalAlerts,
  weeklyProgress,
  teamStats,
  className = "",
}: TeamHealthOverviewProps) {
  // Calcular progresso semanal como porcentagem
  const weeklyProgressPercent = Math.round(
    (weeklyProgress.completed / weeklyProgress.total) * 100
  );

  // Determinar cor do health score baseado no valor
  const getHealthScoreConfig = (score: number) => {
    if (score >= 85) {
      return {
        color: "success",
        bgColor: "bg-success-50",
        ringColor: "text-success-500",
        textColor: "text-success-700",
        message: "Equipe em alta performance",
      };
    } else if (score >= 70) {
      return {
        color: "warning",
        bgColor: "bg-warning-50",
        ringColor: "text-warning-500",
        textColor: "text-warning-700",
        message: "Equipe estável, algumas oportunidades",
      };
    } else {
      return {
        color: "error",
        bgColor: "bg-error-50",
        ringColor: "text-error-500",
        textColor: "text-error-700",
        message: "Equipe precisa de atenção",
      };
    }
  };

  const healthConfig = getHealthScoreConfig(healthScore);

  // SVG Ring Progress for Health Score
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-800">
            Saúde da Equipe
          </h2>
          <p className="text-surface-600 text-sm">
            Visão geral do time e pontos de atenção
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-3">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-surface-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${healthConfig.ringColor} transition-all duration-1000 ease-out`}
              />
            </svg>
            {/* Score Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-800">
                  {healthScore}%
                </div>
                <div className="text-xs text-surface-500 font-medium">
                  SAÚDE
                </div>
              </div>
            </div>
          </div>
          <div
            className={`text-center px-3 py-2 rounded-lg ${healthConfig.bgColor}`}
          >
            <p className={`text-sm font-medium ${healthConfig.textColor}`}>
              {healthConfig.message}
            </p>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-error-600 mb-1">
              {criticalAlerts}
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              PRECISAM ATENÇÃO
            </div>
          </div>

          {criticalAlerts > 0 && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3">
              <p className="text-error-700 text-sm font-medium text-center">
                {criticalAlerts === 1
                  ? "1 pessoa precisa de sua atenção hoje"
                  : `${criticalAlerts} pessoas precisam de sua atenção`}
              </p>
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-brand-600 mb-1">
              {weeklyProgressPercent}%
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              PROGRESSO SEMANAL
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-surface-200 rounded-full h-3">
              <div
                className="h-3 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgressPercent}%` }}
              />
            </div>
            <p className="text-surface-600 text-sm text-center">
              {weeklyProgress.completed} de {weeklyProgress.total} metas
              concluídas
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-surface-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-brand-600" />
            <span className="text-lg font-bold text-surface-800">
              {teamStats.totalMembers}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            MEMBROS
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-lg font-bold text-surface-800">
              {teamStats.activePDIs}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            PDIs ATIVOS
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning-600" />
            <span className="text-lg font-bold text-surface-800">
              {teamStats.upcomingReviews}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            REVIEWS
          </div>
        </div>
      </div>
    </div>
  );
}
