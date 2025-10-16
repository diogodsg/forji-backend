import { TrendingUp, Award, Zap } from "lucide-react";
import { CurrentCycleMain } from "../features/cycles";
import { useState } from "react";

type ModalType =
  | "createCycle"
  | "oneOnOne"
  | "mentoring"
  | "certification"
  | "milestone"
  | "competencies"
  | null;

/**
 * Página de Desenvolvimento - experiência gamificada otimizada
 * - Hero section motivacional com progresso visual
 * - Ações rápidas priorizadas
 * - Layout otimizado para velocidade e recompensa
 */
export function CurrentCyclePage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Mock data - será substituído por hooks reais
  const currentUser = { name: "Daniel", initials: "DA" };
  const currentCycle = {
    name: "Q4 2025 - Liderança Técnica",
    progress: 62,
    xpCurrent: 2840,
    xpNextLevel: 3500,
    streak: 4,
    daysRemaining: 77,
  };

  const progressToNextLevel = ((currentCycle.xpCurrent % 1000) / 1000) * 100;
  const currentLevel = Math.floor(currentCycle.xpCurrent / 1000) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Hero Section Gamificada */}
        <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-surface-300 shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Lado Esquerdo - Saudação + Avatar */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {currentUser.initials}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                    Olá, {currentUser.name}!
                  </h1>

                  {/* Streak Badge */}
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentCycle.streak} semanas crescendo!
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-1">
                  Continue sua jornada de desenvolvimento
                </p>
                <p className="text-brand-600 font-medium">
                  {currentCycle.name}
                </p>
              </div>
            </div>

            {/* Lado Direito - Progress Circle + XP */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Progresso do Ciclo */}
              <div className="text-center">
                <div className="relative w-24 h-24 mb-3">
                  {/* Circle Background */}
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-surface-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-brand-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${currentCycle.progress}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>

                  {/* Percentage Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand-600">
                      {currentCycle.progress}%
                    </span>
                  </div>
                </div>

                <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Progresso do Ciclo
                </div>
              </div>

              {/* XP & Level */}
              <div className="text-center">
                <div className="bg-white rounded-xl p-4 border border-surface-300 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-gray-800">
                      Nível {currentLevel}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-brand-600 mb-1">
                    {currentCycle.xpCurrent.toLocaleString()} XP
                  </div>

                  <div className="w-32 bg-surface-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressToNextLevel}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    {currentCycle.xpNextLevel - currentCycle.xpCurrent} XP para
                    próximo nível
                  </div>
                </div>
              </div>

              {/* Actions - Competências e Novo Ciclo */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setActiveModal("competencies")}
                  className="inline-flex items-center gap-2 border border-brand-300 bg-white text-brand-600 font-medium text-sm h-12 px-6 rounded-xl transition-all duration-200 hover:bg-brand-50 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                >
                  <TrendingUp className="w-5 h-5" />
                  Competências
                </button>

                <button
                  onClick={() => setActiveModal("createCycle")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-12 px-6 rounded-xl transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-brand-400 focus:outline-none shadow-lg hover:shadow-xl"
                >
                  <Award className="w-5 h-5" />
                  Novo Ciclo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <CurrentCycleMain
          activeModal={activeModal}
          onCloseModal={() => setActiveModal(null)}
          onOpenModal={(modal) => setActiveModal(modal)}
        />
      </div>
    </div>
  );
}
