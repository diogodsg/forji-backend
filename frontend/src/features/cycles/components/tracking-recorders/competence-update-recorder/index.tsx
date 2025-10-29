import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Brain } from "lucide-react";
import type { CompetenceData, CompetenceUpdateData } from "./types";
import { CompetenceUpdateForm } from "./CompetenceUpdateForm";
import { calculateBonuses, isFormValid } from "./utils";

interface CompetenceUpdateRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompetenceUpdateData) => void | Promise<void>;
  competence: CompetenceData;
}

export function CompetenceUpdateRecorder({
  isOpen,
  onClose,
  onSave,
  competence,
}: CompetenceUpdateRecorderProps) {
  const [data, setData] = useState<CompetenceUpdateData>({
    competenceId: competence.id,
    competenceName: competence.name,
    category: competence.category,
    currentLevel: competence.currentLevel,
    targetLevel: competence.targetLevel,
    currentProgress: competence.currentProgress,
    newProgress: competence.currentProgress,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reset form when competence changes
  useEffect(() => {
    if (isOpen) {
      setData({
        competenceId: competence.id,
        competenceName: competence.name,
        category: competence.category,
        currentLevel: competence.currentLevel,
        targetLevel: competence.targetLevel,
        currentProgress: competence.currentProgress,
        newProgress: competence.currentProgress,
      });
      setIsLoading(false);
    }
  }, [isOpen, competence]);

  const handleChange = (field: keyof CompetenceUpdateData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid(data) || isLoading) return;

    try {
      setIsLoading(true);
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);
  const isValid = isFormValid(data);

  // ✅ Verificar se pode atualizar
  const canUpdate = competence.canUpdateNow !== false; // undefined = pode atualizar
  const nextUpdate = competence.nextUpdateDate
    ? new Date(competence.nextUpdateDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ width: "1100px", height: "680px" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Atualizar Competência
              </h2>
              <p className="text-sm text-brand-100">
                Registre seu progresso e ganhe até {totalXP} XP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          <CompetenceUpdateForm data={data} onChange={handleChange} />
        </div>

        {/* Footer */}
        <div className="border-t border-surface-200 px-6 py-4 bg-surface-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-surface-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            {!canUpdate && nextUpdate && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-xs font-medium text-amber-700">
                  ⏰ Próxima atualização: {nextUpdate}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-bold text-brand-600">{totalXP} XP</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isLoading || !canUpdate}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isValid && !isLoading && canUpdate
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90"
                  : "bg-surface-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Salvando...
                </span>
              ) : !canUpdate ? (
                "Atualização Bloqueada"
              ) : (
                "Salvar Atualização"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
