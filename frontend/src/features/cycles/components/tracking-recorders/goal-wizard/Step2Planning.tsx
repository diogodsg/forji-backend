import type { GoalData } from "./types";
import type { XPBonus } from "../shared/XPBreakdown";
import { GOAL_TYPES } from "./constants";
import XPBreakdown from "../shared/XPBreakdown";
import SuccessCriterionForm from "./SuccessCriterionForm";

interface Step2PlanningProps {
  formData: Partial<GoalData>;
  setFormData: (data: Partial<GoalData>) => void;
  xpTotal: number;
  xpBonuses: XPBonus[];
}

export default function Step2Planning({
  formData,
  setFormData,
  xpTotal,
  xpBonuses,
}: Step2PlanningProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Coluna Principal - Formulário */}
      <div className="lg:col-span-2 space-y-3">
        {/* Recap do título */}
        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Meta:</span>
            <span className="text-sm text-gray-900 font-semibold truncate">
              {formData.title}
            </span>
          </div>
        </div>

        {/* Seleção de Tipo de Meta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Meta *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    // Preservar successCriterion existente ou criar novo
                    const existingCriterion = formData.successCriterion;

                    setFormData({
                      ...formData,
                      type: type.id,
                      successCriterion: {
                        type: type.id,
                        // Preservar valores existentes se já houver
                        startValue:
                          existingCriterion?.startValue ??
                          (type.id === "percentage" ? 0 : undefined),
                        currentValue:
                          existingCriterion?.currentValue ??
                          (type.id === "percentage" ? 0 : undefined),
                        targetValue:
                          existingCriterion?.targetValue ??
                          (type.id === "percentage" ? 100 : undefined),
                        unit:
                          existingCriterion?.unit ??
                          (type.id === "percentage" ? "%" : ""),
                        completed: existingCriterion?.completed,
                      },
                    });
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? `${type.borderColor} ${type.bgColor} shadow-md`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded ${
                        isSelected
                          ? `bg-gradient-to-r ${type.color}`
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-sm ${
                          isSelected ? type.textColor : "text-gray-800"
                        }`}
                      >
                        {type.title}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Critério de Sucesso - Varia por tipo */}
        {formData.type && formData.successCriterion && (
          <SuccessCriterionForm
            goalType={formData.type}
            successCriterion={formData.successCriterion}
            setFormData={setFormData}
            formData={formData}
          />
        )}
      </div>

      {/* Coluna Lateral - XP Breakdown Fixo */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-0">
          <XPBreakdown total={xpTotal} bonuses={xpBonuses} />
        </div>
      </div>
    </div>
  );
}
