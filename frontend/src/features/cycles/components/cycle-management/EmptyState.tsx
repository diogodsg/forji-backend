import { Zap } from "lucide-react";

interface EmptyStateProps {
  onCreateCycle: () => void;
}

export function EmptyState({ onCreateCycle }: EmptyStateProps) {
  return (
    <div className="text-center py-16 max-w-2xl mx-auto">
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Zap className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Pronto para começar sua jornada?
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Crie seu primeiro ciclo de desenvolvimento em apenas 5 minutos e comece
        a acompanhar seu crescimento profissional.
      </p>

      {/* Benefícios visíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-violet-50 rounded-lg">
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-medium text-gray-800">Defina Metas</div>
          <div className="text-sm text-gray-600">
            Objetivos claros e mensuráveis
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">📈</div>
          <div className="font-medium text-gray-800">Acompanhe Progresso</div>
          <div className="text-sm text-gray-600">Visualize sua evolução</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-medium text-gray-800">Celebre Conquistas</div>
          <div className="text-sm text-gray-600">Ganhe XP e reconhecimento</div>
        </div>
      </div>

      <button
        onClick={onCreateCycle}
        className="bg-gradient-to-r from-violet-600 to-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        🚀 Criar Primeiro Ciclo
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Templates inteligentes para começar rapidamente
      </p>
    </div>
  );
}
