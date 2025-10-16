import {
  TrendingUp,
  Target,
  ArrowUp,
  ArrowDown,
  Percent,
  CheckCircle,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import type { GoalUpdateData } from "./types";
import XPBreakdown from "../shared/XPBreakdown";
import { calculateBonuses } from "./utils";

interface GoalUpdateFormProps {
  data: GoalUpdateData;
  onChange: (field: keyof GoalUpdateData, value: any) => void;
}

export function GoalUpdateForm({ data, onChange }: GoalUpdateFormProps) {
  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);

  const progressIncrease = data.newProgress - data.currentProgress;

  // Personalização por tipo de meta
  const getGoalTypeConfig = () => {
    switch (data.goalType) {
      case "increase":
        return {
          icon: ArrowUp,
          color: "emerald",
          label: "Aumentar",
          hint: data.unit
            ? `Ajuste o slider para indicar quantos ${data.unit} você já alcançou!`
            : "Quanto mais próximo de 100%, mais você cresceu!",
          showAbsoluteValues: true,
        };
      case "decrease":
        return {
          icon: ArrowDown,
          color: "blue",
          label: "Reduzir",
          hint: data.unit
            ? `Ajuste o slider para indicar quantos ${data.unit} restam!`
            : "Quanto mais próximo de 100%, mais você reduziu!",
          showAbsoluteValues: true,
        };
      case "percentage":
        return {
          icon: Percent,
          color: "purple",
          label: "Percentual",
          hint: "Qual o percentual atual alcançado?",
          showAbsoluteValues: false,
        };
      case "binary":
        return {
          icon: CheckCircle,
          color: "amber",
          label: "Conclusão",
          hint: "Marque 100% quando concluir esta meta!",
          showAbsoluteValues: false,
        };
      default:
        return {
          icon: TrendingUp,
          color: "brand",
          label: "Progresso",
          hint: "Atualize o progresso da sua meta",
          showAbsoluteValues: false,
        };
    }
  };

  const typeConfig = getGoalTypeConfig();
  const TypeIcon = typeConfig.icon;

  // Calcular valor absoluto baseado no progresso (para increase/decrease)
  const calculateAbsoluteValue = (progress: number) => {
    if (!data.startValue || !data.targetValue) return null;

    const range = data.targetValue - data.startValue;
    const value = data.startValue + (range * progress) / 100;
    return Math.round(value);
  };

  const currentAbsoluteValue =
    data.currentValue || calculateAbsoluteValue(data.currentProgress);
  const newAbsoluteValue = calculateAbsoluteValue(data.newProgress);

  // Classes CSS completas para o Tailwind (não pode ser dinâmico)
  const getTypeBadgeClasses = () => {
    switch (data.goalType) {
      case "increase":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "decrease":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "percentage":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "binary":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-brand-50 text-brand-700 border-brand-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
      {/* Main Content - 2/3 with scroll */}
      <div
        className="lg:col-span-2 overflow-y-auto px-4"
        style={{ maxHeight: "calc(580px - 120px)" }}
      >
        <div className="space-y-6">
          {/* Goal Info */}
          <div
            className={`rounded-lg p-4 border-2 ${
              data.goalType === "increase"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                : data.goalType === "decrease"
                ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                : data.goalType === "percentage"
                ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                : data.goalType === "binary"
                ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                : "bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  data.goalType === "increase"
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                    : data.goalType === "decrease"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : data.goalType === "percentage"
                    ? "bg-gradient-to-br from-purple-500 to-purple-600"
                    : data.goalType === "binary"
                    ? "bg-gradient-to-br from-amber-500 to-amber-600"
                    : "bg-gradient-to-br from-brand-500 to-brand-600"
                }`}
              >
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {data.goalTitle}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Valores absolutos para increase/decrease */}
                  {typeConfig.showAbsoluteValues &&
                    currentAbsoluteValue !== null &&
                    data.targetValue &&
                    data.unit && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Atual:</span>
                        <span
                          className={`font-bold ${
                            data.goalType === "increase"
                              ? "text-emerald-600"
                              : data.goalType === "decrease"
                              ? "text-blue-600"
                              : "text-brand-600"
                          }`}
                        >
                          {currentAbsoluteValue} {data.unit}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-600">Meta:</span>
                        <span className="font-bold text-gray-800">
                          {data.targetValue} {data.unit}
                        </span>
                      </div>
                    )}

                  {/* Progresso em % */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      {typeConfig.showAbsoluteValues
                        ? "Progresso:"
                        : "Progresso atual:"}
                    </span>
                    <span className="font-bold text-brand-600">
                      {data.currentProgress}%
                    </span>
                  </div>

                  {/* Badge do tipo */}
                  {data.goalType && (
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${getTypeBadgeClasses()}`}
                    >
                      <TypeIcon className="w-3 h-3" />
                      {typeConfig.label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  data.goalType === "increase"
                    ? "bg-emerald-100"
                    : data.goalType === "decrease"
                    ? "bg-blue-100"
                    : data.goalType === "percentage"
                    ? "bg-purple-100"
                    : data.goalType === "binary"
                    ? "bg-amber-100"
                    : "bg-brand-100"
                }`}
              >
                <TypeIcon
                  className={`w-5 h-5 ${
                    data.goalType === "increase"
                      ? "text-emerald-600"
                      : data.goalType === "decrease"
                      ? "text-blue-600"
                      : data.goalType === "percentage"
                      ? "text-purple-600"
                      : data.goalType === "binary"
                      ? "text-amber-600"
                      : "text-brand-600"
                  }`}
                />
              </div>
              <label className="text-sm font-semibold text-gray-800">
                {data.goalType === "binary"
                  ? "Meta Concluída?"
                  : "Novo Progresso"}{" "}
                *
              </label>
            </div>

            {data.goalType === "binary" ? (
              /* Binary: Botões Sim/Não */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onChange("newProgress", 0)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      data.newProgress === 0
                        ? "border-error-500 bg-error-50"
                        : "border-surface-300 bg-white hover:border-error-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <X className="w-8 h-8 text-error-500" />
                      </div>
                      <div className="font-semibold text-sm">Não Concluída</div>
                      <div className="text-xs text-gray-500">0%</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("newProgress", 100)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      data.newProgress === 100
                        ? "border-success-500 bg-success-50"
                        : "border-surface-300 bg-white hover:border-success-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Check className="w-8 h-8 text-success-500" />
                      </div>
                      <div className="font-semibold text-sm">Concluída!</div>
                      <div className="text-xs text-gray-500">100%</div>
                    </div>
                  </button>
                </div>
                {data.newProgress === 100 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium">
                        Parabéns! Você ganhará +50 XP bônus por concluir esta
                        meta!
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Outros tipos: Slider */
              <div className="space-y-3">
                {/* Visual Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-surface-200 rounded-full h-8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 flex items-center justify-end pr-3 ${
                        data.goalType === "increase"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                          : data.goalType === "decrease"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : data.goalType === "percentage"
                          ? "bg-gradient-to-r from-purple-500 to-purple-600"
                          : "bg-gradient-to-r from-brand-500 to-brand-600"
                      }`}
                      style={{ width: `${data.newProgress}%` }}
                    >
                      {data.newProgress > 10 && (
                        <span className="text-white text-sm font-bold">
                          {typeConfig.showAbsoluteValues &&
                          newAbsoluteValue !== null &&
                          data.unit
                            ? `${newAbsoluteValue} ${data.unit}`
                            : `${data.newProgress}%`}
                        </span>
                      )}
                    </div>
                  </div>
                  {data.newProgress <= 10 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-600">
                      {typeConfig.showAbsoluteValues &&
                      newAbsoluteValue !== null &&
                      data.unit
                        ? `${newAbsoluteValue} ${data.unit}`
                        : `${data.newProgress}%`}
                    </span>
                  )}
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min={data.currentProgress}
                  max="100"
                  value={data.newProgress}
                  onChange={(e) =>
                    onChange("newProgress", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />

                {/* Progress Info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Mínimo:{" "}
                    {typeConfig.showAbsoluteValues &&
                    currentAbsoluteValue !== null &&
                    data.unit
                      ? `${currentAbsoluteValue} ${data.unit}`
                      : `${data.currentProgress}%`}
                  </span>
                  {progressIncrease > 0 && (
                    <span
                      className={`font-medium flex items-center gap-1 ${
                        data.goalType === "increase"
                          ? "text-emerald-600"
                          : data.goalType === "decrease"
                          ? "text-blue-600"
                          : "text-emerald-600"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {typeConfig.showAbsoluteValues &&
                      newAbsoluteValue !== null &&
                      currentAbsoluteValue !== null &&
                      data.unit
                        ? `+${newAbsoluteValue - currentAbsoluteValue} ${
                            data.unit
                          }`
                        : `+${progressIncrease}% de avanço`}
                    </span>
                  )}
                  <span className="text-gray-500">
                    Máximo:{" "}
                    {typeConfig.showAbsoluteValues &&
                    data.targetValue &&
                    data.unit
                      ? `${data.targetValue} ${data.unit}`
                      : "100%"}
                  </span>
                </div>

                {/* Hint personalizado por tipo */}
                {data.goalType && (
                  <div className="mt-2 p-2 bg-brand-50 rounded-lg border border-brand-200">
                    <p className="text-xs text-brand-700 flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" />
                      {typeConfig.hint}
                    </p>
                  </div>
                )}
              </div>
            )}
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
