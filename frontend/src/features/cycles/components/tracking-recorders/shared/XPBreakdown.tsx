import { Zap, AlertCircle, Calendar } from "lucide-react";

export interface XPBonus {
  label: string;
  value: number;
}

interface XPBreakdownProps {
  total: number;
  bonuses: XPBonus[];
  hasRecentOneOnOne?: boolean;
  nextEligibleDate?: Date | null;
  daysUntilEligible?: number;
}

/**
 * XPBreakdown - Shared component for displaying XP calculation
 * Used in both GoalWizard and OneOnOneRecorder
 */
export default function XPBreakdown({
  total,
  bonuses,
  hasRecentOneOnOne = false,
  nextEligibleDate = null,
  daysUntilEligible = 0,
}: XPBreakdownProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
    }).format(date);
  };

  return (
    <div
      className={`rounded-lg p-4 border shadow-sm ${
        hasRecentOneOnOne
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
          : "bg-gradient-to-br from-brand-50 to-purple-50 border-brand-200"
      }`}
    >
      {hasRecentOneOnOne ? (
        <>
          {/* Warning: No XP will be earned */}
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Limite de XP Semanal Atingido
              </h3>
              <p className="text-sm text-gray-700">
                Este 1:1 será registrado, mas <strong>não concederá XP</strong>{" "}
                pois já houve um 1:1 nos últimos 7 dias.
              </p>
            </div>
          </div>

          {/* Next eligible date */}
          <div className="bg-white/60 rounded-lg p-3 border border-amber-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-amber-700" />
              <span className="text-sm font-medium text-gray-900">
                Próximo XP disponível em:
              </span>
            </div>
            <div className="text-lg font-bold text-amber-700">
              {formatDate(nextEligibleDate)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Faltam {daysUntilEligible}{" "}
              {daysUntilEligible === 1 ? "dia" : "dias"}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Normal XP display */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-600" />
              <span className="font-semibold text-gray-900">Preview XP</span>
            </div>
            <span className="text-2xl font-bold text-brand-600">
              +{total} XP
            </span>
          </div>

          <div className="space-y-1 pt-3 border-t border-brand-200">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Bônus Aplicados
            </p>
            {bonuses.length > 0 ? (
              bonuses.map((bonus, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <span className="text-gray-700">{bonus.label}</span>
                  <span className="font-semibold text-brand-600">
                    +{bonus.value} XP
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">
                Nenhum bônus ativo ainda
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
