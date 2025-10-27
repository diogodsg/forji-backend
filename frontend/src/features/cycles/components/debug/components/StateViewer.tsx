import { useCycleDebugState } from "../../../hooks";
import { JsonViewer } from "./JsonViewer";

export function StateViewer() {
  const { managerState, storeState, metrics, openModals } =
    useCycleDebugState();

  const debugInfo = {
    // Métricas essenciais
    metrics,

    // Estados dos modais abertos
    openModals,

    // Estado do ciclo atual
    currentCycle: {
      id: managerState.cycle?.id,
      name: managerState.cycle?.name,
      status: "ACTIVE", // Default status since not in CycleResponseDto
      progressPercentage: 0, // Calculate or default to 0
      daysRemaining: 0, // Calculate or default to 0
      xpEarned: 0, // Default to 0 since not in CycleResponseDto
    },

    // Loading states
    loading: {
      cycle: managerState.cycleLoading,
      goals: managerState.goalsLoading,
      update: managerState.updateLoading,
    },

    // UI State
    ui: managerState.ui,
  };

  const goalSummary =
    managerState.goals?.map((goal, index) => ({
      index: index + 1,
      id: goal.id,
      title:
        goal.title.substring(0, 25) + (goal.title.length > 25 ? "..." : ""),
      type: goal.type,
      progress:
        goal.type === "INCREASE" || goal.type === "PERCENTAGE"
          ? `${goal.currentValue || 0}/${goal.targetValue || 0}`
          : goal.type === "BINARY"
          ? goal.completedAt
            ? "✅ Done"
            : "⏳ Pending"
          : `${goal.currentValue || 0}/${goal.targetValue || 0}`,
      isCompleted: managerState.completedGoals.includes(goal),
    })) || [];

  return (
    <div className="space-y-3">
      <JsonViewer
        data={debugInfo}
        title="🔄 Cycle Manager State"
        maxHeight="max-h-32"
      />

      {goalSummary.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            🎯 Goals Summary ({goalSummary.length})
          </h4>
          <div className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto max-h-24">
            {goalSummary.map((goal) => (
              <div
                key={goal.id}
                className="flex justify-between items-center py-1"
              >
                <span
                  className={
                    goal.isCompleted ? "text-green-300" : "text-yellow-300"
                  }
                >
                  {goal.index}. {goal.title}
                </span>
                <span className="text-blue-300">{goal.progress}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <JsonViewer
        data={storeState}
        title="📊 Raw Store State"
        maxHeight="max-h-32"
      />
    </div>
  );
}
