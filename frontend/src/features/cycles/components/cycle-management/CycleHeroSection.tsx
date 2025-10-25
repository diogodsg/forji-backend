import { Flame, TrendingUp, Calendar, Target } from "lucide-react";
import { Avatar } from "../../../profile/components/Avatar";

interface CycleHeroSectionProps {
  user: {
    name: string;
    avatarId?: string;
  };
  cycle: {
    name: string;
    progress: number;
    xpCurrent: number; // XP no nível atual (ex: 1070)
    xpNextLevel: number; // XP necessário para próximo nível (ex: 2500)
    currentLevel: number;
    streak: number;
    daysRemaining: number;
  };
}

/**
 * CycleHeroSection - Seção Hero seguindo Design System Violet
 *
 * **Padrões aplicados:**
 * - Background: gradient from-surface-50 to-surface-100 (padrão do sistema)
 * - Cards: bg-white rounded-xl border-surface-300 shadow-sm (padrão)
 * - Tipografia: text-4xl font-bold para hero, text-xl font-bold para métricas
 * - Cores brand: #7c3aed (brand-600) para elementos principais
 * - Espaçamento: p-6 para cards, gap-6 para grid
 */
export function CycleHeroSection({ user, cycle }: CycleHeroSectionProps) {
  // Cálculos para progressão de nível
  const progressToNextLevel = Math.min(
    (cycle.xpCurrent / cycle.xpNextLevel) * 100,
    100
  );

  return (
    <div className="bg-gradient-to-br from-surface-50 to-surface-100 rounded-2xl p-6 shadow-lg border border-surface-300">
      {/* Header com Avatar e Saudação */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar avatarId={user.avatarId} size="2xl" className="shadow-sm" />
            {/* Badge de nível seguindo padrão de badges */}
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-medium px-2 py-1 rounded-lg shadow-sm">
              L{cycle.currentLevel}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Olá, {user.name}!
            </h1>
            <p className="text-brand-600 text-lg font-medium mt-1">
              {cycle.name}
            </p>
          </div>
        </div>

        {/* Streak Badge seguindo padrão de cards brand */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <div className="text-center">
              <div className="text-xl font-bold text-amber-700">
                {cycle.streak}
              </div>
              <div className="text-xs uppercase tracking-wide text-amber-600 font-medium">
                semanas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Métricas seguindo padrão do design system */}
      <div className="grid grid-cols-3 gap-6">
        {/* Card de Progresso */}
        <div className="bg-white rounded-xl p-5 border border-surface-300 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Progresso</h3>
              <p className="text-sm text-gray-600">do ciclo atual</p>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-brand-600 mb-2">
              {cycle.progress}%
            </div>
          </div>
          <div className="w-full bg-surface-200 rounded-lg h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-lg transition-all duration-500"
              style={{ width: `${cycle.progress}%` }}
            />
          </div>
        </div>

        {/* Card de XP */}
        <div className="bg-white rounded-xl p-5 border border-surface-300 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Experiência
              </h3>
              <p className="text-sm text-gray-600">nível atual</p>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-xl font-bold text-emerald-600 mb-2">
              {cycle.xpCurrent.toLocaleString()} XP
            </div>
          </div>
          <div className="w-full bg-emerald-100 rounded-lg h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-lg transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>

        {/* Card de Tempo */}
        <div className="bg-white rounded-xl p-5 border border-surface-300 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Tempo</h3>
              <p className="text-sm text-gray-600">restante</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-violet-600 mb-1">
              {cycle.daysRemaining}
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
              {cycle.daysRemaining === 1 ? "DIA RESTANTE" : "DIAS RESTANTES"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
