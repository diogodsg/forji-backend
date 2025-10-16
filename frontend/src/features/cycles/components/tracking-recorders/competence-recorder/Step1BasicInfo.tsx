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
    value: "beginner",
    label: "Iniciante",
    description: "Conhecimento básico",
  },
  {
    value: "intermediate",
    label: "Intermediário",
    description: "Uso com supervisão",
  },
  {
    value: "advanced",
    label: "Avançado",
    description: "Uso independente",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Referência no tema",
  },
];

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const bonuses = calculateBonuses(data);
  const totalXP = 100 + bonuses.reduce((sum, b) => sum + b.value, 0);

  const getLevelValue = (level: string) => {
    const map: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };
    return map[level] || 0;
  };

  const isValidTargetLevel = (targetLevel: string) => {
    return getLevelValue(targetLevel) > getLevelValue(data.initialLevel);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
      {/* Main Content - 2/3 with scroll */}
      <div
        className="lg:col-span-2 overflow-y-auto px-4"
        style={{ maxHeight: "calc(680px - 180px)" }}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              Informações Básicas
            </h3>

            <div className="space-y-4">
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
                    <div className="space-y-1.5">
                      {LEVELS.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => onChange("initialLevel", level.value)}
                          className={`w-full p-2 border-2 rounded-lg text-left transition-all duration-200 ${
                            data.initialLevel === level.value
                              ? "border-brand-500 bg-brand-50"
                              : "border-surface-300 hover:border-brand-300 bg-white"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs truncate">
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
                    <div className="space-y-1.5">
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
                            className={`w-full p-2 border-2 rounded-lg text-left transition-all duration-200 ${
                              isSelected
                                ? "border-success-500 bg-success-50"
                                : isValid
                                ? "border-surface-300 hover:border-success-300 bg-white"
                                : "border-surface-200 bg-surface-100 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs truncate">
                                  {level.label}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {level.description}
                                </div>
                              </div>
                              {isSelected && (
                                <span className="text-xs font-medium text-success-600 whitespace-nowrap">
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
