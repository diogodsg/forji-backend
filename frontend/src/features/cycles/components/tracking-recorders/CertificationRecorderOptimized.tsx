import { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Award,
  CheckCircle,
  Target,
  TrendingUp,
  BookOpen,
  Star,
} from "lucide-react";

interface CertificationRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CertificationData) => void;
  prefillData?: Partial<CertificationData>;
}

interface CertificationData {
  title: string;
  issuer: string;
  date: string;
  validUntil?: string;
  credentialId?: string;
  competencies: string[];
  learnings: string[];
  applications: string[];
}

interface XPBonus {
  label: string;
  value: number;
}

/**
 * CertificationRecorderOptimized - Simplified and Focused
 *
 * **Objetivo**: 3-4 minutos de preenchimento
 * **Campos Essenciais**: Título, Emissor, Data, Competências, Aprendizados, Aplicações
 * **Layout**: 2 colunas (Info | Competências & Aplicações)
 * **XP System**: Preview dinâmico com bonuses (base 50 XP)
 */

// ==================== Helper Functions ====================
const validateCertificationData = (
  data: Partial<CertificationData>
): boolean => {
  return !!(data.title?.trim() && data.issuer?.trim() && data.date);
};

const calculateCertificationXP = (
  data: Partial<CertificationData>
): { total: number; bonuses: XPBonus[] } => {
  const BASE_XP = 50;
  const bonuses: XPBonus[] = [];
  let total = BASE_XP;

  // Bonus: Certificação de prestígio (20 XP)
  const prestigiousIssuers = [
    "AWS",
    "Google",
    "Microsoft",
    "Oracle",
    "RedHat",
    "Linux Foundation",
  ];
  if (
    data.issuer &&
    prestigiousIssuers.some((issuer) => data.issuer?.includes(issuer))
  ) {
    bonuses.push({ label: "Certificação de prestígio", value: 20 });
    total += 20;
  }

  // Bonus: Competências mapeadas (10 XP)
  if ((data.competencies?.length ?? 0) >= 3) {
    bonuses.push({ label: "Competências mapeadas", value: 10 });
    total += 10;
  }

  // Bonus: Aprendizados documentados (8 XP)
  if ((data.learnings?.length ?? 0) >= 2) {
    bonuses.push({ label: "Aprendizados documentados", value: 8 });
    total += 8;
  }

  // Bonus: Plano de aplicação (12 XP)
  if ((data.applications?.length ?? 0) >= 2) {
    bonuses.push({ label: "Plano de aplicação", value: 12 });
    total += 12;
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder={placeholder}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium"
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
            className="flex items-start gap-2 p-3 bg-amber-50/50 rounded-lg group hover:bg-amber-50 transition-colors"
          >
            <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
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
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-gray-900">Preview XP</span>
        </div>
        <span className="text-2xl font-bold text-amber-600">+{total} XP</span>
      </div>

      {bonuses.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-amber-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Bonuses Desbloqueados
          </p>
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{bonus.label}</span>
              <span className="font-semibold text-amber-600">
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
export default function CertificationRecorderOptimized({
  isOpen,
  onClose,
  onSave,
  prefillData,
}: CertificationRecorderProps) {
  const [formData, setFormData] = useState<Partial<CertificationData>>({
    title: prefillData?.title || "",
    issuer: prefillData?.issuer || "",
    date: prefillData?.date || new Date().toISOString().split("T")[0],
    validUntil: prefillData?.validUntil || "",
    credentialId: prefillData?.credentialId || "",
    competencies: prefillData?.competencies || [],
    learnings: prefillData?.learnings || [],
    applications: prefillData?.applications || [],
  });

  const { total: xpTotal, bonuses: xpBonuses } =
    calculateCertificationXP(formData);
  const isValid = validateCertificationData(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(formData as CertificationData);
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
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-bold">Registrar Certificação</h2>
                <p className="text-amber-100 text-sm">
                  Documente suas conquistas e aprendizados
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
            {/* LEFT COLUMN: Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Informações da Certificação
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Título da Certificação *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ex: AWS Solutions Architect Associate"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Emissor *
                    </label>
                    <input
                      type="text"
                      value={formData.issuer || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, issuer: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ex: Amazon Web Services (AWS)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Data de Obtenção *
                      </label>
                      <input
                        type="date"
                        value={formData.date || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Válida até
                      </label>
                      <input
                        type="date"
                        value={formData.validUntil || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            validUntil: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      ID da Credencial
                    </label>
                    <input
                      type="text"
                      value={formData.credentialId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credentialId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Ex: ABC123XYZ456"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600" />
                  Competências Desenvolvidas
                </h3>
                <ListEditor
                  items={formData.competencies || []}
                  onAdd={(item) =>
                    setFormData({
                      ...formData,
                      competencies: [...(formData.competencies || []), item],
                    })
                  }
                  onRemove={(index) =>
                    setFormData({
                      ...formData,
                      competencies: formData.competencies?.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                  placeholder="Ex: Arquitetura de Cloud"
                  icon={<Target className="h-4 w-4" />}
                  emptyMessage="Nenhuma competência registrada ainda"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Learnings & Applications */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Principais Aprendizados
                </h3>
                <ListEditor
                  items={formData.learnings || []}
                  onAdd={(item) =>
                    setFormData({
                      ...formData,
                      learnings: [...(formData.learnings || []), item],
                    })
                  }
                  onRemove={(index) =>
                    setFormData({
                      ...formData,
                      learnings: formData.learnings?.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                  placeholder="Ex: Padrões de alta disponibilidade"
                  icon={<BookOpen className="h-4 w-4" />}
                  emptyMessage="Nenhum aprendizado registrado ainda"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Como Aplicar no Trabalho
                </h3>
                <ListEditor
                  items={formData.applications || []}
                  onAdd={(item) =>
                    setFormData({
                      ...formData,
                      applications: [...(formData.applications || []), item],
                    })
                  }
                  onRemove={(index) =>
                    setFormData({
                      ...formData,
                      applications: formData.applications?.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
                  placeholder="Ex: Melhorar arquitetura do sistema X"
                  icon={<TrendingUp className="h-4 w-4" />}
                  emptyMessage="Nenhuma aplicação definida ainda"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30"
            >
              Salvar Certificação (+{xpTotal} XP)
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
