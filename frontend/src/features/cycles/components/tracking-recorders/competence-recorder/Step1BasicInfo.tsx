import { BookOpen, TrendingUp } from "lucide-react";
import type { CompetenceData } from "./types";
import XPBreakdown from "../shared/XPBreakdown";
import { calculateBonuses } from "./utils";

interface Step1BasicInfoProps {
  data: CompetenceData;
  onChange: (field: keyof CompetenceData, value: any) => void;
}

const LEVELS = [
  {
    value: 1,
    label: "Nível 1 - Iniciante",
    description: "Conhecimento básico e teórico",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
  },
  {
    value: 2,
    label: "Nível 2 - Aprendiz",
    description: "Aplicação com supervisão",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
  },
  {
    value: 3,
    label: "Nível 3 - Competente",
    description: "Uso independente e confiável",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
  },
  {
    value: 4,
    label: "Nível 4 - Proficiente",
    description: "Domínio avançado e ensino",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
  },
  {
    value: 5,
    label: "Nível 5 - Expert",
    description: "Referência e inovação",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
  },
];

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const bonuses = calculateBonuses(data);
  const totalXP = 100 + bonuses.reduce((sum, b) => sum + b.value, 0);

  const isValidTargetLevel = (targetLevel: number) => {
    return targetLevel > data.initialLevel;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Main Content - 2/3 without scroll */}
      <div className="lg:col-span-2 px-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              Informações Básicas
            </h3>

            <div className="space-y-3">
              {/* Nome da Competência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Competência *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Ex: React Advanced Patterns, Liderança de Equipes, AWS Cloud"
                  className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Progressão de Níveis */}
              <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-lg p-3 border border-brand-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <h4 className="font-semibold text-sm text-gray-800">
                    Progressão no Ciclo
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Nível Inicial */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nível Inicial *
                    </label>
                    <div className="space-y-1">
                      {LEVELS.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => onChange("initialLevel", level.value)}
                          className={`w-full p-1.5 border-2 rounded-md text-left transition-all duration-200 ${
                            data.initialLevel === level.value
                              ? `${level.borderColor} ${level.bgColor}`
                              : "border-surface-300 hover:border-gray-400 bg-white"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium text-xs truncate ${
                                data.initialLevel === level.value
                                  ? level.color
                                  : "text-gray-700"
                              }`}
                            >
                              {level.label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {level.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nível Alvo */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nível Alvo (Meta) *
                    </label>
                    <div className="space-y-1">
                      {LEVELS.map((level) => {
                        const isValid = isValidTargetLevel(level.value);
                        const isSelected = data.targetLevel === level.value;

                        return (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() =>
                              isValid && onChange("targetLevel", level.value)
                            }
                            disabled={!isValid}
                            className={`w-full p-1.5 border-2 rounded-md text-left transition-all duration-200 ${
                              isSelected
                                ? `${level.borderColor} ${level.bgColor}`
                                : isValid
                                ? "border-surface-300 hover:border-gray-400 bg-white"
                                : "border-surface-200 bg-surface-100 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`font-medium text-xs truncate ${
                                    isSelected
                                      ? level.color
                                      : isValid
                                      ? "text-gray-700"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {level.label}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {level.description}
                                </div>
                              </div>
                              {isSelected && (
                                <span
                                  className={`text-xs font-medium whitespace-nowrap ${level.color}`}
                                >
                                  Meta
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-brand-700 bg-brand-100 rounded px-2 py-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>
                    O nível alvo deve ser superior ao inicial para ganhar XP
                  </span>
                </div>
              </div>
            </div>
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
