import { Plus, TrendingUp, Target } from "lucide-react";

interface CycleHeaderProps {
  hasActiveCycle: boolean;
  onCreateCycle: () => void;
  onCompetencies: () => void;
}

export function CycleHeader({
  hasActiveCycle,
  onCreateCycle,
  onCompetencies,
}: CycleHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-surface-300 p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Ícone de destaque */}
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm">
            <Target className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              🎯 Continue sua jornada de desenvolvimento
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {hasActiveCycle
                ? "Acompanhe seu progresso, conquistas e evolução profissional"
                : "Crie seu primeiro ciclo para começar sua jornada"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveCycle && (
            <button
              onClick={onCompetencies}
              className="inline-flex items-center gap-2 border border-brand-300 bg-white text-brand-600 font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:bg-brand-50 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            >
              <TrendingUp className="w-4 h-4" />
              Competências
            </button>
          )}
          <button
            onClick={onCreateCycle}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            {hasActiveCycle ? "Novo Ciclo" : "Criar Primeiro Ciclo"}
          </button>
        </div>
      </div>
    </div>
  );
}
