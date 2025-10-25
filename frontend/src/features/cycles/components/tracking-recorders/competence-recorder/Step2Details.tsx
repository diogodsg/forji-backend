import { FileText, Link2, FolderTree } from "lucide-react";
import type { CompetenceData } from "./types";
import XPBreakdown from "../shared/XPBreakdown";
import { calculateBonuses } from "./utils";

interface Step2DetailsProps {
  data: CompetenceData;
  onChange: (field: keyof CompetenceData, value: any) => void;
}

const CATEGORIES = [
  { value: "technical", label: "Técnica", icon: "Code" },
  { value: "behavioral", label: "Comportamental", icon: "Heart" },
  { value: "leadership", label: "Liderança", icon: "Users" },
  { value: "business", label: "Negócios", icon: "TrendingUp" },
];

export function Step2Details({ data, onChange }: Step2DetailsProps) {
  const bonuses = calculateBonuses(data);
  const totalXP = 100 + bonuses.reduce((sum, b) => sum + b.value, 0);

  const handleAddEvidence = () => {
    const input = prompt("Digite a URL ou descrição da evidência:");
    if (input?.trim()) {
      onChange("evidences", [...data.evidences, input.trim()]);
    }
  };

  const handleRemoveEvidence = (index: number) => {
    onChange(
      "evidences",
      data.evidences.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Main Content - 2/3 without scroll */}
      <div className="lg:col-span-2 px-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Detalhes e Evidências
            </h3>

            <div className="space-y-3">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FolderTree className="w-4 h-4" />
                  Categoria *
                </label>
                <select
                  value={data.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200"
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Escolha a categoria que melhor descreve esta competência
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Competência
                </label>
                <textarea
                  value={data.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  placeholder="Descreva o que você aprendeu, como aplicou e qual foi o impacto..."
                  rows={3}
                  className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 resize-none"
                />
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>Descreva o que você aprendeu e como aplicou</span>
                </div>
              </div>

              {/* Evidências */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Link2 className="w-4 h-4" />
                  Evidências
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.evidences.map((evidence, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="flex-1 text-sm text-gray-700 truncate">
                        {evidence}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(index)}
                        className="text-red-500 hover:text-red-700 text-lg px-2 font-semibold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    className="w-full py-2 border-2 border-dashed border-surface-300 rounded-lg text-sm text-gray-600 hover:border-brand-400 hover:text-brand-600 transition-colors duration-200"
                  >
                    + Adicionar Evidência
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  <span>
                    Certificados, projetos, artigos, links como referência
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Sidebar - 1/3 */}
      <div className="lg:sticky lg:top-0 lg:h-fit">
        <XPBreakdown bonuses={bonuses} total={totalXP} />
      </div>
    </div>
  );
}
