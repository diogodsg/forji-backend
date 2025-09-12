import React from "react";
import { FiCalendar } from "react-icons/fi";
import type { PdiMilestone } from "../types/pdi";
import { ListEditor, TaskEditor } from "./EditablePdiView";

interface MilestonesSectionProps {
  milestones: PdiMilestone[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  milestones,
  onAdd,
  onRemove,
  onUpdate,
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
    <div className="space-y-5">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:justify-between">
            <div className="flex-1 space-y-2">
              <input
                value={m.title}
                onChange={(e) => onUpdate(m.id, { title: e.target.value })}
                className="w-full text-sm font-medium text-indigo-700 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                value={m.date}
                onChange={(e) => onUpdate(m.id, { date: e.target.value })}
                className="text-[11px] uppercase tracking-wide text-gray-600 bg-white border border-surface-300 rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-2 self-start">
              <button
                onClick={() => onRemove(m.id)}
                className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
              >
                Remover
              </button>
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">
                Resumo / Notas
              </label>
              <textarea
                value={m.summary}
                onChange={(e) => onUpdate(m.id, { summary: e.target.value })}
                rows={4}
                className="w-full text-xs rounded border border-surface-300 p-2 focus:border-indigo-400"
              />
              <ListEditor
                label="Sugestões (IA)"
                value={m.suggestions}
                onChange={(arr: string[]) =>
                  onUpdate(m.id, { suggestions: arr })
                }
                highlight="violet"
              />
              <TaskEditor
                milestoneId={m.id}
                tasks={m.tasks}
                onChange={(tasks: any) => onUpdate(m.id, { tasks })}
              />
            </div>
            <div className="space-y-4">
              <ListEditor
                label="Pontos positivos"
                value={m.positives}
                onChange={(arr: string[]) => onUpdate(m.id, { positives: arr })}
              />
              <ListEditor
                label="Pontos de melhoria"
                value={m.improvements}
                onChange={(arr: string[]) =>
                  onUpdate(m.id, { improvements: arr })
                }
                highlight="amber"
              />
              <ListEditor
                label="Referências"
                value={m.resources}
                onChange={(arr: string[]) => onUpdate(m.id, { resources: arr })}
                highlight="sky"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
