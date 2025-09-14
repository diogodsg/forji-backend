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
            <td className="py-2 pr-4 text-gray-700">
              <span className="text-sm md:text-base font-semibold tracking-tight">
                {r.levelBefore ?? "-"}
              </span>
            </td>
            <td className="py-2 pr-4 text-gray-700">
              <span className="text-sm md:text-base font-semibold tracking-tight">
                {r.levelAfter ?? "-"}
              </span>
            </td>
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

// Card-based view for results (unified visual language with editor)
export const ResultsCardsView: React.FC<{ records: PdiPlan["records"] }> = ({
  records,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => {
        const hasBefore = typeof r.levelBefore === "number";
        const hasAfter = typeof r.levelAfter === "number";
        const before = hasBefore ? (r.levelBefore as number) : 0;
        const after = hasAfter ? (r.levelAfter as number) : 0;
        const delta = hasBefore && hasAfter ? after - before : 0;
        const max = 5;
        const pct = hasAfter ? (after / max) * 100 : 0;
        const deltaColor =
          hasBefore && hasAfter && delta > 0
            ? "text-emerald-600"
            : hasBefore && hasAfter && delta < 0
            ? "text-amber-600"
            : "text-slate-500";
        return (
          <div
            key={r.area}
            className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/70 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                {r.area}
              </h4>
              <span
                className={`text-xs md:text-sm font-semibold ${deltaColor}`}
              >
                <span className="font-bold">{hasBefore ? before : "—"}</span>
                <span className="mx-1 text-slate-400">→</span>
                <span className="font-bold">{hasAfter ? after : "—"}</span>
              </span>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>Evolução</span>
                {hasBefore && hasAfter ? (
                  <span>
                    {delta > 0 && "+"}
                    {delta}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                {hasAfter && (
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${pct}%` }}
                    aria-label={`Nível final ${after} de ${max}`}
                  />
                )}
              </div>
            </div>
            {r.evidence && (
              <div className="mt-2">
                <p className="text-[10px] uppercase tracking-wide font-medium text-slate-500 mb-1">
                  Evidências
                </p>
                <p className="text-xs text-slate-600 whitespace-pre-line">
                  {r.evidence}
                </p>
              </div>
            )}
            {!r.evidence && (
              <p className="text-[11px] text-slate-400 italic">
                Sem evidências.
              </p>
            )}
          </div>
        );
      })}
      {records.length === 0 && (
        <div className="text-xs text-slate-500 border border-dashed rounded-lg p-6 text-center col-span-full">
          Nenhum registro.
        </div>
      )}
    </div>
  );
};
