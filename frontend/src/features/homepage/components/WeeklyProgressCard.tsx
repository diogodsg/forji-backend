import { Target, TrendingUp, Calendar, Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WeeklyProgressCardProps {
  weeklyStreak: number;
  weeklyGoalsCompleted: number;
  weeklyGoalsTotal: number;
  nextLevelXP: number;
  currentXP: number;
  weeklyXP: number;
  className?: string;
}

/**
 * Card principal de progresso semanal para colaboradores
 * Foca em streaks semanais e progresso das metas da semana
 */
export function WeeklyProgressCard({
  weeklyStreak,
  weeklyGoalsCompleted,
  weeklyGoalsTotal,
  nextLevelXP,
  currentXP,
  weeklyXP,
  className = "",
}: WeeklyProgressCardProps) {
  const navigate = useNavigate();
  const weeklyProgress = (weeklyGoalsCompleted / weeklyGoalsTotal) * 100;
  const levelProgress = (currentXP / nextLevelXP) * 100;

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Comece sua primeira semana!";
    if (streak === 1) return "Primeira semana completa!";
    if (streak < 4) return `${streak} semanas crescendo!`;
    if (streak < 8) return `${streak} semanas em sequência!`;
    return `${streak} semanas imparáveis!`;
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return "text-gray-500 bg-surface-50 border-surface-300";
    if (streak < 4) return "text-amber-600 bg-amber-50 border-amber-200";
    if (streak < 8) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-brand-600 bg-brand-50 border-brand-200";
  };

  const getWeeklyStatus = () => {
    const completedPercentage = (weeklyGoalsCompleted / weeklyGoalsTotal) * 100;
    if (completedPercentage >= 80)
      return { text: "Excelente semana!", color: "emerald" };
    if (completedPercentage >= 60)
      return { text: "Boa semana!", color: "blue" };
    if (completedPercentage >= 40)
      return { text: "Continue assim!", color: "amber" };
    return { text: "Vamos lá!", color: "red" };
  };

  const weeklyStatus = getWeeklyStatus();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-surface-300 ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-600" />
              Meu Progresso
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Acompanhe seu desenvolvimento semanal
            </p>
          </div>
          <button
            onClick={() => navigate("/me/pdi")}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
          >
            Ver PDI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekly Streak Hero */}
        <div
          className={`
          rounded-xl p-4 border-2 mb-6 transition-all duration-300
          ${getStreakColor(weeklyStreak)}
        `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Flame className="w-6 h-6 text-current" />
              </div>
              <div>
                <div className="font-bold text-lg">
                  {getStreakMessage(weeklyStreak)}
                </div>
                <div className="text-sm opacity-80">
                  Streak de {weeklyStreak}{" "}
                  {weeklyStreak === 1 ? "semana" : "semanas"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Goals Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-800">
                Metas desta semana
              </span>
            </div>
            <div
              className={`
              px-2 py-1 rounded-lg text-xs font-medium
              ${
                weeklyStatus.color === "emerald"
                  ? "bg-success-50 text-success-700"
                  : ""
              }
              ${weeklyStatus.color === "blue" ? "bg-blue-50 text-blue-700" : ""}
              ${
                weeklyStatus.color === "amber"
                  ? "bg-warning-50 text-warning-700"
                  : ""
              }
              ${
                weeklyStatus.color === "red" ? "bg-error-50 text-error-700" : ""
              }
            `}
            >
              {weeklyStatus.text}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {weeklyGoalsCompleted} de {weeklyGoalsTotal} completadas
              </span>
              <span className="text-gray-500">
                {Math.round(weeklyProgress)}%
              </span>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-500
                  ${
                    weeklyStatus.color === "emerald"
                      ? "bg-gradient-to-r from-success-500 to-success-600"
                      : ""
                  }
                  ${
                    weeklyStatus.color === "blue"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : ""
                  }
                  ${
                    weeklyStatus.color === "amber"
                      ? "bg-gradient-to-r from-warning-500 to-warning-600"
                      : ""
                  }
                  ${
                    weeklyStatus.color === "red"
                      ? "bg-gradient-to-r from-error-500 to-error-600"
                      : ""
                  }
                `}
                style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span className="font-medium text-gray-800">Progresso XP</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-brand-600">
                +{weeklyXP} XP esta semana
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Progresso para próximo nível
              </span>
              <span className="text-gray-500">
                {Math.round(levelProgress)}%
              </span>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(levelProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {nextLevelXP - currentXP} XP para o próximo nível
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
