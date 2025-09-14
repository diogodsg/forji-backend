import { FiFilter, FiSearch } from "react-icons/fi";
import React, { useState, useEffect } from "react";

interface PrFiltersBarProps {
  repos: string[];
  repo?: string;
  state?: string;
  authors?: string[];
  author?: string;
  q?: string;
  onChange: (f: {
    repo?: string;
    state?: string;
    author?: string;
    q?: string;
  }) => void;
  autoApply?: boolean; // default true
}

const STATE_OPTIONS = ["open", "closed", "merged"];

export function PrFiltersBar({
  repos,
  repo,
  state,
  authors = [],
  author,
  q,
  onChange,
  autoApply = true,
}: PrFiltersBarProps) {
  const uniqRepos = Array.from(new Set(repos)).sort();
  const uniqAuthors = Array.from(new Set(authors.filter(Boolean))).sort();

  // staged values allow non-auto apply workflow
  const [repoSel, setRepoSel] = useState(repo || "");
  const [stateSel, setStateSel] = useState(state || "");
  const [authorSel, setAuthorSel] = useState(author || "");
  const [internalQ, setInternalQ] = useState(q || "");

  // keep staging in sync with external changes (e.g., URL navigation)
  useEffect(() => setRepoSel(repo || ""), [repo]);
  useEffect(() => setStateSel(state || ""), [state]);
  useEffect(() => setAuthorSel(author || ""), [author]);
  useEffect(() => setInternalQ(q || ""), [q]);

  // debounce search only in autoApply mode
  useEffect(() => {
    if (!autoApply) return;
    const h = setTimeout(() => {
      if (internalQ !== (q || ""))
        onChange({
          repo: repoSel || undefined,
          state: stateSel || undefined,
          author: authorSel || undefined,
          q: internalQ || undefined,
        });
    }, 300);
    return () => clearTimeout(h);
  }, [internalQ]); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = () =>
    onChange({
      repo: repoSel || undefined,
      state: stateSel || undefined,
      author: authorSel || undefined,
      q: internalQ || undefined,
    });

  const clear = () => {
    setRepoSel("");
    setStateSel("");
    setAuthorSel("");
    setInternalQ("");
    onChange({});
  };

  const dirty =
    !autoApply &&
    (repoSel !== (repo || "") ||
      stateSel !== (state || "") ||
      authorSel !== (author || "") ||
      internalQ !== (q || ""));

  // Active tag badges & clear button removed per request

  return (
    <div className="rounded-2xl border border-surface-300 bg-white px-6 py-5 shadow-md w-full flex flex-col gap-3">
      {/* Filter badges removed */}
      <div className="flex flex-wrap items-start gap-6 w-full mt-1">
        <div className="flex items-center gap-2 min-w-[90px]">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
            <FiFilter className="w-4 h-4" />
          </div>
          <span className="text-[11px] uppercase font-semibold tracking-wide text-gray-700">
            Filtros
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-[260px]">
          <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Busca
          </label>
          <div className="relative">
            <FiSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={internalQ}
              onChange={(e) => setInternalQ(e.target.value)}
              placeholder="Digite título ou autor…"
              className="pl-9 pr-3 py-2 text-sm rounded-2xl border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-full shadow-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-5">
          <Field label="Repositório">
            <select
              value={repoSel}
              onChange={(e) => {
                setRepoSel(e.target.value);
                if (autoApply)
                  onChange({
                    repo: e.target.value || undefined,
                    state: stateSel || undefined,
                    author: authorSel || undefined,
                    q: internalQ || undefined,
                  });
              }}
              className="min-w-[160px] bg-white border border-surface-300 rounded-2xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-sm"
            >
              <option value="">Todos</option>
              {uniqRepos.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              value={stateSel}
              onChange={(e) => {
                setStateSel(e.target.value);
                if (autoApply)
                  onChange({
                    repo: repoSel || undefined,
                    state: e.target.value || undefined,
                    author: authorSel || undefined,
                    q: internalQ || undefined,
                  });
              }}
              className="min-w-[140px] bg-white border border-surface-300 rounded-2xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-sm"
            >
              <option value="">Todos</option>
              {STATE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Autor">
            <select
              value={authorSel}
              onChange={(e) => {
                setAuthorSel(e.target.value);
                if (autoApply)
                  onChange({
                    repo: repoSel || undefined,
                    state: stateSel || undefined,
                    author: e.target.value || undefined,
                    q: internalQ || undefined,
                  });
              }}
              className="min-w-[140px] bg-white border border-surface-300 rounded-2xl text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-sm"
            >
              <option value="">Todos</option>
              {uniqAuthors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex flex-col justify-end gap-2 ml-auto min-w-[150px] items-end">
          {autoApply ? null : (
            <div className="flex items-center gap-2">
              <button
                onClick={apply}
                disabled={!dirty}
                className={`px-4 py-2 rounded-xl text-xs font-medium shadow-sm transition-colors ${
                  dirty
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                Aplicar filtros
              </button>
              <button
                onClick={clear}
                className="px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                Limpar
              </button>
            </div>
          )}
          {/* Clear filters quick button removed for simplified UI */}
        </div>
      </div>
    </div>
  );
}

/**
 * Small labeled wrapper for form controls.
 */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-medium text-gray-600">
      <span className="uppercase tracking-wide text-[10px] text-gray-500 font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}
