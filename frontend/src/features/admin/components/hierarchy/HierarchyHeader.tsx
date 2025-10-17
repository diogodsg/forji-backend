import { X, ArrowLeft } from "lucide-react";
import type { HierarchyStep } from "./types";

interface HierarchyHeaderProps {
  step: HierarchyStep;
  userName: string;
  onBack: () => void;
  onClose: () => void;
}

export function HierarchyHeader({
  step,
  userName,
  onBack,
  onClose,
}: HierarchyHeaderProps) {
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between p-6 border-b border-surface-300 bg-gradient-to-r from-brand-50 to-surface-50">
      <div className="flex items-center gap-4">
        {step === "add" && (
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label="Voltar para lista"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-md border border-surface-300/60">
          {userInitials}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {step === "list" ? "Gerenciar Hierarquia" : "Adicionar Subordinado"}
          </h2>
          <p className="text-sm text-gray-600">
            {step === "list"
              ? `Configure subordinados de ${userName}`
              : `Adicionando para: ${userName}`}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-surface-100 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-400"
        aria-label="Fechar modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
