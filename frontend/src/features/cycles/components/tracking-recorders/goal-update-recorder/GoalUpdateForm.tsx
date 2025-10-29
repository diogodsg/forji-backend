import {
  TrendingUp,
  Target,
  ArrowUp,
  ArrowDown,
  Percent,
  CheckCircle,
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

  const progressINCREASE = data.newProgress - data.currentProgress;

  // Personalização por tipo de meta
  const getGoalTypeConfig = () => {
    switch (data.goalType) {
      case "INCREASE":
        return {
          icon: ArrowUp,
          color: "emerald",
          label: "Aumentar",
          hint: data.unit
            ? `Ajuste o slider para indicar quantos ${data.unit} você já alcançou!`
            : "Quanto mais próximo de 100%, mais você cresceu!",
          showAbsoluteValues: true,
        };
      case "DECREASE":
        return {
          icon: ArrowDown,
          color: "blue",
          label: "Reduzir",
          hint: data.unit
            ? `Ajuste o slider para indicar quantos ${data.unit} restam!`
            : "Quanto mais próximo de 100%, mais você reduziu!",
          showAbsoluteValues: true,
        };
      case "PERCENTAGE":
        return {
          icon: Percent,
          color: "purple",
          label: "Percentual",
          hint: "Qual o percentual atual alcançado?",
          showAbsoluteValues: false,
        };
      case "BINARY":
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

  // Calcular valor absoluto baseado no progresso (para INCREASE/DECREASE)
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
      case "INCREASE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "DECREASE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PERCENTAGE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "BINARY":
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
              data.goalType === "INCREASE"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                : data.goalType === "DECREASE"
                ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                : data.goalType === "PERCENTAGE"
                ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                : data.goalType === "BINARY"
                ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                : "bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  data.goalType === "INCREASE"
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                    : data.goalType === "DECREASE"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : data.goalType === "PERCENTAGE"
                    ? "bg-gradient-to-br from-purple-500 to-purple-600"
                    : data.goalType === "BINARY"
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
                  {/* BINARY: Mostrar status de conclusão */}
                  {data.goalType === "BINARY" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            data.currentProgress === 100
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : "bg-gray-100 text-gray-600 border border-gray-300"
                          }`}
                        >
                          {data.currentProgress === 100 ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Concluída
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                              Pendente
                            </>
                          )}
                        </span>
                      </div>
                      {/* Badge do tipo */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${getTypeBadgeClasses()}`}
                      >
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig.label}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Valores absolutos para INCREASE/DECREASE */}
                      {typeConfig.showAbsoluteValues &&
                        currentAbsoluteValue !== null &&
                        data.targetValue &&
                        data.unit && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Atual:</span>
                            <span
                              className={`font-bold ${
                                data.goalType === "INCREASE"
                                  ? "text-emerald-600"
                                  : data.goalType === "DECREASE"
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
                    </>
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
                  data.goalType === "INCREASE"
                    ? "bg-emerald-100"
                    : data.goalType === "DECREASE"
                    ? "bg-blue-100"
                    : data.goalType === "PERCENTAGE"
                    ? "bg-purple-100"
                    : data.goalType === "BINARY"
                    ? "bg-amber-100"
                    : "bg-brand-100"
                }`}
              >
                <TypeIcon
                  className={`w-5 h-5 ${
                    data.goalType === "INCREASE"
                      ? "text-emerald-600"
                      : data.goalType === "DECREASE"
                      ? "text-blue-600"
                      : data.goalType === "PERCENTAGE"
                      ? "text-purple-600"
                      : data.goalType === "BINARY"
                      ? "text-amber-600"
                      : "text-brand-600"
                  }`}
                />
              </div>
              <label className="text-sm font-semibold text-gray-800">
                {data.goalType === "BINARY"
                  ? "Meta Concluída?"
                  : "Novo Progresso"}{" "}
                *
              </label>
            </div>

            {data.goalType === "BINARY" ? (
              /* BINARY: Switch para marcar como concluída */
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-surface-300 hover:border-brand-400 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <label
                        htmlFor="goal-complete-switch"
                        className="text-base font-semibold text-gray-800 cursor-pointer"
                      >
                        Marcar como concluída
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ative quando finalizar esta meta
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    id="goal-complete-switch"
                    type="button"
                    role="switch"
                    aria-checked={data.newProgress === 100}
                    onClick={() =>
                      onChange(
                        "newProgress",
                        data.newProgress === 100 ? 0 : 100
                      )
                    }
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                      data.newProgress === 100
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                        data.newProgress === 100
                          ? "translate-x-8"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {data.newProgress === 100 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      Meta marcada como concluída!
                    </span>
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
                        data.goalType === "INCREASE"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                          : data.goalType === "DECREASE"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : data.goalType === "PERCENTAGE"
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
                  min="0"
                  max="100"
                  value={data.newProgress}
                  onChange={(e) =>
                    onChange("newProgress", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />

                {/* Progress Info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Mínimo: 0%</span>
                  {progressINCREASE !== 0 && (
                    <span
                      className={`font-medium flex items-center gap-1 ${
                        progressINCREASE > 0
                          ? data.goalType === "INCREASE"
                            ? "text-emerald-600"
                            : data.goalType === "DECREASE"
                            ? "text-blue-600"
                            : "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {progressINCREASE > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {typeConfig.showAbsoluteValues &&
                      newAbsoluteValue !== null &&
                      currentAbsoluteValue !== null &&
                      data.unit
                        ? `${progressINCREASE > 0 ? "+" : ""}${
                            newAbsoluteValue - currentAbsoluteValue
                          } ${data.unit}`
                        : `${
                            progressINCREASE > 0 ? "+" : ""
                          }${progressINCREASE}% de ${
                            progressINCREASE > 0 ? "avanço" : "retrocesso"
                          }`}
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
