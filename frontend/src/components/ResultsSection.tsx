import React, { useMemo, useState } from "react";
import type { PdiPlan } from "../types/pdi";
import { FiBarChart2, FiPlus, FiTrash2 } from "react-icons/fi";

interface ResultsSectionProps {
  records: PdiPlan["records"];
  onUpdate: (area: string, patch: any) => void;
  onAdd?: (area?: string) => void;
  onRemove?: (area: string) => void;
  competencies?: string[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  records,
  onUpdate,
  onAdd,
  onRemove,
  competencies,
}) => {
  const [newArea, setNewArea] = useState("");
  const existingAreas = useMemo(
    () => new Set(records.map((r) => r.area)),
    [records]
  );
  const missingFromCompetencies = useMemo(
    () => (competencies || []).filter((c) => !existingAreas.has(c)),
    [competencies, existingAreas]
  );

  return (
    <section className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiBarChart2 className="w-5 h-5 text-indigo-600" />
        Resultado
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-xs uppercase tracking-wide">
            <tr className="border-b border-surface-300">
              <th className="text-left py-2 pr-4 font-medium">Área Técnica</th>
              <th className="text-left py-2 pr-4 font-medium">Nível antes</th>
              <th className="text-left py-2 pr-4 font-medium">Nível depois</th>
              <th className="text-left py-2 font-medium">Evidências</th>
              {onRemove && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.area}
                className="border-b last:border-0 border-surface-300/70 align-top"
              >
                <td className="py-2 pr-4 text-gray-700 text-xs md:text-sm">
                  {r.area}
                </td>
                <td className="py-2 pr-4">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.levelBefore ?? ""}
                    onChange={(e) =>
                      onUpdate(r.area, {
                        levelBefore: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-16 text-xs border rounded px-1 py-1 border-surface-300"
                  />
                </td>
                <td className="py-2 pr-4">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.levelAfter ?? ""}
                    onChange={(e) =>
                      onUpdate(r.area, {
                        levelAfter: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-16 text-xs border rounded px-1 py-1 border-surface-300"
                  />
                </td>
                <td className="py-2">
                  <textarea
                    value={r.evidence ?? ""}
                    onChange={(e) =>
                      onUpdate(r.area, { evidence: e.target.value })
                    }
                    rows={2}
                    className="w-full text-xs border rounded p-1 border-surface-300"
                  />
                </td>
                {onRemove && (
                  <td className="py-2 pl-2 align-top">
                    <button
                      type="button"
                      onClick={() => onRemove(r.area)}
                      title="Remover registro"
                      className="p-1.5 rounded border border-surface-300 text-gray-500 hover:text-red-600 hover:border-red-300"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(onAdd || onRemove) && (
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {onAdd && (
            <div className="flex items-center gap-2">
              <select
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  onAdd(v);
                }}
                className="text-xs border rounded px-2 py-1 border-surface-300 bg-white"
              >
                <option value="" disabled>
                  Adicionar de competências...
                </option>
                {missingFromCompetencies.length === 0 && (
                  <option value="" disabled>
                    Nenhuma competência disponível
                  </option>
                )}
                {missingFromCompetencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="Nova área manual"
                  className="text-xs border rounded px-2 py-1 border-surface-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    const v = newArea.trim();
                    if (!v) return;
                    onAdd(v);
                    setNewArea("");
                  }}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  <FiPlus className="w-4 h-4" /> Adicionar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
