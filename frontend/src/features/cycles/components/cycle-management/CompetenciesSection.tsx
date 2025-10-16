import {
  Brain,
  TrendingUp,
  Award,
  ChevronRight,
  Crown,
  Code,
  Users,
  BarChart,
} from "lucide-react";

interface Competency {
  id: string;
  name: string;
  category: "leadership" | "technical" | "behavioral";
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  nextMilestone: string;
  totalXP: number;
}

interface CompetenciesSectionProps {
  competencies: Competency[];
  onViewCompetency: (competencyId: string) => void;
  onUpdateProgress: (competencyId: string) => void;
}

/**
 * CompetenciesSection - Seção de Competências (50% do layout)
 *
 * **Princípios:**
 * - Cards visuais de evolução por competência
 * - Níveis claros (atual → target)
 * - Progresso visual com barras coloridas
 * - Próximos passos sugeridos
 * - Categorização visual (Liderança, Técnico, Comportamental)
 *
 * **Categorias:**
 * - Leadership: Crown icon, amber gradient
 * - Technical: Code icon, blue gradient
 * - Behavioral: Heart icon, emerald gradient
 */
export function CompetenciesSection({
  competencies,
  onViewCompetency,
  onUpdateProgress,
}: CompetenciesSectionProps) {
  const totalXP = competencies.reduce((sum, comp) => sum + comp.totalXP, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Competências
            </h2>
            <p className="text-sm text-gray-600">
              {competencies.length} em desenvolvimento
            </p>
          </div>
        </div>

        {/* Total XP Badge */}
        <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-lg border border-brand-200">
          <div className="text-xs font-medium flex items-center gap-1">
            <BarChart className="w-3 h-3" />
            XP Total
          </div>
          <div className="text-xl font-bold">{totalXP.toLocaleString()}</div>
        </div>
      </div>

      {/* Competencies List */}
      <div className="space-y-4">
        {competencies.map((competency) => (
          <CompetencyCard
            key={competency.id}
            competency={competency}
            onView={() => onViewCompetency(competency.id)}
            onUpdate={() => onUpdateProgress(competency.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {competencies.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">
            Nenhuma competência definida ainda
          </p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg hover:opacity-90 transition-all">
            <Brain className="w-4 h-4" />
            Definir Competências
          </button>
        </div>
      )}
    </div>
  );
}

// Competency Card Component
function CompetencyCard({
  competency,
  onView,
  onUpdate,
}: {
  competency: Competency;
  onView: () => void;
  onUpdate: () => void;
}) {
  const categoryConfig = {
    leadership: {
      icon: Crown,
      label: "LIDERANÇA",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      progressColor: "from-amber-400 to-amber-600",
    },
    technical: {
      icon: Code,
      label: "TÉCNICO",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      progressColor: "from-blue-400 to-blue-600",
    },
    behavioral: {
      icon: Users,
      label: "COMPORTAMENTAL",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      progressColor: "from-emerald-400 to-emerald-600",
    },
  };

  const config = categoryConfig[competency.category];
  const CategoryIcon = config.icon;

  return (
    <div
      className="group bg-gradient-to-br from-white to-surface-50 rounded-xl p-5 border border-surface-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onView}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-8 h-8 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center`}
            >
              <CategoryIcon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
                  {competency.name}
                </h3>
              </div>
              <span
                className={`inline-block text-[10px] font-bold tracking-wide uppercase ${config.color} mt-1`}
              >
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Level Indicator */}
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Nível</div>
          <div className="text-xl font-bold text-gray-800">
            {competency.currentLevel} <span className="text-gray-400">→</span>{" "}
            {competency.targetLevel}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {competency.currentProgress}% completo
          </span>
          <span className="text-xs text-gray-500">
            Nível {competency.targetLevel}
          </span>
        </div>
        <div className="w-full bg-surface-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${config.progressColor} rounded-full transition-all duration-500`}
            style={{ width: `${competency.currentProgress}%` }}
          />
        </div>
      </div>

      {/* Next Milestone */}
      <div
        className={`${config.bg} ${config.border} border rounded-lg p-3 mb-4`}
      >
        <div className="flex items-start gap-2">
          <TrendingUp className={`w-4 h-4 ${config.color} mt-0.5`} />
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-500 mb-1">
              Próximo Marco
            </div>
            <div className={`text-sm font-semibold ${config.color}`}>
              {competency.nextMilestone}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Award className="w-4 h-4" />
          <span>{competency.totalXP.toLocaleString()} XP</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate();
          }}
          className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm group-hover:gap-2 transition-all"
        >
          Atualizar progresso
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-brand-500 rounded-full" />
      </div>
    </div>
  );
}
