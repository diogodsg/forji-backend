import { Flame, TrendingUp } from "lucide-react";

interface CycleHeroSectionProps {
  user: {
    name: string;
    initials: string;
  };
  cycle: {
    name: string;
    progress: number;
    xpCurrent: number;
    xpNextLevel: number;
    currentLevel: number;
    streak: number;
    daysRemaining: number;
  };
}

/**
 * CycleHeroSection - Seção Hero gamificada da CurrentCyclePage
 *
 * **Princípios de Design:**
 * - Gamificação central com XP, progresso e motivação
 * - Visual imediatamente recompensador
 * - Desktop-first optimized (>1200px)
 * - 100% Design System Violet compliance
 *
 * **Elementos Principais:**
 * - Avatar com gradiente brand
 * - Progress Ring do ciclo
 * - XP System com nível atual e progresso
 * - Streak badge motivacional
 * - Informações contextuais (dias restantes, nome do ciclo)
 */
export function CycleHeroSection({ user, cycle }: CycleHeroSectionProps) {
  const progressToNextLevel = ((cycle.xpCurrent % 1000) / 1000) * 100;
  const xpToNextLevel = cycle.xpNextLevel - cycle.xpCurrent;

  return (
    <div className="bg-gradient-to-br from-white to-brand-50 rounded-2xl p-8 shadow-lg border border-brand-200">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Context */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">
              {user.initials}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent tracking-tight">
              Olá, {user.name}!
            </h1>
            <p className="text-brand-600 text-base mt-1 font-medium">
              {cycle.name}
            </p>
            <p className="text-gray-600 text-sm mt-0.5">
              {cycle.daysRemaining} dias restantes
            </p>
          </div>
        </div>

        {/* Center: Progress Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            {/* Background Circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-brand-100"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-600"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${cycle.progress}, 100`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-brand-600">
                {cycle.progress}%
              </div>
              <div className="text-xs text-gray-600">do ciclo</div>
            </div>
          </div>

          <div className="text-center mt-3">
            <div className="text-sm text-gray-600 font-medium">
              Progresso geral
            </div>
          </div>
        </div>

        {/* Right: XP System + Streak */}
        <div className="text-right">
          {/* Level + XP */}
          <div className="mb-4">
            <div className="flex items-center gap-2 justify-end mb-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              <div className="text-2xl font-bold text-brand-600">
                Nível {cycle.currentLevel}
              </div>
            </div>
            <div className="text-xl text-gray-800 font-semibold">
              {cycle.xpCurrent.toLocaleString()} XP
            </div>

            {/* Progress Bar to Next Level */}
            <div className="w-40 bg-brand-100 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-full h-2.5 transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {xpToNextLevel} XP para Nível {cycle.currentLevel + 1}
            </div>
          </div>

          {/* Streak Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-2 rounded-xl border border-amber-200">
            <Flame className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <div className="text-sm font-bold text-amber-700">
                {cycle.streak} semanas
              </div>
              <div className="text-xs text-amber-600">crescendo!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
