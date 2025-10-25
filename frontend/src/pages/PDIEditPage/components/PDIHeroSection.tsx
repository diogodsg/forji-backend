import { Target, Zap, TrendingUp, Calendar } from "lucide-react";
import { Avatar } from "@/features/profile";

interface PDIHeroSectionProps {
  subordinate: any;
  cycle: any;
  goals: any[];
}

/**
 * Seção Hero melhorada para o PDI do subordinado
 */
export function PDIHeroSection({
  subordinate,
  cycle,
  goals,
}: PDIHeroSectionProps) {
  // Calcular dados reais baseados no backend
  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => goal.progress === 100).length;
  const progressPercentage =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Calcular XP total das metas
  const totalXP = goals.reduce((sum, goal) => sum + (goal.xpReward || 0), 0);
  const earnedXP = goals
    .filter((goal) => goal.progress === 100)
    .reduce((sum, goal) => sum + (goal.xpReward || 0), 0);

  // Calcular dias restantes do ciclo
  const today = new Date();
  const endDate = cycle?.endDate ? new Date(cycle.endDate) : null;
  const daysRemaining = endDate
    ? Math.max(
        0,
        Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  // Adaptar dados do usuário para o hero
  const adaptedUser = {
    id: subordinate.id,
    name: subordinate.name,
    initials: subordinate.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    avatar: subordinate.avatarId || "professional-1",
  };

  const adaptedCycle = {
    name: cycle?.name || "Ciclo de Desenvolvimento",
    totalGoals,
    completedGoals,
    progressPercentage,
    totalXP,
    earnedXP,
    daysRemaining,
    // Para o nível, usamos um cálculo simples baseado no XP ganho
    currentLevel: Math.floor(earnedXP / 100) + 1,
    xpCurrent: earnedXP % 100,
    xpNextLevel: 100,
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg border border-brand-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
              <Avatar avatarId={subordinate?.avatarId} size="2xl" />
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white">
              Lvl {adaptedCycle.currentLevel}
            </div>
          </div>

          {/* Info Principal */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {adaptedUser.name}
            </h2>
            <p className="text-gray-600 text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-600" />
              {adaptedCycle.name}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {/* Total XP */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-brand-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    XP Ganho
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {adaptedCycle.earnedXP.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  de {adaptedCycle.totalXP.toLocaleString()} possível
                </div>
              </div>

              {/* Progresso */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Progresso
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {adaptedCycle.progressPercentage}%
                </div>
                <div className="text-xs text-gray-500">
                  {adaptedCycle.completedGoals} de {adaptedCycle.totalGoals}{" "}
                  metas
                </div>
              </div>

              {/* Metas */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Metas
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {adaptedCycle.totalGoals}
                </div>
                <div className="text-xs text-gray-500">
                  {adaptedCycle.completedGoals} concluídas
                </div>
              </div>

              {/* Dias Restantes */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Dias
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {adaptedCycle.daysRemaining}
                </div>
                <div className="text-xs text-gray-500">restantes no ciclo</div>
              </div>
            </div>

            {/* Progress Bar para próximo nível */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>
                  Progresso para Level {adaptedCycle.currentLevel + 1}
                </span>
                <span className="font-semibold">
                  {adaptedCycle.xpCurrent} / {adaptedCycle.xpNextLevel} XP
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(
                      (adaptedCycle.xpCurrent / adaptedCycle.xpNextLevel) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
