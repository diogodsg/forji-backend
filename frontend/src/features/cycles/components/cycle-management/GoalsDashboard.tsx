import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Check,
  Sparkles,
  Trash2,
  Edit3,
  Clock,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  Percent,
} from "lucide-react";
import type { GoalType } from "../tracking-recorders/goal-wizard/types";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastUpdate?: Date | string; // Pode vir como Date (mock) ou string ISO (backend)
  status: "on-track" | "needs-attention" | "completed";
  canUpdateNow?: boolean;
  nextUpdateDate?: string;
  // Novos campos para personalização visual
  type?: GoalType | "INCREASE" | "DECREASE" | "PERCENTAGE" | "BINARY"; // Aceita tanto minúsculas (frontend) quanto maiúsculas (backend)
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  completed?: boolean; // Para metas binárias
}

interface GoalsDashboardProps {
  goals: Goal[];
  onUpdateGoal: (goalId: string) => void;
  onEditGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onCreateGoal?: () => void;
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
export function GoalsDashboard({
  goals,
  onUpdateGoal,
  onEditGoal,
  onDeleteGoal,
  onCreateGoal,
}: GoalsDashboardProps) {
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
            onEdit={() => onEditGoal(goal.id)}
            onDelete={() => onDeleteGoal(goal.id)}
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
          {onCreateGoal && (
            <button
              onClick={onCreateGoal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              <Target className="w-4 h-4" />
              Criar Primeira Meta
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Render progress based on goal type
function renderGoalProgress(goal: Goal, config: any) {
  // Normalizar o tipo para minúsculas para compatibilidade
  const normalizedType = goal.type?.toLowerCase() as GoalType;

  switch (normalizedType) {
    case "binary":
      // Para metas binárias, não renderizamos nada aqui pois o status já está no header
      return null;

    case "increase":
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progresso</span>
            <span className="text-sm font-bold text-gray-800">
              {goal.progress}%
            </span>
          </div>
          {goal.currentValue !== undefined &&
            goal.targetValue !== undefined && (
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>
                  Atual: {goal.currentValue} {goal.unit}
                </span>
                <span>
                  Meta: {goal.targetValue} {goal.unit}
                </span>
              </div>
            )}
          <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.progressColor} rounded-full transition-all duration-500`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      );

    case "decrease":
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progresso</span>
            <span className="text-sm font-bold text-gray-800">
              {goal.progress}%
            </span>
          </div>
          {goal.currentValue !== undefined &&
            goal.targetValue !== undefined && (
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>
                  Atual: {goal.currentValue} {goal.unit}
                </span>
                <span>
                  Meta: {goal.targetValue} {goal.unit}
                </span>
              </div>
            )}
          <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.progressColor} rounded-full transition-all duration-500`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      );

    case "percentage":
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progresso</span>
            <span className="text-sm font-bold text-gray-800">
              {goal.currentValue || 0}%
            </span>
          </div>
          {goal.targetValue !== undefined && (
            <div className="text-xs text-gray-600 mb-2 text-right">
              Meta: {goal.targetValue}%
            </div>
          )}
          <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.progressColor} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(goal.currentValue || 0, 100)}%` }}
            />
          </div>
        </div>
      );

    default:
      // Fallback para metas sem tipo ou tipos desconhecidos - barra padrão
      return (
        <div>
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
      );
  }
}

// Goal Card Component
function GoalCard({
  goal,
  onUpdate,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  onUpdate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
    // Backend statuses fallback
    ACTIVE: {
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      progressColor: "from-blue-400 to-blue-600",
      label: "Ativa",
    },
    PENDING: {
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      progressColor: "from-amber-400 to-amber-600",
      label: "Pendente",
    },
    IN_PROGRESS: {
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      progressColor: "from-blue-400 to-blue-600",
      label: "Em progresso",
    },
    COMPLETED: {
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      progressColor: "from-emerald-400 to-emerald-600",
      label: "Concluída",
    },
  };

  // Fallback para status desconhecidos
  const config = statusConfig[goal.status] || statusConfig["on-track"];
  const StatusIcon = config?.icon || Target;

  // Debug para identificar status não mapeados
  if (!statusConfig[goal.status]) {
    console.warn(
      `⚠️ Status não mapeado encontrado: "${goal.status}" para goal "${goal.title}"`
    );
  }

  // Detectar se é meta binária
  const normalizedType = goal.type?.toLowerCase() as GoalType;
  const isBinaryGoal = normalizedType === "binary";
  const isCompleted = goal.status === "completed" || goal.completed;

  // Ícone do tipo da meta
  const getTypeIcon = () => {
    switch (normalizedType) {
      case "binary":
        return <ToggleRight className="w-4 h-4 text-purple-600" />;
      case "increase":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case "percentage":
        return <Percent className="w-4 h-4 text-purple-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm border ${config.border} hover:border-brand-300 hover:shadow-md transition-all duration-300 p-5`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon()}
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand-600 transition-colors truncate">
              {goal.title}
            </h3>
            {/* Status badge - para metas não binárias ou para binárias sempre */}
            {!isBinaryGoal ? (
              isCompleted && (
                <span
                  className={`inline-flex items-center gap-1 ${config.bg} ${config.color} px-2.5 py-1 rounded-lg text-xs font-medium border ${config.border} whitespace-nowrap flex-shrink-0`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </span>
              )
            ) : (
              <span
                className={`inline-flex items-center gap-1 ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                } px-2.5 py-1 rounded-lg text-xs font-medium border whitespace-nowrap flex-shrink-0`}
              >
                {isCompleted ? (
                  <>
                    <ToggleRight className="w-3 h-3" />
                    Concluída
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-3 h-3" />
                    Aguardando conclusão
                  </>
                )}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {goal.description}
          </p>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all duration-200"
            title="Editar meta"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all duration-200"
            title="Excluir meta"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Display - Personalizado por tipo */}
      {renderGoalProgress(goal, config) && (
        <div className="mb-4">{renderGoalProgress(goal, config)}</div>
      )}

      {/* Footer Actions - Adapta baseado no tipo de meta */}
      {!isBinaryGoal && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {!isCompleted && (
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
                  daysSinceUpdate < 90 && (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Update há {daysSinceUpdate} dias
                    </span>
                  )
                )}
              </>
            )}
            {isCompleted && (
              <span className="text-blue-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Meta concluída!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted && (
              <>
                {goal.canUpdateNow !== false ? (
                  <button
                    onClick={onUpdate}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                  >
                    <TrendingUp className="w-3 h-3" />
                    Update +15 XP
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                    <div className="text-right">
                      <div className="text-xs font-medium">
                        Próxima atualização
                      </div>
                      <div className="text-xs text-gray-600">
                        {goal.nextUpdateDate
                          ? new Date(goal.nextUpdateDate).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Em breve"}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Para metas binárias, mostrar apenas o botão de toggle quando não concluída */}
      {isBinaryGoal && !isCompleted && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
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
              daysSinceUpdate < 90 && (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Update há {daysSinceUpdate} dias
                </span>
              )
            )}
          </div>
          <button
            onClick={onUpdate}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Marcar como Concluída
          </button>
        </div>
      )}

      {isBinaryGoal && isCompleted && (
        <div className="flex items-center justify-center">
          <span className="text-emerald-600 font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Meta concluída!
          </span>
        </div>
      )}

      {/* Almost Done Badge - apenas para metas progressivas (não binárias) */}
      {!isBinaryGoal && goal.progress >= 90 && !isCompleted && (
        <div className="mt-3 pt-3 border-t border-surface-200">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">QUASE LÁ!</span>
          </div>
        </div>
      )}
    </div>
  );
}
