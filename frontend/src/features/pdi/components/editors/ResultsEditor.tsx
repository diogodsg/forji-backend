// MOVED from src/components/editors/ResultsEditor.tsx
import React, { useState } from "react";
import type { PdiCompetencyRecord } from "../..";

interface Props {
  records: PdiCompetencyRecord[];
  competencies: string[];
  onUpdate: (area: string, patch: Partial<PdiCompetencyRecord>) => void;
  onAdd: (area?: string) => void;
  onRemove: (area: string) => void;
}

export const ResultsEditor: React.FC<Props> = ({
  records,
  onUpdate,
  onAdd,
  onRemove,
  competencies,
}) => {
  const [area, setArea] = useState("");
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = area.trim();
          if (v) onAdd(v);
          setArea("");
        }}
        className="flex items-center gap-2"
      >
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          list="competencies-datalist"
          placeholder="Adicionar área"
          className="text-xs border rounded px-2 py-1 border-surface-300 flex-1"
        />
        <datalist id="competencies-datalist">
          {competencies.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <button
          type="submit"
          className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Add
        </button>
      </form>
      <div className="space-y-3">
        {records.map((r) => (
          <div
            key={r.area}
            className="border border-surface-300 rounded-lg p-3 bg-surface-50/40 text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <strong className="text-indigo-700">{r.area}</strong>
              <button
                type="button"
                onClick={() => onRemove(r.area)}
                className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600 border border-red-300"
              >
                Remover
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={r.levelBefore ?? ""}
                onChange={(e) =>
                  onUpdate(r.area, { levelBefore: Number(e.target.value) })
                }
                placeholder="Antes"
                className="w-full border rounded px-2 py-1 border-surface-300"
              />
              <input
                type="number"
                value={r.levelAfter ?? ""}
                onChange={(e) =>
                  onUpdate(r.area, { levelAfter: Number(e.target.value) })
                }
                placeholder="Depois"
                className="w-full border rounded px-2 py-1 border-surface-300"
              />
            </div>
            <textarea
              value={r.evidence || ""}
              onChange={(e) => onUpdate(r.area, { evidence: e.target.value })}
              className="w-full resize-y rounded border border-surface-300 p-1"
              rows={2}
              placeholder="Evidências"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
