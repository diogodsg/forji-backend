import type { GoalData } from "./types";
import type { XPBonus } from "../shared/XPBreakdown";
import XPBreakdown from "../shared/XPBreakdown";
import SMARTGuide from "./SMARTGuide";
import { Sparkles } from "lucide-react";

interface Step1BasicInfoProps {
  formData: Partial<GoalData>;
  setFormData: (data: Partial<GoalData>) => void;
  xpTotal: number;
  xpBonuses: XPBonus[];
}

export default function Step1BasicInfo({
  formData,
  setFormData,
  xpTotal,
  xpBonuses,
}: Step1BasicInfoProps) {
  return (
    <div className="space-y-4">
      {/* Formulário em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna Principal - Formulário */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Meta *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Ex: Aumentar frequência de 1:1s"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              placeholder="Descreva o contexto e importância desta meta..."
              required
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{formData.description?.length || 0} caracteres</span>
              {(formData.description?.length || 0) > 100 && (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Bônus +8 XP
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Coluna Lateral - XP Breakdown Fixo */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-0">
            <XPBreakdown total={xpTotal} bonuses={xpBonuses} />
          </div>
        </div>
      </div>

      {/* Guia SMART - Largura completa */}
      <SMARTGuide />
    </div>
  );
}
