import { Building2, TrendingUp, Users, DollarSign } from "lucide-react";

interface CompanyHealthOverviewProps {
  companyHealth: {
    score: number; // 0-100
    totalTeams: number;
    totalEmployees: number;
  };
  growthMetrics: {
    quarterlyGrowth: number; // percentage
    previousQuarter: number;
    xpGrowth: number;
  };
  roiIndicators: {
    employeeRetention: number; // percentage
    promotionRate: number; // percentage
    savingsFromPromotions: number; // dollar amount
  };
  className?: string;
}

/**
 * Hero section para CEOs - visão geral da saúde da empresa
 * Company health score, total teams, growth metrics e ROI indicators
 */
export function CompanyHealthOverview({
  companyHealth,
  growthMetrics,
  roiIndicators,
  className = "",
}: CompanyHealthOverviewProps) {
  // Determinar cor do company health score
  const getHealthScoreConfig = (score: number) => {
    if (score >= 90) {
      return {
        color: "success",
        bgColor: "bg-success-50",
        ringColor: "text-success-500",
        textColor: "text-success-700",
        message: "Empresa em excelência operacional",
      };
    } else if (score >= 75) {
      return {
        color: "brand",
        bgColor: "bg-brand-50",
        ringColor: "text-brand-500",
        textColor: "text-brand-700",
        message: "Performance sólida da empresa",
      };
    } else if (score >= 60) {
      return {
        color: "warning",
        bgColor: "bg-warning-50",
        ringColor: "text-warning-500",
        textColor: "text-warning-700",
        message: "Empresa precisa de atenção em algumas áreas",
      };
    } else {
      return {
        color: "error",
        bgColor: "bg-error-50",
        ringColor: "text-error-500",
        textColor: "text-error-700",
        message: "Situação crítica - intervenção necessária",
      };
    }
  };

  const healthConfig = getHealthScoreConfig(companyHealth.score);

  // SVG Ring Progress for Company Health Score
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (companyHealth.score / 100) * circumference;

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-success-600";
    if (growth < 0) return "text-error-600";
    return "text-surface-600";
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return "↗";
    if (growth < 0) return "↘";
    return "→";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-surface-800">
            Saúde da Empresa
          </h2>
          <p className="text-surface-600">
            Visão executiva consolidada de todos os times
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Company Health Score Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 mb-4">
            <svg
              className="w-36 h-36 transform -rotate-90"
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
                <div className="text-3xl font-bold text-surface-800">
                  {companyHealth.score}%
                </div>
                <div className="text-sm text-surface-500 font-medium">
                  SAÚDE
                </div>
              </div>
            </div>
          </div>
          <div
            className={`text-center px-4 py-3 rounded-lg ${healthConfig.bgColor}`}
          >
            <p className={`text-sm font-medium ${healthConfig.textColor}`}>
              {healthConfig.message}
            </p>
          </div>
        </div>

        {/* Total Teams & Employees */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-18 h-18 mx-auto mb-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-9 h-9 text-white" />
            </div>
            <div className="text-4xl font-bold text-brand-600 mb-2">
              {companyHealth.totalTeams}
            </div>
            <div className="text-sm uppercase tracking-wide text-surface-500 font-medium">
              TIMES ATIVOS
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <p className="text-brand-700 text-sm font-medium text-center">
              {companyHealth.totalEmployees} colaboradores
            </p>
            <p className="text-brand-600 text-xs text-center mt-2">
              Média:{" "}
              {Math.round(
                companyHealth.totalEmployees / companyHealth.totalTeams
              )}{" "}
              pessoas/time
            </p>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-18 h-18 mx-auto mb-4 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-9 h-9 text-white" />
            </div>
            <div className="text-4xl font-bold text-success-600 mb-2">
              +{growthMetrics.quarterlyGrowth}%
            </div>
            <div className="text-sm uppercase tracking-wide text-surface-500 font-medium">
              CRESCIMENTO Q4
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-600">XP da empresa:</span>
              <span
                className={`font-medium ${getGrowthColor(
                  growthMetrics.xpGrowth
                )}`}
              >
                {getGrowthIcon(growthMetrics.xpGrowth)}{" "}
                {Math.abs(growthMetrics.xpGrowth)}%
              </span>
            </div>
            <p className="text-surface-500 text-xs text-center">
              vs trimestre anterior
            </p>
          </div>
        </div>

        {/* ROI Indicators */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-18 h-18 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-9 h-9 text-white" />
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              {formatCurrency(roiIndicators.savingsFromPromotions)}
            </div>
            <div className="text-sm uppercase tracking-wide text-surface-500 font-medium">
              ECONOMIA ANUAL
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-600">Retenção:</span>
              <span className="font-medium text-success-600">
                {roiIndicators.employeeRetention}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-600">Promoções internas:</span>
              <span className="font-medium text-brand-600">
                {roiIndicators.promotionRate}%
              </span>
            </div>
            <p className="text-surface-500 text-xs text-center mt-2">
              vs contratações externas
            </p>
          </div>
        </div>
      </div>

      {/* Bottom KPIs */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span className="text-lg font-bold text-surface-800">
              {companyHealth.totalTeams}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            TIMES
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-success-600" />
            <span className="text-lg font-bold text-surface-800">
              {companyHealth.totalEmployees}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            PESSOAS
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-lg font-bold text-surface-800">
              +{growthMetrics.quarterlyGrowth}%
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            CRESCIMENTO
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-lg font-bold text-surface-800">
              {roiIndicators.employeeRetention}%
            </span>
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            RETENÇÃO
          </div>
        </div>
      </div>
    </div>
  );
}
