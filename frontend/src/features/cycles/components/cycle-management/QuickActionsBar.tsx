import { MessageSquare, Users, Award, Target, Lock } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  xpReward: number;
  gradient: string;
  locked?: boolean;
  context?: {
    lastActivityDays?: number;
    lastPerson?: string;
    suggestion?: string;
  };
}

interface QuickActionsBarProps {
  onActionClick: (actionId: string) => void;
  actions?: QuickAction[];
}

/**
 * QuickActionsBar - Barra de ações rápidas contextual
 *
 * **Princípios:**
 * - Acesso imediato às principais funcionalidades (2-3 cliques max)
 * - Preview de XP em cada ação
 * - Contexto inteligente (última atividade, sugestões)
 * - Visual motivador com gradientes
 *
 * **Tracking Recorders Disponíveis:**
 * - 1:1 Detailed (2-3min, +50 XP)
 * - Mentoria (+35 XP)
 * - Competência (+100 XP)
 * - Nova Meta (+25 XP)
 */
export function QuickActionsBar({
  onActionClick,
  actions = defaultActions,
}: QuickActionsBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Ações Rápidas</h2>
          <p className="text-sm text-gray-600">
            Registre atividades e ganhe XP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => !action.locked && onActionClick(action.id)}
            disabled={action.locked}
            className={`group relative bg-gradient-to-br from-white to-surface-50 rounded-xl p-4 border border-surface-200 transition-all duration-300 text-left ${
              action.locked
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-brand-300 hover:shadow-lg"
            }`}
          >
            {/* Icon with Gradient Background */}
            <div
              className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 relative`}
            >
              {action.icon}
              {action.locked && (
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Title + Subtitle */}
            <h3 className="text-base font-semibold text-gray-800 mb-1 group-hover:text-brand-600 transition-colors">
              {action.title}
            </h3>
            <p className="text-xs text-gray-600 mb-3">{action.subtitle}</p>

            {/* XP Badge */}
            <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium border border-amber-200">
              <Award className="w-3 h-3" />
              <span>+{action.xpReward} XP</span>
            </div>

            {/* Contextual Info */}
            {/* {action.context && (
              <div className="mt-3 pt-3 border-t border-surface-200">
                {action.context.lastActivityDays !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      Última: há {action.context.lastActivityDays} dia
                      {action.context.lastActivityDays !== 1 ? "s" : ""}
                      {action.context.lastPerson &&
                        ` com ${action.context.lastPerson}`}
                    </span>
                  </div>
                )}
                {action.context.suggestion && (
                  <div className="text-xs text-brand-600 font-medium mt-1 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    {action.context.suggestion}
                  </div>
                )}
              </div>
            )} */}

            {/* Hover Indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-brand-500 rounded-full" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Default Actions Configuration
const defaultActions: QuickAction[] = [
  {
    id: "oneOnOne",
    icon: <MessageSquare className="w-6 h-6 text-white" />,
    title: "Registrar 1:1",
    subtitle: "2-3min • Detalhado",
    xpReward: 300,
    gradient: "from-blue-500 to-blue-600",
    context: {
      lastActivityDays: 3,
      lastPerson: "Maria Silva",
      suggestion: "Agende com João Santos",
    },
  },
  {
    id: "newGoal",
    icon: <Target className="w-6 h-6 text-white" />,
    title: "Nova Meta",
    subtitle: "Planeje objetivos",
    xpReward: 40,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    id: "certification",
    icon: <Award className="w-6 h-6 text-white" />,
    title: "Competência",
    subtitle: "Habilidade adquirida",
    xpReward: 100,
    gradient: "from-amber-500 to-amber-600",
  },

  {
    id: "mentoring",
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Mentoria",
    subtitle: "Em breve",
    xpReward: 35,
    gradient: "from-emerald-500 to-emerald-600",
    locked: true,
  },
];
