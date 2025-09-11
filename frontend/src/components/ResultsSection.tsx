import React from "react";
import type { PdiPlan } from "../types/pdi";

interface ResultsSectionProps {
  records: PdiPlan["records"];
  onUpdate: (area: string, patch: any) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  records,
  onUpdate,
}) => (
  <section className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <span className="w-1.5 h-5 bg-indigo-600 rounded" />
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
              <td className="py-2 pr-4 text-gray-700 text-xs">
                {r.levelBefore ?? "-"}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
