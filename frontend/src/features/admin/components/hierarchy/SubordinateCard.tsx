import { User, Users, Trash2 } from "lucide-react";
import type { ManagementRule } from "./types";

interface SubordinateCardProps {
  rule: ManagementRule;
  confirmDelete: boolean;
  onDelete: () => void;
  onCancelDelete: () => void;
  onRequestDelete: () => void;
}

export function SubordinateCard({
  rule,
  confirmDelete,
  onDelete,
  onCancelDelete,
  onRequestDelete,
}: SubordinateCardProps) {
  const isTeam = rule.ruleType === "TEAM";
  const subordinate = rule.subordinate;
  const team = rule.team;

  const initials = isTeam
    ? ""
    : subordinate?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??";

  return (
    <div className="bg-white rounded-xl border border-surface-300 p-4 hover:shadow-md hover:border-surface-200 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isTeam ? (
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {isTeam
                  ? `Equipe ${team?.name || "Nome não encontrado"}`
                  : subordinate?.name || "Nome não encontrado"}
              </h4>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  isTeam
                    ? "bg-success-50 text-success-700"
                    : "bg-brand-50 text-brand-700"
                }`}
              >
                {isTeam ? (
                  <>
                    <Users className="w-3 h-3" />
                    Equipe
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    Individual
                  </>
                )}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {isTeam
                ? "Gerencia toda a equipe"
                : subordinate?.email || "Email não encontrado"}
            </p>
          </div>
        </div>
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={onCancelDelete}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={onRequestDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Remover subordinado"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
