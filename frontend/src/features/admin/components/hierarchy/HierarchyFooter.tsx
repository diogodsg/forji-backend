import { User, Users } from "lucide-react";
import type { HierarchyStep } from "./types";

interface HierarchyFooterProps {
  step: HierarchyStep;
  rulesCount: number;
  ruleType: "INDIVIDUAL" | "TEAM";
  selectedTeamIds: number[];
  selectedPersonIds: number[];
  creating: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function HierarchyFooter({
  step,
  rulesCount,
  ruleType,
  selectedTeamIds,
  selectedPersonIds,
  creating,
  onBack,
  onSubmit,
}: HierarchyFooterProps) {
  const isSubmitDisabled =
    creating ||
    (ruleType === "TEAM"
      ? selectedTeamIds.length === 0
      : selectedPersonIds.length === 0);

  return (
    <div
      className={`px-6 py-4 bg-gradient-to-r from-gray-50 to-violet-50 border-t border-gray-200 flex items-center ${
        step === "list" ? "justify-center" : "justify-between"
      }`}
    >
      <div className="text-sm font-medium text-gray-700">
        {step === "list" ? (
          `${rulesCount} subordinado(s) configurado(s)`
        ) : ruleType === "TEAM" ? (
          <span className="inline-flex items-center gap-1">
            <Users className="w-4 h-4 text-green-600" />
            {selectedTeamIds.length} equipe(s) selecionada(s)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <User className="w-4 h-4 text-blue-600" />
            {selectedPersonIds.length} pessoa(s) selecionada(s)
          </span>
        )}
      </div>
      {step === "add" && (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-brand-400"
          >
            {creating ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      )}
    </div>
  );
}
