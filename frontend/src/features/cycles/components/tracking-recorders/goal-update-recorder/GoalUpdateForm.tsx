import {
  TrendingUp,
  Target,
  ArrowUp,
  ArrowDown,
  Percent,
  CheckCircle,
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
          {data.goalType === "BINARY" ? (
            /* Layout simplificado para metas binárias */
            <div className="space-y-6">
              {/* Card da Meta */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {data.goalTitle}
                    </h3>
                    <p className="text-xs text-amber-700 font-medium">
                      Meta de Conclusão
                    </p>
                  </div>
                </div>

                {/* Switch Central */}
                <div className="bg-white rounded-xl p-6 border border-surface-300 shadow-sm">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={data.newProgress === 100}
                      onClick={() =>
                        onChange(
                          "newProgress",
                          data.newProgress === 100 ? 0 : 100
                        )
                      }
                      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-sm ${
                        data.newProgress === 100
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                          : "bg-surface-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out flex items-center justify-center ${
                          data.newProgress === 100
                            ? "translate-x-[2.75rem]"
                            : "translate-x-1.5"
                        }`}
                      >
                        {data.newProgress === 100 ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-surface-400"></div>
                        )}
                      </span>
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {data.newProgress === 100
                        ? "Meta Concluída! 🎉"
                        : "Toque para marcar como concluída"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {data.newProgress === 100
                        ? "Você completou esta meta com sucesso!"
                        : "Ative o botão quando finalizar"}
                    </p>
                  </div>
                </div>

                {/* Feedback visual */}
                {data.newProgress === 100 && (
                  <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Parabéns! Você ganhou +15 XP
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Layout normal para outras metas */
            <>
              {/* Goal Info */}
              <div
                className={`rounded-xl p-5 border shadow-sm ${
                  data.goalType === "INCREASE"
                    ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                    : data.goalType === "DECREASE"
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                    : data.goalType === "PERCENTAGE"
                    ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                    : "bg-gradient-to-br from-brand-50 to-indigo-50 border-brand-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                      data.goalType === "INCREASE"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        : data.goalType === "DECREASE"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : data.goalType === "PERCENTAGE"
                        ? "bg-gradient-to-br from-purple-500 to-purple-600"
                        : "bg-gradient-to-br from-brand-500 to-brand-600"
                    }`}
                  >
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                      {data.goalTitle}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Valores absolutos para INCREASE/DECREASE */}
                      {typeConfig.showAbsoluteValues &&
                        currentAbsoluteValue !== null &&
                        data.targetValue &&
                        data.unit && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Atual:</span>
                            <span
                              className={`font-semibold ${
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
                            <span className="font-semibold text-gray-800">
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
                        <span className="font-semibold text-brand-600">
                          {data.currentProgress}%
                        </span>
                      </div>

                      {/* Badge do tipo */}
                      {data.goalType && (
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeBadgeClasses()}`}
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
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      data.goalType === "INCREASE"
                        ? "bg-emerald-100"
                        : data.goalType === "DECREASE"
                        ? "bg-blue-100"
                        : data.goalType === "PERCENTAGE"
                        ? "bg-purple-100"
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
                          : "text-brand-600"
                      }`}
                    />
                  </div>
                  <label className="text-sm font-semibold text-gray-800">
                    Novo Progresso *
                  </label>
                </div>

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
                        <span className="text-white text-sm font-semibold">
                          {data.goalType === "DECREASE" &&
                          newAbsoluteValue !== null &&
                          data.unit
                            ? `${newAbsoluteValue} ${data.unit}`
                            : typeConfig.showAbsoluteValues &&
                              newAbsoluteValue !== null &&
                              data.unit
                            ? `${newAbsoluteValue} ${data.unit}`
                            : `${data.newProgress}%`}
                        </span>
                      )}
                    </div>
                  </div>
                  {data.newProgress <= 10 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600">
                      {data.goalType === "DECREASE" &&
                      newAbsoluteValue !== null &&
                      data.unit
                        ? `${newAbsoluteValue} ${data.unit}`
                        : typeConfig.showAbsoluteValues &&
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
                  className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />

                {/* Progress Info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Mínimo: 0%</span>
                  {progressINCREASE !== 0 && (
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        progressINCREASE > 0
                          ? data.goalType === "INCREASE"
                            ? "text-emerald-600"
                            : data.goalType === "DECREASE"
                            ? "text-blue-600"
                            : "text-emerald-600"
                          : "text-orange-600"
                      }`}
                    >
                      {progressINCREASE > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {data.goalType === "DECREASE" &&
                      newAbsoluteValue !== null &&
                      currentAbsoluteValue !== null &&
                      data.unit
                        ? `${progressINCREASE > 0 ? "" : "+"}${Math.abs(
                            newAbsoluteValue - currentAbsoluteValue
                          )} ${data.unit} ${
                            progressINCREASE > 0 ? "reduzidos" : "aumentados"
                          }`
                        : typeConfig.showAbsoluteValues &&
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
                  <span className="text-gray-500 font-medium">
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
                  <div className="p-3 bg-brand-50 rounded-lg border border-brand-200">
                    <p className="text-xs text-brand-700 font-medium flex items-center gap-1.5">
                      <TypeIcon className="w-3 h-3" />
                      {typeConfig.hint}
                    </p>
                  </div>
                )}

                {/* Aviso de retrocesso */}
                {progressINCREASE < 0 && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 font-medium flex items-center gap-1.5">
                      <ArrowDown className="w-3 h-3" />
                      Você está registrando um retrocesso. Isso pode acontecer e
                      é importante manter o registro atualizado!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* XP Sidebar - 1/3 */}
      <div className="lg:sticky lg:top-0 lg:h-fit">
        <XPBreakdown bonuses={bonuses} total={totalXP} />
      </div>
    </div>
  );
}
