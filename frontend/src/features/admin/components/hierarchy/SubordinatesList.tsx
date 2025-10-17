import { Users, Plus } from "lucide-react";
import type { ManagementRule } from "./types";
import { SubordinateCard } from "./SubordinateCard";

interface SubordinatesListProps {
  rules: ManagementRule[];
  confirmDelete: number | null;
  onDelete: (ruleId: number) => void;
  onCancelDelete: () => void;
  onRequestDelete: (ruleId: number) => void;
  onAdd: () => void;
  userName: string;
}

export function SubordinatesList({
  rules,
  confirmDelete,
  onDelete,
  onCancelDelete,
  onRequestDelete,
  onAdd,
  userName,
}: SubordinatesListProps) {
  if (rules.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-50 rounded-2xl border-2 border-dashed border-surface-200">
        <div className="w-16 h-16 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
          Nenhum subordinado configurado
        </h4>
        <p className="text-gray-600 mb-6 text-sm">
          {userName} ainda não gerencia ninguém diretamente
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-brand-400"
        >
          <Plus className="w-4 h-4" />
          Adicionar Primeiro Subordinado
        </button>
      </div>
    );
  }

  const individualRules = rules.filter((r) => r.ruleType === "INDIVIDUAL");
  const teamRules = rules.filter((r) => r.ruleType === "TEAM");

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {individualRules.map((rule) => (
          <SubordinateCard
            key={rule.id}
            rule={rule}
            confirmDelete={confirmDelete === rule.id}
            onDelete={() => onDelete(rule.id)}
            onCancelDelete={onCancelDelete}
            onRequestDelete={() => onRequestDelete(rule.id)}
          />
        ))}

        {teamRules.map((rule) => (
          <SubordinateCard
            key={rule.id}
            rule={rule}
            confirmDelete={confirmDelete === rule.id}
            onDelete={() => onDelete(rule.id)}
            onCancelDelete={onCancelDelete}
            onRequestDelete={() => onRequestDelete(rule.id)}
          />
        ))}
      </div>

      <div className="pt-4">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-brand-400"
        >
          <Plus className="w-4 h-4" />
          Adicionar Subordinado
        </button>
      </div>
    </div>
  );
}
