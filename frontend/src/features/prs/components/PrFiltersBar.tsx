import { FiFilter } from "react-icons/fi";
import React from "react";

interface PrFiltersBarProps {
  repos: string[];
  repo?: string;
  state?: string;
  authors?: string[];
  author?: string;
  onChange: (f: { repo?: string; state?: string; author?: string }) => void;
}

const STATE_OPTIONS = ["open", "closed", "merged"];

export function PrFiltersBar({
  repos,
  repo,
  state,
  authors = [],
  author,
  onChange,
}: PrFiltersBarProps) {
  const uniqRepos = Array.from(new Set(repos)).sort();
  const uniqAuthors = Array.from(new Set(authors.filter(Boolean))).sort();
  return (
    <div className="rounded-xl border border-surface-300/80 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur px-4 py-3 flex flex-col gap-3 shadow-soft">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide font-semibold text-gray-500">
        <FiFilter className="w-4 h-4 text-gray-400" /> Filtros
      </div>
      <div className="flex flex-wrap gap-6 items-end">
        <Field label="Repositório">
          <select
            value={repo || ""}
            onChange={(e) =>
              onChange({ repo: e.target.value || undefined, state })
            }
            className="min-w-[160px] bg-white/80 border border-surface-300 rounded-md text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
            value={state || ""}
            onChange={(e) =>
              onChange({ repo, state: e.target.value || undefined, author })
            }
            className="min-w-[140px] bg-white/80 border border-surface-300 rounded-md text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
            value={author || ""}
            onChange={(e) =>
              onChange({ repo, state, author: e.target.value || undefined })
            }
            className="min-w-[140px] bg-white/80 border border-surface-300 rounded-md text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
    </div>
  );
}

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
