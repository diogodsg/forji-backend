// MOVED from src/components/MilestonesSection.tsx
import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronsDown,
  FiChevronsUp,
  FiCheckSquare,
  FiTarget,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import type { PdiMilestone } from "../..";
import { MilestoneCard } from "./MilestoneCard";
import { CollapsibleSectionCard } from "../../../../shared";

interface MilestonesSectionProps {
  milestones: PdiMilestone[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
  editingIds?: Set<string>; // ids em edição
  onToggleEdit?: (id: string) => void;
  enableSort?: boolean; // novo: controla se aplica ordenação desc por data
  editing?: boolean; // se a seção está em modo de edição
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  milestones,
  onAdd,
  onRemove,
  onUpdate,
  editingIds,
  onToggleEdit,
  enableSort = true,
  editing = false,
}) => {
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  const sortedMilestones = enableSort
    ? [...milestones].sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        if (da === db) return 0;
        return da < db ? 1 : -1; // desc (mais recente primeiro)
      })
    : milestones;

  // Calcular estatísticas para o preview
  const totalTasks = milestones.reduce(
    (acc, m) => acc + (m.tasks?.length || 0),
    0
  );
  const totalImprovements = milestones.reduce(
    (acc, m) => acc + (m.improvements?.length || 0),
    0
  );
  const recentMilestones = milestones.filter((m) => {
    const milestoneDate = new Date(m.date);
    const now = new Date();
    const diffDays =
      (now.getTime() - milestoneDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30; // últimos 30 dias
  });

  return (
    <CollapsibleSectionCard
      icon={FiCalendar}
      title="Acompanhamentos & Marcos"
      defaultExpanded={false}
      forceExpanded={editing}
      preview={
        milestones.length > 0 ? (
          <div className="space-y-4">
            {/* Badges de estatísticas com cores mais suaves */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                <FiCalendar className="w-3 h-3" /> {milestones.length}{" "}
                Acompanhamento{milestones.length !== 1 ? "s" : ""}
              </div>

              {totalTasks > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <FiCheckSquare className="w-3 h-3" /> {totalTasks} Tarefa
                  {totalTasks !== 1 ? "s" : ""}
                </div>
              )}

              {totalImprovements > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <FiTarget className="w-3 h-3" /> {totalImprovements} Melhoria
                  {totalImprovements !== 1 ? "s" : ""}
                </div>
              )}

              {recentMilestones.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <FiClock className="w-3 h-3" /> {recentMilestones.length}{" "}
                  Recente{recentMilestones.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {/* Preview dos marcos mais recentes com design melhorado */}
            <div className="space-y-3">
              {sortedMilestones.slice(0, 2).map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-sm font-medium text-slate-900 flex-1 leading-tight">
                      {milestone.title || "Marco sem título"}
                    </h4>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0 font-medium">
                      {new Date(milestone.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {((milestone.tasks?.length || 0) > 0 ||
                    (milestone.improvements?.length || 0) > 0) && (
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      {(milestone.tasks?.length || 0) > 0 && (
                        <span className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                          <FiCheckSquare className="w-3 h-3 text-blue-500" />
                          {milestone.tasks!.length} tarefa
                          {milestone.tasks!.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {(milestone.improvements?.length || 0) > 0 && (
                        <span className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md">
                          <FiTarget className="w-3 h-3 text-amber-500" />
                          {milestone.improvements!.length} melhoria
                          {milestone.improvements!.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {milestones.length > 2 && (
                <div className="text-center py-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">
                    +{milestones.length - 2} acompanhamento
                    {milestones.length - 2 !== 1 ? "s" : ""} adicional
                    {milestones.length - 2 !== 1 ? "is" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Nenhum acompanhamento registrado
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Clique em "Adicionar" para criar seu primeiro marco
            </p>
          </div>
        )
      }
      action={
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Adicionar
        </button>
      }
    >
      <div className="space-y-4">
        {milestones.length > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {milestones.length} acompanhamento
              {milestones.length !== 1 ? "s" : ""} registrado
              {milestones.length !== 1 ? "s" : ""}
            </div>
            <button
              onClick={toggleExpandAll}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              title={expandAll ? "Colapsar todos" : "Expandir todos"}
            >
              {expandAll ? (
                <>
                  <FiChevronsUp className="w-3 h-3" />
                  Colapsar todos
                </>
              ) : (
                <>
                  <FiChevronsDown className="w-3 h-3" />
                  Expandir todos
                </>
              )}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {sortedMilestones.map((m) => (
            <MilestoneCard
              key={m.id}
              milestone={m}
              editing={!!editingIds?.has(m.id)}
              onToggleEdit={onToggleEdit}
              onRemove={onRemove}
              onUpdate={onUpdate}
              forceExpanded={expandAll}
            />
          ))}
        </div>
      </div>
    </CollapsibleSectionCard>
  );
};
