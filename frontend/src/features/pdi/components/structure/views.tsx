// MOVED from src/components/pdi/views.tsx
import React from "react";
import type { PdiKeyResult, PdiPlan } from "../..";

export const CompetenciesView: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((c) => (
      <span
        key={c}
        className="px-3 py-1 rounded-full text-xs bg-surface-100 border border-surface-300 text-indigo-700"
      >
        {c}
      </span>
    ))}
    {items.length === 0 && (
      <span className="text-xs text-gray-500">Nenhuma competência ainda.</span>
    )}
  </div>
);

export const KeyResultsView: React.FC<{ krs: PdiKeyResult[] }> = ({ krs }) => (
  <div className="space-y-4">
    {krs.length === 0 && (
      <div className="text-xs text-gray-500">Nenhuma KR.</div>
    )}
    {krs.map((kr) => (
      <div
        key={kr.id}
        className="border border-surface-200 rounded-lg p-3 bg-surface-50/50"
      >
        <h3 className="text-sm font-medium text-indigo-700 mb-1 leading-snug">
          {kr.description}
        </h3>
        <p className="text-[11px] text-gray-500 mb-1">Sucesso:</p>
        <p className="text-xs text-gray-700 whitespace-pre-line mb-2">
          {kr.successCriteria}
        </p>
        {kr.currentStatus && (
          <p className="text-[11px] text-gray-500 mb-1">Status:</p>
        )}
        <p className="text-xs text-gray-700 whitespace-pre-line mb-2">
          {kr.currentStatus}
        </p>
        {kr.improvementActions && kr.improvementActions.length > 0 && (
          <ul className="list-disc ml-4 text-xs space-y-1">
            {kr.improvementActions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

export const ResultsTable: React.FC<{ records: PdiPlan["records"] }> = ({
  records,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead className="text-gray-500 text-[10px] uppercase tracking-wide">
        <tr className="border-b border-surface-300">
          <th className="text-left py-2 pr-4 font-medium">Área</th>
          <th className="text-left py-2 pr-4 font-medium">Antes</th>
          <th className="text-left py-2 pr-4 font-medium">Depois</th>
          <th className="text-left py-2 font-medium">Evidências</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr
            key={r.area}
            className="border-b last:border-0 border-surface-300/70"
          >
            <td className="py-2 pr-4 text-gray-700">{r.area}</td>
            <td className="py-2 pr-4 text-gray-700">{r.levelBefore ?? "-"}</td>
            <td className="py-2 pr-4 text-gray-700">{r.levelAfter ?? "-"}</td>
            <td className="py-2 text-[11px] text-gray-500">
              {r.evidence || "-"}
            </td>
          </tr>
        ))}
        {records.length === 0 && (
          <tr>
            <td colSpan={4} className="py-4 text-center text-xs text-gray-500">
              Nenhum registro.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
