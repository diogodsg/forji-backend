import { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Users,
  Target,
  CheckCircle,
  Award,
  Clock,
  TrendingUp,
  BookOpen,
} from "lucide-react";

interface MentoringRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MentoringData) => void;
  prefillData?: Partial<MentoringData>;
}

interface MentoringData {
  mentee: string;
  date: string;
  topic: string;
  currentLevel: number;
  targetLevel: number;
  progressNotes: string;
  achievements: string[];
  challenges: string[];
  nextSteps: string[];
}

interface XPBonus {
  label: string;
  value: number;
}

/**
 * MentoringRecorderOptimized - Simplified and Focused
 *
 * **Objetivo**: 4-5 minutos de preenchimento
 * **Campos Essenciais**: Mentorado, Tópico, Progresso, Conquistas, Desafios, Próximos Passos
 * **Layout**: 2 colunas (Info & Progresso | Outcomes)
 * **XP System**: Preview dinâmico com bonuses (base 35 XP)
 */

// ==================== Helper Functions ====================
const validateMentoringData = (data: Partial<MentoringData>): boolean => {
  return !!(
    data.mentee?.trim() &&
    data.date &&
    data.topic?.trim() &&
    data.currentLevel !== undefined &&
    data.targetLevel !== undefined
  );
};

const calculateMentoringXP = (
  data: Partial<MentoringData>
): { total: number; bonuses: XPBonus[] } => {
  const BASE_XP = 35;
  const bonuses: XPBonus[] = [];
  let total = BASE_XP;

  // Bonus: Progresso significativo (5 XP)
  if (
    data.currentLevel !== undefined &&
    data.targetLevel !== undefined &&
    data.targetLevel > data.currentLevel
  ) {
    bonuses.push({ label: "Progresso significativo", value: 5 });
    total += 5;
  }

  // Bonus: Notas detalhadas (8 XP)
  if (data.progressNotes && data.progressNotes.length > 100) {
    bonuses.push({ label: "Notas detalhadas", value: 8 });
    total += 8;
  }

  // Bonus: Outcomes acionáveis (10 XP)
  const hasActionableOutcomes =
    (data.achievements?.length ?? 0) >= 2 && (data.nextSteps?.length ?? 0) >= 2;
  if (hasActionableOutcomes) {
    bonuses.push({ label: "Outcomes acionáveis", value: 10 });
    total += 10;
  }

  // Bonus: Desafios identificados (7 XP)
  if ((data.challenges?.length ?? 0) >= 1) {
    bonuses.push({ label: "Desafios identificados", value: 7 });
    total += 7;
  }

  return { total, bonuses };
};

// ==================== ListEditor Component ====================
interface ListEditorProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  icon: React.ReactNode;
  emptyMessage?: string;
}

