import { ThumbsUp, AlertTriangle, ArrowRight } from "lucide-react";
import type { OneOnOneData } from "./types";
import ListEditor from "./ListEditor";
import XPBreakdown from "../shared/XPBreakdown";
import { calculateBonuses } from "./utils";

interface Step2OutcomesProps {
  data: OneOnOneData;
  onChange: (updates: Partial<OneOnOneData>) => void;
}

export default function Step2Outcomes({ data, onChange }: Step2OutcomesProps) {
  const bonuses = calculateBonuses(data);
  const totalXP = bonuses.reduce((sum, b) => sum + b.value, 0);

  const handlePositivePointsAdd = (item: string) => {
    onChange({
      positivePoints: [...data.positivePoints, item],
    });
  };

  const handlePositivePointsRemove = (index: number) => {
    onChange({
      positivePoints: data.positivePoints.filter((_, i) => i !== index),
    });
  };

  const handleImprovementPointsAdd = (item: string) => {
    onChange({
      improvementPoints: [...data.improvementPoints, item],
    });
  };

  const handleImprovementPointsRemove = (index: number) => {
    onChange({
      improvementPoints: data.improvementPoints.filter((_, i) => i !== index),
    });
  };

  const handleNextStepsAdd = (item: string) => {
    onChange({
      nextSteps: [...data.nextSteps, item],
    });
  };

  const handleNextStepsRemove = (index: number) => {
    onChange({
      nextSteps: data.nextSteps.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column - Outcomes */}
      <div
        className="lg:col-span-2 space-y-6 overflow-y-auto px-2"
        style={{ maxHeight: "calc(680px - 200px)" }}
      >
        {/* Positive Points */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
            Pontos Positivos
          </label>
          <ListEditor
            items={data.positivePoints}
            onAdd={handlePositivePointsAdd}
            onRemove={handlePositivePointsRemove}
            placeholder="Adicionar ponto positivo..."
            color="emerald"
          />
        </div>

        {/* Improvement Points */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Pontos de Melhoria
          </label>
          <ListEditor
            items={data.improvementPoints}
            onAdd={handleImprovementPointsAdd}
            onRemove={handleImprovementPointsRemove}
            placeholder="Adicionar ponto de melhoria..."
            color="amber"
          />
        </div>

        {/* Next Steps */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ArrowRight className="w-4 h-4 text-blue-500" />
            Próximos Passos
          </label>
          <ListEditor
            items={data.nextSteps}
            onAdd={handleNextStepsAdd}
            onRemove={handleNextStepsRemove}
            placeholder="Adicionar próximo passo..."
            color="blue"
          />
        </div>
      </div>

      {/* Right Column - XP Breakdown (Sticky) */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-0">
          <XPBreakdown bonuses={bonuses} total={totalXP} />
        </div>
      </div>
    </div>
  );
}
