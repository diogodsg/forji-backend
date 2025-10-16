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
    }
  }, [isOpen, competence]);

  const handleChange = (field: keyof CompetenceUpdateData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid(data)) return;

    await onSave(data);
    onClose();
  };

  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);
  const isValid = isFormValid(data);

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
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-bold text-brand-600">{totalXP} XP</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isValid
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90"
                  : "bg-surface-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Salvar Atualização
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