function ListEditor({
  items,
  onAdd,
  onRemove,
  placeholder,
  icon,
  emptyMessage,
}: ListEditorProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder={placeholder}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
        >
          Adicionar
        </button>
      </div>

      {items.length === 0 && emptyMessage && (
        <p className="text-sm text-gray-500 italic pl-10">{emptyMessage}</p>
      )}

      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 bg-emerald-50/50 rounded-lg group hover:bg-emerald-50 transition-colors"
          >
            <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-700 leading-relaxed">
              {item}
            </span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== XPBreakdown Component ====================
function XPBreakdown({
  total,
  bonuses,
}: {
  total: number;
  bonuses: XPBonus[];
}) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-900">Preview XP</span>
        </div>
        <span className="text-2xl font-bold text-emerald-600">+{total} XP</span>
      </div>

      {bonuses.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-emerald-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Bonuses Desbloqueados
          </p>
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{bonus.label}</span>
              <span className="font-semibold text-emerald-600">
                +{bonus.value} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== Main Component ====================
export default function MentoringRecorderOptimized({
  isOpen,
  onClose,
  onSave,
  prefillData,
}: MentoringRecorderProps) {
  const [formData, setFormData] = useState<Partial<MentoringData>>({
    mentee: prefillData?.mentee || "",
    date: prefillData?.date || new Date().toISOString().split("T")[0],
    topic: prefillData?.topic || "",
    currentLevel: prefillData?.currentLevel ?? 1,
    targetLevel: prefillData?.targetLevel ?? 5,
    progressNotes: prefillData?.progressNotes || "",
    achievements: prefillData?.achievements || [],
    challenges: prefillData?.challenges || [],
    nextSteps: prefillData?.nextSteps || [],
  });

  const { total: xpTotal, bonuses: xpBonuses } = calculateMentoringXP(formData);
  const isValid = validateMentoringData(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(formData as MentoringData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-bold">Registrar Mentoria</h2>
                <p className="text-emerald-100 text-sm">
                  Acompanhe o desenvolvimento do mentorado
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/10 rounded-lg p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT COLUMN: Info & Progress */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Informações da Sessão
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome do Mentorado *
                    </label>
                    <input
                      type="text"
                      value={formData.mentee || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, mentee: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Data da Sessão *
                    </label>
                    <input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tópico Principal *
                    </label>
                    <input
                      type="text"
                      value={formData.topic || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Liderança de Equipes"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Progresso
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nível Atual *
                    </label>
                    <select
                      value={formData.currentLevel ?? 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentLevel: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value={1}>1 - Iniciante</option>
                      <option value={2}>2 - Básico</option>
                      <option value={3}>3 - Intermediário</option>
                      <option value={4}>4 - Avançado</option>
                      <option value={5}>5 - Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nível Alvo *
                    </label>
                    <select
                      value={formData.targetLevel ?? 5}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetLevel: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value={1}>1 - Iniciante</option>
                      <option value={2}>2 - Básico</option>
                      <option value={3}>3 - Intermediário</option>
                      <option value={4}>4 - Avançado</option>
                      <option value={5}>5 - Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notas de Progresso
                  </label>
                  <textarea
                    value={formData.progressNotes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progressNotes: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Como o mentorado evoluiu desde a última sessão? Quais habilidades foram desenvolvidas?"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.progressNotes?.length || 0} caracteres
                    {(formData.progressNotes?.length || 0) > 100 &&
                      " - Bonus +8 XP desbloqueado! 🎉"}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Outcomes */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Conquistas
                </h3>
                <ListEditor
                  items={formData.achievements || []}
                  onAdd={(item) =>
                    setFormData({
                      ...formData,
                      achievements: [...(formData.achievements || []), item],
                    })
                  }
                  onRemove={(index) =>
                    setFormData({
                      ...formData,
                      achievements: formData.achievements?.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                  placeholder="Ex: Concluiu projeto de automação"
                  icon={<CheckCircle className="h-4 w-4" />}
                  emptyMessage="Nenhuma conquista registrada ainda"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  Desafios Identificados
                </h3>
                <ListEditor
                  items={formData.challenges || []}
                  onAdd={(item) =>
                    setFormData({
                      ...formData,
                      challenges: [...(formData.challenges || []), item],
                    })
                  }
                  onRemove={(index) =>
                    setFormData({
                      ...formData,
                      challenges: formData.challenges?.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                  placeholder="Ex: Dificuldade com gestão de tempo"
                  icon={<Clock className="h-4 w-4" />}
                  emptyMessage="Nenhum desafio registrado ainda"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Próximos Passos
                </h3>
                <ListEditor
                  items={formData.nextSteps || []}
                  onAdd={(item) =>
                    setFormData({
                      ...formData,
                      nextSteps: [...(formData.nextSteps || []), item],
                    })
                  }
                  onRemove={(index) =>
                    setFormData({
                      ...formData,
                      nextSteps: formData.nextSteps?.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                  placeholder="Ex: Estudar técnicas de priorização"
                  icon={<TrendingUp className="h-4 w-4" />}
                  emptyMessage="Nenhum próximo passo definido"
                />
              </div>

              <XPBreakdown total={xpTotal} bonuses={xpBonuses} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
            >
              Salvar Mentoria (+{xpTotal} XP)
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
