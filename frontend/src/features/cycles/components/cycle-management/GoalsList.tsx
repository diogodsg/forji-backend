import { Target, ChevronRight } from "lucide-react";

interface GoalsListProps {
  goals: any[] | null;
  onGoalClick: (goalId: string) => void;
  onCreateCycle: () => void;
}

export function GoalsList({
  goals,
  onGoalClick,
  onCreateCycle,
}: GoalsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          🎯 Metas em Foco
        </h3>
        <span className="text-sm text-gray-500">
          {goals?.length || 0} ativas
        </span>
      </div>

      <div className="space-y-4">
        {goals?.slice(0, 3).map((goal: any, index: number) => (
          <div
            key={goal.id || index}
            className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            onClick={() => onGoalClick(goal.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800 group-hover:text-violet-600 transition-colors">
                {goal.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-violet-600">
                  {goal.progress || 0}%
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-violet-600 to-violet-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress || 0}%` }}
              />
            </div>

            {goal.description && (
              <p className="text-sm text-gray-600 truncate">
                {goal.description}
              </p>
            )}
          </div>
        )) || (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2">Nenhuma meta definida ainda</p>
            <button
              onClick={onCreateCycle}
              className="text-violet-600 hover:text-violet-700 font-medium text-sm"
            >
              Definir primeiras metas →
            </button>
          </div>
        )}
      </div>

      {goals && goals.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-violet-600 hover:text-violet-700 font-medium">
            Ver todas as {goals.length} metas →
          </button>
        </div>
      )}
    </div>
  );
}
