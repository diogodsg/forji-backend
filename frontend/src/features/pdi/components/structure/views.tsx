// MOVED from src/components/structure/views.tsx
import React from "react";
import { FiTarget } from "react-icons/fi";
import type { PdiKeyResult, PdiCompetencyRecord, PdiPlan } from "../..";

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
  <div className="space-y-6 pt-4">
    {krs.length === 0 && (
      <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <span className="text-2xl font-bold text-indigo-600">KR</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">Nenhum Key Result definido</p>
        <p className="text-xs text-gray-500">
          Clique em "Editar" para adicionar seus objetivos mensuráveis
        </p>
      </div>
    )}
    {krs.map((kr, index) => (
      <div
        key={kr.id}
        className="group relative bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 mt-4"
      >
        {/* Badge numerado */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
          {index + 1}
        </div>

        {/* Título principal */}
        <div className="ml-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
            {kr.description}
          </h3>

          {/* Tag de objetivo */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
            <FiTarget className="w-3 h-3" /> Objetivo Chave
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Critério de Sucesso */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <h4 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
                Critério de Sucesso
              </h4>
            </div>
            <p className="text-sm text-emerald-900 whitespace-pre-line leading-relaxed">
              {kr.successCriteria}
            </p>
          </div>

          {/* Status Atual */}
          {kr.currentStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
                  Status Atual
                </h4>
              </div>
              <p className="text-sm text-blue-900 whitespace-pre-line leading-relaxed">
                {kr.currentStatus}
              </p>
            </div>
          )}
        </div>

        {/* Ações de Melhoria */}
        {kr.improvementActions && kr.improvementActions.length > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">
                Próximos Passos
              </h4>
            </div>
            <ul className="space-y-2">
              {kr.improvementActions.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-amber-900"
                >
                  <span className="inline-block w-5 h-5 bg-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Efeito de hover sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
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
