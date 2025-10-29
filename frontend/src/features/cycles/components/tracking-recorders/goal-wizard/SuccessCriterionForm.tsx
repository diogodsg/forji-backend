import { CheckCircle } from "lucide-react";
import type { GoalData } from "./types";

interface SuccessCriterionFormProps {
  goalType: GoalData["type"];
  successCriterion: GoalData["successCriterion"];
  setFormData: (data: Partial<GoalData>) => void;
  formData: Partial<GoalData>;
}

export default function SuccessCriterionForm({
  goalType,
  successCriterion,
  setFormData,
  formData,
}: SuccessCriterionFormProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        Critério de Sucesso
      </h3>

      {/* INCREASE */}
      {goalType === "increase" && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor Inicial *
              </label>
              <input
                type="number"
                value={successCriterion?.startValue ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      startValue: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="5"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor Atual *
              </label>
              <input
                type="number"
                value={successCriterion?.currentValue ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      currentValue: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="8"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta *
              </label>
              <input
                type="number"
                value={successCriterion?.targetValue ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      targetValue: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="15"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Unidade *
              </label>
              <input
                type="text"
                value={successCriterion?.unit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      unit: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="mentorias..."
                required
              />
            </div>
          </div>
          {successCriterion?.startValue !== undefined &&
            successCriterion?.currentValue !== undefined &&
            successCriterion?.targetValue !== undefined && (
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-800">
                  <strong>Meta:</strong> De {successCriterion.startValue} para{" "}
                  {successCriterion.targetValue} {successCriterion.unit}
                  {successCriterion.startValue > 0 && (
                    <span className="ml-1 font-semibold">
                      (+
                      {Math.round(
                        ((successCriterion.targetValue -
                          successCriterion.startValue) /
                          successCriterion.startValue) *
                          100
                      )}
                      % crescimento)
                    </span>
                  )}
                  <br />
                  <strong>Progresso atual:</strong>{" "}
                  {successCriterion.currentValue} {successCriterion.unit}(
                  {Math.round(
                    ((successCriterion.currentValue -
                      successCriterion.startValue) /
                      (successCriterion.targetValue -
                        successCriterion.startValue)) *
                      100
                  )}
                  % concluído)
                </p>
              </div>
            )}
        </div>
      )}

      {/* DECREASE */}
      {goalType === "decrease" && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor Inicial *
              </label>
              <input
                type="number"
                value={successCriterion?.startValue ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      startValue: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="20"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Valor Atual *
              </label>
              <input
                type="number"
                value={successCriterion?.currentValue ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      currentValue: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="15"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta *
              </label>
              <input
                type="number"
                value={successCriterion?.targetValue ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      targetValue: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="10"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Unidade *
              </label>
              <input
                type="text"
                value={successCriterion?.unit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successCriterion: {
                      ...successCriterion!,
                      unit: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="bugs..."
                required
              />
            </div>
          </div>
          {successCriterion?.startValue !== undefined &&
            successCriterion?.currentValue !== undefined &&
            successCriterion?.targetValue !== undefined && (
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Meta:</strong> De {successCriterion.startValue} para{" "}
                  {successCriterion.targetValue} {successCriterion.unit}
                  {successCriterion.startValue > 0 && (
                    <span className="ml-1 font-semibold">
                      (
                      {Math.round(
                        ((successCriterion.startValue -
                          successCriterion.targetValue) /
                          successCriterion.startValue) *
                          100
                      )}
                      % redução)
                    </span>
                  )}
                  <br />
                  <strong>Progresso atual:</strong>{" "}
                  {successCriterion.currentValue} {successCriterion.unit}(
                  {Math.round(
                    ((successCriterion.startValue -
                      successCriterion.currentValue) /
                      (successCriterion.startValue -
                        successCriterion.targetValue)) *
                      100
                  )}
                  % concluído)
                </p>
              </div>
            )}
        </div>
      )}

      {/* PERCENTAGE */}
      {goalType === "percentage" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Percentual Atual *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={successCriterion?.currentValue ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      successCriterion: {
                        ...successCriterion!,
                        currentValue: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="70"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meta Percentual *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={successCriterion?.targetValue ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      successCriterion: {
                        ...successCriterion!,
                        targetValue: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="90"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              O que está sendo medido? *
            </label>
            <input
              type="text"
              value={successCriterion?.unit || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  successCriterion: {
                    ...successCriterion!,
                    unit: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Ex: cobertura de testes..."
              required
            />
          </div>
          {successCriterion?.currentValue !== undefined &&
            successCriterion?.targetValue !== undefined && (
              <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-800">
                  <strong>Meta:</strong> Atingir {successCriterion.targetValue}%
                  em {successCriterion.unit} (atual:{" "}
                  {successCriterion.currentValue}%)
                </p>
              </div>
            )}
        </div>
      )}

      {/* BINARY */}
      {goalType === "binary" && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-amber-900">
                Meta de Conclusão
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                Esta meta será considerada concluída quando você marcar como
                "Sim".
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
