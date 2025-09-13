import React from "react";
import { FiCalendar } from "react-icons/fi";
import type { PdiMilestone } from "../types/pdi";
import { MilestoneCard } from "./MilestoneCard";

interface MilestonesSectionProps {
  milestones: PdiMilestone[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
  editingIds?: Set<string>; // ids em edição
  onToggleEdit?: (id: string) => void;
  enableSort?: boolean; // novo: controla se aplica ordenação desc por data
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  milestones,
  onAdd,
  onRemove,
  onUpdate,
  editingIds,
  onToggleEdit,
  enableSort = true,
}) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FiCalendar className="w-5 h-5 text-indigo-600" />
        Acompanhamento
      </h2>
      <button
        onClick={onAdd}
        className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
      >
        Adicionar encontro
      </button>
    </div>
    <div className="space-y-8">
      {(enableSort
        ? [...milestones].sort((a, b) => {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            if (da === db) return 0;
            return da < db ? 1 : -1; // desc (mais recente primeiro)
          })
        : milestones
      ).map((m) => (
        <MilestoneCard
          key={m.id}
          milestone={m}
          editing={!!editingIds?.has(m.id)}
          onToggleEdit={onToggleEdit}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  </section>
);
