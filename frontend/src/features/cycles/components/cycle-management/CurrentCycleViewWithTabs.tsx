import React, { useState } from "react";
import { Target, Calendar, Trophy, Users, Zap } from "lucide-react";
import { useCurrentCycle } from "../../hooks";
import { QuickCycleCreator } from "./QuickCycleCreator";
import { OneOnOneRecorder } from "../tracking-recorders/OneOnOneRecorder";
import { CompetencyManager } from "../competency-management/CompetencyManager";
import type { OneOnOneRecord } from "../../types";

type TabType = "overview" | "create" | "competencies" | "oneononnes";

// Componente de abas
const Tab: React.FC<{
  id: TabType;
  icon: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
      active
        ? "bg-violet-100 text-violet-700 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
    {count !== undefined && (
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          active ? "bg-violet-200 text-violet-800" : "bg-gray-200 text-gray-600"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// Componente de overview do ciclo (conteúdo original do CurrentCycleView)
const CycleOverview: React.FC = () => {
  const { currentCycle, loading, updateCycleGoal, hasActiveCycle } =
    useCurrentCycle();

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="bg-white rounded-xl h-48 shadow-sm"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl h-64 shadow-sm"></div>
            ))}
          </div>
          <div className="bg-white rounded-xl h-96 shadow-sm"></div>
        </div>
      </div>
    );
  }

  if (!hasActiveCycle || !currentCycle) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Target className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🎯 Pronto para evoluir?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Crie seu primeiro ciclo de desenvolvimento e comece a conquistar suas
          metas profissionais!
        </p>
        <button className="bg-gradient-to-r from-violet-600 to-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          🚀 Criar Ciclo Rápido - 5 minutos
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Templates inteligentes para começar rapidamente
        </p>
      </div>
    );
  }

  // Header do ciclo atual
  const CycleHeader = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-md">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {currentCycle.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {currentCycle.description}
            </p>
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
            {currentCycle.daysRemaining}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-gray-600">Progresso</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {currentCycle.progressPercentage}%
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">XP Ganho</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {currentCycle.xpEarned}
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
            {currentCycle.goals.length}
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
            {currentCycle.progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-violet-600 to-violet-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${currentCycle.progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Card de meta individual
  const GoalCard: React.FC<{ goal: any }> = ({ goal }) => {
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

    const progress = getProgressPercentage();
    const isCompleted = progress >= 100;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-violet-600" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {goal.type === "quantity"
                ? "Quantidade"
                : goal.type === "deadline"
                ? "Prazo"
                : "Melhoria"}
            </span>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Concluída
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {goal.title}
          </h3>
          <p className="text-sm text-gray-600">{goal.description}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">
              Completude
            </span>
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

        <button
          onClick={() => updateCycleGoal(goal.id, {})}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Atualizar Progresso
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <CycleHeader />

      {/* Layout principal: Metas + Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Metas em Foco */}
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
            {currentCycle.goals.map((goal: any) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="lg:col-span-2 space-y-6">
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
        </div>
      </div>
    </div>
  );
};

// Componente principal com sistema de abas
export const CurrentCycleView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showOneOnOneModal, setShowOneOnOneModal] = useState(false);

  const handleSaveOneOnOne = (oneOnOne: OneOnOneRecord) => {
    console.log("1:1 salvo:", oneOnOne);
    setShowOneOnOneModal(false);
  };

  const tabs = [
    {
      id: "overview" as const,
      icon: <Target className="w-5 h-5" />,
      label: "Visão Geral",
    },
    {
      id: "create" as const,
      icon: <Zap className="w-5 h-5" />,
      label: "Criar Ciclo",
    },
    {
      id: "competencies" as const,
      icon: <Trophy className="w-5 h-5" />,
      label: "Competências",
      count: 3, // Número de competências ativas
    },
    {
      id: "oneononnes" as const,
      icon: <Users className="w-5 h-5" />,
      label: "1:1s",
      count: 2, // Número de 1:1s pendentes
    },
  ];

  return (
    <div className="min-h-full w-full bg-gray-50 p-8 space-y-8">
      {/* Navegação por abas */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            count={tab.count}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Conteúdo das abas */}
      <div className="min-h-[600px]">
        {activeTab === "overview" && <CycleOverview />}
        {activeTab === "create" && <QuickCycleCreator />}
        {activeTab === "competencies" && <CompetencyManager />}
        {activeTab === "oneononnes" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                📝 Histórico de 1:1s
              </h2>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">
                  Seus registros de 1:1s aparecerão aqui. Use as ações rápidas
                  para criar novos registros.
                </p>
                <button
                  onClick={() => setShowOneOnOneModal(true)}
                  className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  ➕ Registrar Novo 1:1
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal OneOnOne */}
      <OneOnOneRecorder
        isOpen={showOneOnOneModal}
        onClose={() => setShowOneOnOneModal(false)}
        onSave={handleSaveOneOnOne}
      />
    </div>
  );
};
