import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Target } from "lucide-react";
import type { GoalData, GoalUpdateData } from "./types";
import { GoalUpdateForm } from "./GoalUpdateForm";
import { calculateBonuses, isFormValid } from "./utils";

interface GoalUpdateRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GoalUpdateData) => void | Promise<void>;
  goal: GoalData;
}

export function GoalUpdateRecorder({
  isOpen,
  onClose,
  onSave,
  goal,
}: GoalUpdateRecorderProps) {
  const [data, setData] = useState<GoalUpdateData>({
    goalId: goal.id,
    goalTitle: goal.title,
    goalType: goal.type,
    currentProgress: goal.currentProgress,
    newProgress: goal.currentProgress,
    description: "",
    currentValue: goal.currentValue,
    targetValue: goal.targetValue,
    startValue: goal.startValue,
    unit: goal.unit,
  });

  // Reset form when goal changes
  useEffect(() => {
    if (isOpen) {
      setData({
        goalId: goal.id,
        goalTitle: goal.title,
        goalType: goal.type,
        currentProgress: goal.currentProgress,
        newProgress: goal.currentProgress,
        description: "",
        currentValue: goal.currentValue,
        targetValue: goal.targetValue,
        startValue: goal.startValue,
        unit: goal.unit,
      });
    }
  }, [isOpen, goal]);

  const handleChange = (field: keyof GoalUpdateData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid(data)) return;

    await onSave(data);
    onClose();
  };

  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);
  const canSave = isFormValid(data);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Atualizar Meta</h2>
              <p className="text-sm text-brand-100">
                Registre seu progresso e ganhe XP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          <GoalUpdateForm data={data} onChange={handleChange} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 bg-surface-50 rounded-b-2xl">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-brand-600">
              Pronto para registrar seu progresso!
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-surface-100 rounded-lg transition-colors duration-200 border border-surface-300"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSave}
              className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
                canSave
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90"
                  : "bg-surface-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Salvar Update (+{totalXP} XP)
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
