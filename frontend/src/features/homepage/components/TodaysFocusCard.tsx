import { CheckCircle, Clock, Zap, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  timeEstimate: string;
  priority: "critical" | "quick-win" | "growth";
  action: () => void;
  completed?: boolean;
}

interface TodaysFocusCardProps {
  actions: QuickAction[];
  onActionComplete: (actionId: string) => void;
  className?: string;
}

/**
 * Card de foco diário com quick actions priorizadas
 * Máximo 3 ações para não sobrecarregar o colaborador
 */
export function TodaysFocusCard({
  actions,
  onActionComplete,
  className = "",
}: TodaysFocusCardProps) {
  const [completingAction, setCompletingAction] = useState<string | null>(null);

  const getPriorityConfig = (priority: QuickAction["priority"]) => {
    switch (priority) {
      case "critical":
        return {
          label: "Crítico",
          color: "red",
          icon: <CheckCircle className="w-3 h-3" />,
          bgColor: "bg-error-50",
          borderColor: "border-error-200",
          textColor: "text-error-700",
          badgeColor: "bg-error-100 text-error-700",
        };
      case "quick-win":
        return {
          label: "Quick Win",
          color: "emerald",
          icon: <Zap className="w-3 h-3" />,
          bgColor: "bg-success-50",
          borderColor: "border-success-200",
          textColor: "text-success-700",
          badgeColor: "bg-success-100 text-success-700",
        };
      case "growth":
        return {
          label: "Crescimento",
          color: "blue",
          icon: <Star className="w-3 h-3" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          badgeColor: "bg-blue-100 text-blue-700",
        };
    }
  };

  const handleActionClick = async (action: QuickAction) => {
    if (action.completed) return;

    setCompletingAction(action.id);
    try {
      await action.action();
      onActionComplete(action.id);
    } finally {
      setCompletingAction(null);
    }
  };

  const activeActions = actions
    .filter((action) => !action.completed)
    .slice(0, 3);
  const completedCount = actions.filter((action) => action.completed).length;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-surface-300 ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Foco de Hoje
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {completedCount > 0 && `${completedCount} concluídas • `}
              Máximo 3 ações priorizadas
            </p>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="space-y-4">
          {activeActions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Parabéns!</h4>
              <p className="text-gray-600 text-sm">
                Você completou todas as ações de hoje!
              </p>
            </div>
          ) : (
            activeActions.map((action) => {
              const config = getPriorityConfig(action.priority);
              const isCompleting = completingAction === action.id;

              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={isCompleting}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    hover:shadow-md hover:scale-[1.01]
                    ${config.bgColor} ${config.borderColor}
                    ${
                      isCompleting
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Priority Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`
                          inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium
                          ${config.badgeColor}
                        `}
                        >
                          {config.icon} {config.label}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {action.timeEstimate}
                        </div>
                      </div>

                      {/* Action Title */}
                      <h4 className={`font-semibold mb-1 ${config.textColor}`}>
                        {action.title}
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">
                        {action.description}
                      </p>

                      {/* XP Reward */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-600">
                            +{action.xpReward} XP
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-400">
                          {isCompleting ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Progress Summary */}
        {actions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-surface-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progresso diário</span>
              <span className="text-gray-500">
                {completedCount}/{actions.length} concluídas
              </span>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / actions.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
