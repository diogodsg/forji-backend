import React from "react";
import { Calendar, Target, Zap, Users } from "lucide-react";
import { useCurrentCycle } from "../../hooks";
import type { CycleGoal } from "../../types";

// Componente para o header do ciclo atual
const CycleHeader: React.FC<{
  cycle: NonNullable<ReturnType<typeof useCurrentCycle>["currentCycle"]>;
}> = ({ cycle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-md">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {cycle.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{cycle.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Ativo
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-gray-600">
              Dias Restantes
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {cycle.daysRemaining}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-gray-600">Progresso</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {cycle.progressPercentage}%
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">XP Ganho</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {cycle.xpEarned}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Metas Ativas
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {cycle.goals.length}
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Progresso Geral
          </span>
          <span className="text-sm font-bold text-violet-600">
            {cycle.progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-violet-600 to-violet-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${cycle.progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Componente para card de meta individual
const GoalCard: React.FC<{
  goal: CycleGoal;
  onUpdate: (goalId: string, updates: Partial<CycleGoal>) => void;
}> = ({ goal, onUpdate }) => {
  const getProgressPercentage = () => {
    switch (goal.type) {
      case "quantity":
        if (!goal.targetNumber) return 0;
        return Math.min(
          ((goal.currentNumber || 0) / goal.targetNumber) * 100,
          100
        );

      case "deadline":
        return goal.completed ? 100 : 0;

      case "improvement":
        if (!goal.initialValue || !goal.targetValue) return 0;
        const total = goal.targetValue - goal.initialValue;
        const current =
          (goal.currentValue || goal.initialValue) - goal.initialValue;
        return Math.min((current / total) * 100, 100);

      default:
        return 0;
    }
  };

  const getTypeIcon = () => {
    switch (goal.type) {
      case "quantity":
        return <Target className="w-5 h-5 text-violet-600" />;
      case "deadline":
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case "improvement":
        return <Zap className="w-5 h-5 text-green-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (goal.type) {
      case "quantity":
        return "Quantidade";
      case "deadline":
        return "Prazo";
      case "improvement":
        return "Melhoria";
      default:
        return "Meta";
    }
  };

  const handleQuickUpdate = () => {
    switch (goal.type) {
      case "quantity":
        const newNumber = (goal.currentNumber || 0) + 1;
        onUpdate(goal.id, { currentNumber: newNumber });
        break;

      case "deadline":
        onUpdate(goal.id, { completed: !goal.completed });
        break;

      case "improvement":
        // Para melhorias, poderíamos abrir um modal de input
        console.log("Open improvement update modal");
        break;
    }
  };

  const progress = getProgressPercentage();
  const isCompleted = progress >= 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header da meta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {getTypeLabel()}
            </span>
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Concluída
          </div>
        )}
      </div>

      {/* Título e descrição */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {goal.title}
        </h3>
        <p className="text-sm text-gray-600">{goal.description}</p>
      </div>

      {/* Progresso específico por tipo */}
      <div className="mb-4">
        {goal.type === "quantity" && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progresso:</span>
            <span className="font-medium text-gray-800">
              {goal.currentNumber || 0} / {goal.targetNumber} {goal.unit}
            </span>
          </div>
        )}

        {goal.type === "deadline" && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Prazo:</span>
            <span className="font-medium text-gray-800">
              {goal.deadline
                ? new Date(goal.deadline).toLocaleDateString("pt-BR")
                : "Não definido"}
            </span>
          </div>
        )}

        {goal.type === "improvement" && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progresso:</span>
            <span className="font-medium text-gray-800">
              {goal.currentValue} → {goal.targetValue} {goal.metric}
            </span>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Completude</span>
          <span className="text-xs font-bold text-violet-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-green-500 to-green-400"
                : "bg-gradient-to-r from-violet-600 to-violet-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Ação rápida */}
      <button
        onClick={handleQuickUpdate}
        disabled={isCompleted && goal.type !== "deadline"}
        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
          isCompleted && goal.type !== "deadline"
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-violet-50 text-violet-700 hover:bg-violet-100 hover:scale-105 active:scale-95"
        }`}
      >
        {goal.type === "quantity" && !isCompleted && "Atualizar Progresso"}
        {goal.type === "deadline" &&
          "Marcar como " + (goal.completed ? "Pendente" : "Concluída")}
        {goal.type === "improvement" && !isCompleted && "Atualizar Valor"}
        {isCompleted && goal.type !== "deadline" && "Meta Concluída ✅"}
      </button>
    </div>
  );
};

// Componente principal do Ciclo Atual
export const CurrentCycleView: React.FC = () => {
  const { currentCycle, loading, updateCycleGoal, hasActiveCycle } =
    useCurrentCycle();

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-8">
        <div className="animate-pulse space-y-8">
          <div className="bg-white rounded-xl h-48 shadow-sm"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl h-64 shadow-sm"
                ></div>
              ))}
            </div>
            <div className="bg-white rounded-xl h-96 shadow-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasActiveCycle || !currentCycle) {
    return (
      <div className="min-h-full w-full bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 Pronto para evoluir?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Crie seu primeiro ciclo de desenvolvimento e comece a conquistar
            suas metas profissionais!
          </p>
          <button className="bg-gradient-to-r from-violet-600 to-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
            🚀 Criar Ciclo Rápido - 5 minutos
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Templates inteligentes para começar rapidamente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-8 space-y-8">
      {/* Header do ciclo */}
      <CycleHeader cycle={currentCycle} />

      {/* Layout principal: Metas + Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Metas em Foco (60% da largura) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Metas em Foco
            </h2>
            <span className="text-sm text-gray-500">
              {currentCycle.goals.length} metas ativas
            </span>
          </div>

          <div className="space-y-6">
            {currentCycle.goals.map((goal: CycleGoal) => (
              <GoalCard key={goal.id} goal={goal} onUpdate={updateCycleGoal} />
            ))}
          </div>
        </div>

        {/* Ações Rápidas + Visão Geral (40% da largura) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ações Rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-3 text-left bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors">
                <Target className="w-5 h-5" />
                <div>
                  <div className="font-medium">Atualizar Progresso</div>
                  <div className="text-xs text-violet-600">
                    Registrar conquistas
                  </div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-3 text-left bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
                <Zap className="w-5 h-5" />
                <div>
                  <div className="font-medium">Nova Milestone</div>
                  <div className="text-xs text-amber-600">
                    Quebrar metas grandes
                  </div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <Users className="w-5 h-5" />
                <div>
                  <div className="font-medium">Solicitar Feedback</div>
                  <div className="text-xs text-green-600">
                    Manager ou equipe
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Próximos Passos
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <span className="text-blue-800">
                  Completar sessão de mentoria até sexta
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-purple-800">
                  Estudar 2h de AWS esta semana
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-green-800">
                  Revisar 5 PRs para reduzir bugs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
