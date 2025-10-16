import { TrendingUp, Award, Crown, Code, Users, Lightbulb } from "lucide-react";
import type { CompetenceUpdateData } from "./types";
import XPBreakdown from "../shared/XPBreakdown";
import { calculateBonuses } from "./utils";

interface CompetenceUpdateFormProps {
  data: CompetenceUpdateData;
  onChange: (field: keyof CompetenceUpdateData, value: any) => void;
}

export function CompetenceUpdateForm({
  data,
  onChange,
}: CompetenceUpdateFormProps) {
  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);

  const progressIncrease = data.newProgress - data.currentProgress;

  // Configuração por categoria
  const getCategoryConfig = () => {
    switch (data.category) {
      case "leadership":
        return {
          icon: Crown,
          label: "LIDERANÇA",
          color: "amber",
          gradient: "from-amber-500 to-amber-600",
        };
      case "technical":
        return {
          icon: Code,
          label: "TÉCNICO",
          color: "blue",
          gradient: "from-blue-500 to-blue-600",
        };
      case "behavioral":
        return {
          icon: Users,
          label: "COMPORTAMENTAL",
          color: "emerald",
          gradient: "from-emerald-500 to-emerald-600",
        };
      default:
        return {
          icon: Award,
          label: "COMPETÊNCIA",
          color: "brand",
          gradient: "from-brand-500 to-brand-600",
        };
    }
  };

  const categoryConfig = getCategoryConfig();
  const CategoryIcon = categoryConfig.icon;

  // Classes CSS completas para Tailwind
  const getBadgeClasses = () => {
    switch (data.category) {
      case "leadership":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "technical":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "behavioral":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-brand-50 text-brand-700 border-brand-200";
    }
  };

  const getCardClasses = () => {
    switch (data.category) {
      case "leadership":
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";
      case "technical":
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
      case "behavioral":
        return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200";
      default:
        return "bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-200";
    }
  };

  const getProgressBarClasses = () => {
    switch (data.category) {
      case "leadership":
        return "bg-gradient-to-r from-amber-500 to-amber-600";
      case "technical":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "behavioral":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600";
      default:
        return "bg-gradient-to-r from-brand-500 to-brand-600";
    }
  };

  const getIconBgClasses = () => {
    switch (data.category) {
      case "leadership":
        return "bg-gradient-to-br from-amber-500 to-amber-600";
      case "technical":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "behavioral":
        return "bg-gradient-to-br from-emerald-500 to-emerald-600";
      default:
        return "bg-gradient-to-br from-brand-500 to-brand-600";
    }
  };

  const getTextColorClasses = () => {
    switch (data.category) {
      case "leadership":
        return "text-amber-600";
      case "technical":
        return "text-blue-600";
      case "behavioral":
        return "text-emerald-600";
      default:
        return "text-brand-600";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main Content - 2/3 with scroll */}
      <div className="lg:col-span-2 overflow-y-auto pr-4">
        <div className="space-y-6 pb-4">
          {/* Competence Info */}
          <div className={`rounded-lg p-4 border-2 ${getCardClasses()}`}>
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBgClasses()}`}
              >
                <CategoryIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {data.competenceName}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Nível */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Nível Atual:</span>
                    <span className={`font-bold ${getTextColorClasses()}`}>
                      {data.currentLevel}
                    </span>
                  </div>

                  {/* Próximo Nível */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Próximo Nível:</span>
                    <span className="font-bold text-brand-600">
                      {data.targetLevel}
                    </span>
                  </div>

                  {/* Badge da categoria */}
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${getBadgeClasses()}`}
                  >
                    <CategoryIcon className="w-3 h-3" />
                    {categoryConfig.label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Update */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBgClasses()}`}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <label className="text-sm font-semibold text-gray-800">
                Progresso para o Nível {data.targetLevel} *
              </label>
            </div>

            <div className="space-y-4">
              {/* Visual Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressBarClasses()}`}
                    style={{ width: `${data.newProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>0%</span>
                  <span
                    className={`font-bold text-sm ${getTextColorClasses()}`}
                  >
                    {data.newProgress}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-2">
                <style>
                  {`
                    .competence-slider-${data.category} {
                      background: #e5e7eb !important;
                    }
                    
                    .competence-slider-${data.category}::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: ${
                        categoryConfig.color === "amber"
                          ? "#f59e0b"
                          : categoryConfig.color === "blue"
                          ? "#3b82f6"
                          : "#10b981"
                      };
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    
                    .competence-slider-${data.category}::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: ${
                        categoryConfig.color === "amber"
                          ? "#f59e0b"
                          : categoryConfig.color === "blue"
                          ? "#3b82f6"
                          : "#10b981"
                      };
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    
                    .competence-slider-${data.category}::-moz-range-track {
                      background: #e5e7eb;
                      height: 8px;
                      border-radius: 8px;
                    }
                  `}
                </style>
                <input
                  type="range"
                  min={data.currentProgress}
                  max="100"
                  value={data.newProgress}
                  onChange={(e) =>
                    onChange("newProgress", Number(e.target.value))
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer competence-slider-${data.category}`}
                />
              </div>

              {/* Info */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Mínimo: {data.currentProgress}%
                </span>
                {progressIncrease > 0 && (
                  <span
                    className={`font-medium flex items-center gap-1 ${getTextColorClasses()}`}
                  >
                    <TrendingUp className="w-3 h-3" />+{progressIncrease}%
                  </span>
                )}
                <span className="text-gray-500">Máximo: 100%</span>
              </div>

              {/* Hint */}
              <div className="mt-2 p-2 bg-brand-50 rounded-lg border border-brand-200">
                <p className="text-xs text-brand-700 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Atualize conforme você avança rumo ao próximo nível desta
                  competência
                </p>
              </div>

              {/* Level Achievement Alert */}
              {data.newProgress === 100 && (
                <div className={`p-3 rounded-lg border ${getBadgeClasses()}`}>
                  <p
                    className={`text-sm font-medium flex items-center gap-2 ${getTextColorClasses()}`}
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      Parabéns! Você alcançará o nível {data.targetLevel} e
                      ganhará +40 XP bônus!
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* XP Sidebar - 1/3 */}
      <div className="lg:sticky lg:top-0 lg:h-fit">
        <XPBreakdown bonuses={bonuses} total={totalXP} />
      </div>
    </div>
  );
}
