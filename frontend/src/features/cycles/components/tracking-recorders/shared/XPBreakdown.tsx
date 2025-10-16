import { Zap } from "lucide-react";

export interface XPBonus {
  label: string;
  value: number;
}

interface XPBreakdownProps {
  total: number;
  bonuses: XPBonus[];
}

/**
 * XPBreakdown - Shared component for displaying XP calculation
 * Used in both GoalWizard and OneOnOneRecorder
 */
export default function XPBreakdown({ total, bonuses }: XPBreakdownProps) {
  return (
    <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-lg p-4 border border-brand-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-brand-600" />
          <span className="font-semibold text-gray-900">Preview XP</span>
        </div>
        <span className="text-2xl font-bold text-brand-600">+{total} XP</span>
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
    </div>
  );
}
