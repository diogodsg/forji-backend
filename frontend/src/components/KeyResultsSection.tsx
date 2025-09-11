import React from "react";
import type { PdiKeyResult } from "../types/pdi";
import { ListEditor } from "./EditablePdiView";

interface KeyResultsSectionProps {
  krs: PdiKeyResult[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}

export const KeyResultsSection: React.FC<KeyResultsSectionProps> = ({
  krs,
  onAdd,
  onRemove,
  onUpdate,
}) => (
  <section className="rounded-xl border border-surface-300 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-1.5 h-5 bg-indigo-600 rounded" />
        Key Results
      </h2>
      <button
        onClick={onAdd}
        className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
      >
        Adicionar KR
      </button>
    </div>
    {(!krs || krs.length === 0) && (
      <p className="text-xs text-gray-500">Nenhuma KR definida.</p>
    )}
    <div className="space-y-4">
      {(krs || []).map((kr) => (
        <div
          key={kr.id}
          className="border border-surface-200 rounded-lg p-4 bg-surface-50/50 space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            <input
              value={kr.description}
              onChange={(e) => onUpdate(kr.id, { description: e.target.value })}
              className="flex-1 text-sm font-medium text-indigo-700 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => onRemove(kr.id)}
              className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
            >
              Remover
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Noção de sucesso
              </label>
              <textarea
                rows={3}
                value={kr.successCriteria}
                onChange={(e) =>
                  onUpdate(kr.id, { successCriteria: e.target.value })
                }
                className="w-full text-xs rounded border border-surface-300 p-2 focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Status atual
              </label>
              <textarea
                rows={3}
                value={kr.currentStatus || ""}
                onChange={(e) =>
                  onUpdate(kr.id, { currentStatus: e.target.value })
                }
                className="w-full text-xs rounded border border-surface-300 p-2 focus:border-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <ListEditor
                label="Ações melhoria"
                value={kr.improvementActions}
                onChange={(arr: string[]) =>
                  onUpdate(kr.id, { improvementActions: arr })
                }
                highlight="violet"
                placeholder="Uma ação por linha"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
