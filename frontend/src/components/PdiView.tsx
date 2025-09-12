import type { PdiPlan } from "../types/pdi";
import React from "react";
import { FiAward, FiTrendingUp, FiCalendar, FiBarChart2 } from "react-icons/fi";

interface Props {
  plan: PdiPlan;
}

export const PdiView: React.FC<Props> = ({ plan }) => {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-xl border border-surface-300 bg-gradient-to-br from-indigo-50 to-sky-50 p-6 shadow-sm">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl" />
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiAward className="w-5 h-5 text-indigo-600" />
          Competências técnicas a desenvolver
        </h2>
        <div className="flex flex-wrap gap-2">
          {plan.competencies.map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full text-xs bg-white border border-surface-300 text-indigo-700"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {plan.krs && plan.krs.length > 0 && (
        <section className="rounded-xl border border-surface-300 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-indigo-600" />
            Key Results
          </h2>
          <div className="space-y-4">
            {plan.krs.map((kr) => (
              <div
                key={kr.id}
                className="border border-surface-200 rounded-lg p-4 bg-surface-50/50"
              >
                <h3 className="text-sm font-medium text-indigo-700 mb-2 leading-snug">
                  {kr.description}
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-xs md:text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500 mb-1">
                      Noção de sucesso
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">
                      {kr.successCriteria}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500 mb-1">
                      Status atual
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">
                      {kr.currentStatus || "-"}
                    </p>
                  </div>
                  <div>
                    {kr.improvementActions &&
                      kr.improvementActions.length > 0 && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500 mb-1">
                            Ações de melhoria
                          </p>
                          <ul className="list-disc ml-4 space-y-1 text-gray-700">
                            {kr.improvementActions.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-indigo-600" />
          Acompanhamento
        </h2>
        <div className="space-y-5">
          {plan.milestones.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-indigo-700 leading-tight">
                    {m.title}
                  </h3>
                  <p className="text-[11px] tracking-wide uppercase text-gray-500 mt-1">
                    {m.date}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <MarkdownText text={m.summary} />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-violet-700 mb-2">
                      Sugestões (IA)
                    </h4>
                    <ul className="text-xs space-y-1 list-disc ml-4">
                      {m.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.tasks && m.tasks.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 md:col-span-1">
                    <h4 className="text-xs font-semibold text-indigo-700 mb-2">
                      Tarefas / Próximos passos
                    </h4>
                    <ul className="text-xs space-y-1">
                      {m.tasks.map((t) => (
                        <li key={t.id} className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 inline-block h-3 w-3 rounded border ${
                              t.done
                                ? "bg-indigo-600 border-indigo-600"
                                : "border-indigo-300"
                            }`}
                          />
                          <span
                            className={
                              t.done ? "line-through text-gray-400" : ""
                            }
                          >
                            {t.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.positives && m.positives.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-emerald-700 mb-2">
                      Pontos positivos
                    </h4>
                    <ul className="text-xs space-y-1 list-disc ml-4">
                      {m.positives.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.improvements && m.improvements.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-amber-700 mb-2">
                      Pontos de melhoria
                    </h4>
                    <ul className="text-xs space-y-1 list-disc ml-4">
                      {m.improvements.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.resources && m.resources.length > 0 && (
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-sky-700 mb-2">
                      Referências
                    </h4>
                    <ul className="text-xs space-y-1 list-disc ml-4">
                      {m.resources.map((r, i) => (
                        <li key={i}>
                          <a
                            href={r}
                            target="_blank"
                            className="text-indigo-600 underline decoration-dotted hover:text-indigo-400"
                          >
                            {r}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiBarChart2 className="w-5 h-5 text-indigo-600" />
          Resultado
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-xs uppercase tracking-wide">
              <tr className="border-b border-surface-300">
                <th className="text-left py-2 pr-4 font-medium">
                  Área Técnica
                </th>
                <th className="text-left py-2 pr-4 font-medium">Nível antes</th>
                <th className="text-left py-2 pr-4 font-medium">
                  Nível depois
                </th>
                <th className="text-left py-2 font-medium">Evidências</th>
              </tr>
            </thead>
            <tbody>
              {plan.records.map((r) => (
                <tr
                  key={r.area}
                  className="border-b last:border-0 border-surface-300/70"
                >
                  <td className="py-2 pr-4 text-gray-700">{r.area}</td>
                  <td className="py-2 pr-4 text-gray-700">
                    {r.levelBefore ?? "-"}
                  </td>
                  <td className="py-2 pr-4 text-gray-700">
                    {r.levelAfter ?? "-"}
                  </td>
                  <td className="py-2 text-xs text-gray-500">
                    {r.evidence || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const MarkdownText = ({ text }: { text: string }) => {
  return (
    <div className="prose max-w-none text-sm leading-relaxed prose-p:my-0">
      {text.split(/\n{2,}/).map((b, i) => (
        <p key={i}>{b}</p>
      ))}
    </div>
  );
};
