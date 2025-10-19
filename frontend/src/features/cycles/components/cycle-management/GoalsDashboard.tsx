import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Check,
  Sparkles,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastUpdate?: Date | string; // Pode vir como Date (mock) ou string ISO (backend)
  status: "on-track" | "needs-attention" | "completed";
}

interface GoalsDashboardProps {
  goals: Goal[];
  onUpdateGoal: (goalId: string) => void;
}

/**
 * GoalsDashboard - Seção de Metas (50% do layout)
 *
 * **Princípios:**
 * - Visual claro de progresso com barras coloridas
 * - Status de atualização com alertas visuais
 * - CTA de update destacado com XP preview
 * - Incentivos para completar todas as metas
 *
 * **Estados:**
 * - on-track: Verde, atualizado recentemente
 * - needs-attention: Amarelo, precisa update
 * - completed: Azul, meta concluída
 */
export function GoalsDashboard({ goals, onUpdateGoal }: GoalsDashboardProps) {
  const allGoalsUpdated = goals.every((goal) => {
    if (goal.status === "completed") return true;
    if (!goal.lastUpdate) return false;

    const lastUpdateDate =
      typeof goal.lastUpdate === "string"
        ? new Date(goal.lastUpdate)
        : goal.lastUpdate;

    return new Date().getTime() - lastUpdateDate.getTime() < 86400000 * 2; // 2 dias
  });

  const totalXPAvailable =
    goals.filter((g) => g.status !== "completed").length * 15;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Metas do Ciclo
            </h2>
            <p className="text-sm text-gray-600">
              {goals.filter((g) => g.status === "completed").length} de{" "}
              {goals.length} concluídas
            </p>
          </div>
        </div>

        {/* Incentive Badge */}
        {!allGoalsUpdated && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <div>
              <div className="text-xs font-medium">Atualize todas</div>
              <div className="text-sm font-bold">+{totalXPAvailable} XP!</div>
            </div>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdate={() => onUpdateGoal(goal.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">Nenhuma meta definida ainda</p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg hover:opacity-90 transition-all">
            <Target className="w-4 h-4" />
            Criar Primeira Meta
          </button>
        </div>
      )}
    </div>
  );
}

// Goal Card Component
function GoalCard({ goal, onUpdate }: { goal: Goal; onUpdate: () => void }) {
  // Converter lastUpdate para Date se for string (vindo do backend)
  const lastUpdateDate = goal.lastUpdate
    ? typeof goal.lastUpdate === "string"
      ? new Date(goal.lastUpdate)
      : goal.lastUpdate
    : null;

  const daysSinceUpdate = lastUpdateDate
    ? Math.floor(
        (new Date().getTime() - lastUpdateDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999; // Nunca atualizado

  const statusConfig = {
    "on-track": {
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      progressColor: "from-emerald-400 to-emerald-600",
      label: "No caminho certo",
    },
    "needs-attention": {
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      progressColor: "from-amber-400 to-amber-600",
      label: "Precisa atenção",
    },
    completed: {
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      progressColor: "from-blue-400 to-blue-600",
      label: "Concluída",
    },
  };

  const config = statusConfig[goal.status];
  const StatusIcon = config.icon;

  return (
    <div
      className={`group bg-gradient-to-br from-white to-surface-50 rounded-xl p-5 border ${config.border} hover:border-brand-300 hover:shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
              {goal.title}
            </h3>
            <span
              className={`inline-flex items-center gap-1 ${config.bg} ${config.color} px-2 py-0.5 rounded-lg text-xs font-medium border ${config.border}`}
            >
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Progresso</span>
          <span className="text-sm font-bold text-gray-800">
            {goal.progress}%
          </span>
        </div>
        <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${config.progressColor} rounded-full transition-all duration-500`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {goal.status !== "completed" && (
            <>
              {daysSinceUpdate === 0 ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Atualizado hoje
                </span>
              ) : daysSinceUpdate === 1 ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Atualizado ontem
                </span>
              ) : daysSinceUpdate <= 3 ? (
                <span className="text-gray-600">
                  Atualizado há {daysSinceUpdate} dias
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Update há {daysSinceUpdate} dias
                </span>
              )}
            </>
          )}
          {goal.status === "completed" && (
            <span className="text-blue-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Meta concluída!
            </span>
          )}
        </div>

        {goal.status !== "completed" && (
          <button
            onClick={onUpdate}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            <TrendingUp className="w-3 h-3" />
            Update +15 XP
          </button>
        )}
      </div>

      {/* Almost Done Badge */}
      {goal.progress >= 90 && goal.status !== "completed" && (
        <div className="mt-3 pt-3 border-t border-surface-200">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">
              🔥 QUASE LÁ! Finalize agora!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
