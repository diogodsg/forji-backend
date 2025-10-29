import {
  Brain,
  Award,
  ChevronRight,
  Crown,
  Code,
  Users,
  BarChart,
  Trash2,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface Competency {
  id: string;
  name: string;
  category:
    | "leadership"
    | "technical"
    | "behavioral"
    | "LEADERSHIP"
    | "TECHNICAL"
    | "BEHAVIORAL";
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  totalXP?: number;
  canUpdateNow?: boolean;
  nextUpdateDate?: string;
}

interface CompetenciesSectionProps {
  competencies: Competency[];
  onViewCompetency: (competencyId: string) => void;
  onUpdateProgress: (competencyId: string) => void;
  onDeleteCompetency: (competencyId: string) => Promise<void>;
  onCreateCompetency?: () => void;
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
  onDeleteCompetency,
  onCreateCompetency,
}: CompetenciesSectionProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [competencyToDelete, setCompetencyToDelete] = useState<string | null>(
    null
  );

  const totalXP = competencies.reduce(
    (sum, comp) => sum + (comp.totalXP || 0),
    0
  );

  const handleDeleteClick = (competencyId: string) => {
    console.log(
      "🗑️ CompetenciesSection: Iniciando exclusão da competência:",
      competencyId
    );
    setCompetencyToDelete(competencyId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (competencyToDelete) {
      console.log(
        "✅ CompetenciesSection: Confirmando exclusão da competência:",
        competencyToDelete
      );
      console.log("🔄 CompetenciesSection: Chamando onDeleteCompetency...");
      console.log(
        "🔍 CompetenciesSection: Tipo de onDeleteCompetency:",
        typeof onDeleteCompetency
      );
      console.log(
        "🔍 CompetenciesSection: onDeleteCompetency.name:",
        onDeleteCompetency.name
      );
      try {
        const result = onDeleteCompetency(competencyToDelete);
        console.log("🔍 CompetenciesSection: Resultado da chamada:", result);
        console.log(
          "🔍 CompetenciesSection: É uma Promise?",
          result instanceof Promise
        );
        await result;
        console.log("✅ CompetenciesSection: onDeleteCompetency concluído");
      } catch (error) {
        console.error(
          "❌ CompetenciesSection: Erro ao chamar onDeleteCompetency:",
          error
        );
      }
      setDeleteModalOpen(false);
      setCompetencyToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCompetencyToDelete(null);
  };

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
            onDelete={() => handleDeleteClick(competency.id)}
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
          {onCreateCompetency && (
            <button
              onClick={onCreateCompetency}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              <Brain className="w-4 h-4" />
              Definir Competências
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen &&
        competencyToDelete &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Deletar Competência
                  </h3>
                  <p className="text-sm text-gray-600">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Tem certeza que deseja deletar esta competência? Todo o
                progresso será perdido permanentemente.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

// Competency Card Component
function CompetencyCard({
  competency,
  onView,
  onUpdate,
  onDelete,
}: {
  competency: Competency;
  onView: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}) {
  const categoryConfig: Record<
    string,
    {
      icon: any;
      label: string;
      color: string;
      bg: string;
      border: string;
      progressColor: string;
    }
  > = {
    leadership: {
      icon: Crown,
      label: "LIDERANÇA",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      progressColor: "from-amber-400 to-amber-600",
    },
    LEADERSHIP: {
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
    TECHNICAL: {
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
    BEHAVIORAL: {
      icon: Users,
      label: "COMPORTAMENTAL",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      progressColor: "from-emerald-400 to-emerald-600",
    },
  };

  // Normalizar categoria para lowercase ou usar diretamente se for uppercase
  const config =
    categoryConfig[competency.category] || categoryConfig.technical;
  const CategoryIcon = config.icon;

  const handleCardClick = () => {
    console.log("🔍 Visualizando competência:", competency.id, competency.name);
    onView();
  };

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(
      "📈 Atualizando progresso da competência:",
      competency.id,
      competency.name
    );
    onUpdate();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🗑️ Deletando competência:", competency.id, competency.name);
    onDelete();
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-white to-surface-50 rounded-xl p-5 border border-surface-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
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

        <div className="flex items-center gap-2">
          {/* Level Indicator */}
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Nível</div>
            <div className="text-xl font-bold text-gray-800">
              {competency.currentLevel} <span className="text-gray-400">→</span>{" "}
              {competency.targetLevel}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center text-red-600 hover:text-red-700 transition-all opacity-0 group-hover:opacity-100"
            title="Deletar competência"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Award className="w-4 h-4" />
          <span>{(competency.totalXP || 0).toLocaleString()} XP</span>
        </div>

        {competency.canUpdateNow !== false ? (
          <button
            onClick={handleUpdateClick}
            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm group-hover:gap-2 transition-all"
          >
            Atualizar progresso
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-600">
            <Clock className="w-3.5 h-3.5" />
            <div className="text-right">
              <div className="text-xs font-medium">Próxima atualização</div>
              <div className="text-xs text-gray-600">
                {competency.nextUpdateDate
                  ? new Date(competency.nextUpdateDate).toLocaleDateString(
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
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-brand-500 rounded-full" />
      </div>
    </div>
  );
}
