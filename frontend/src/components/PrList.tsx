import type { PullRequest } from "../types/pr";
import { formatDistanceToNow } from "date-fns";
import {
  FiFilter,
  FiGitBranch,
  FiHash,
  FiClock,
  FiFileText,
} from "react-icons/fi";

interface PrListProps {
  prs: PullRequest[];
  onSelect: (pr: PullRequest) => void;
  repoFilter?: string;
  stateFilter?: string;
  onFilterChange?: (f: {
    repo?: string;
    state?: string;
    sort?: string;
  }) => void;
}

export function PrList({
  prs,
  onSelect,
  repoFilter,
  stateFilter,
  onFilterChange,
}: PrListProps) {
  const repos = Array.from(new Set(prs.map((p) => p.repo)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end bg-white/70 border border-surface-300 rounded-xl px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiFilter className="w-3.5 h-3.5" />
          Filtros
        </div>
        <FilterSelect
          label="Repositório"
          value={repoFilter || ""}
          onChange={(v) =>
            onFilterChange?.({ repo: v || undefined, state: stateFilter })
          }
          options={repos}
        />
        <FilterSelect
          label="Status"
          value={stateFilter || ""}
          onChange={(v) =>
            onFilterChange?.({ repo: repoFilter, state: v || undefined })
          }
          options={["open", "closed", "merged"]}
          allowEmpty
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-surface-300 bg-white/70 backdrop-blur shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-surface-300/80">
              <th className="text-left px-3 py-2 font-medium">Título</th>
              <th className="text-left px-3 py-2 font-medium">Repo</th>
              <th className="text-left px-3 py-2 font-medium">Criado</th>
              <th className="text-left px-3 py-2 font-medium">T. Merge</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Linhas</th>
              <th className="text-left px-3 py-2 font-medium">Arquivos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-300/70">
            {prs.map((pr) => {
              const created = new Date(pr.created_at);
              const merged = pr.merged_at ? new Date(pr.merged_at) : undefined;
              const timeToMerge = merged
                ? `${Math.round(
                    (merged.getTime() - created.getTime()) / 60000
                  )}m`
                : "-";
              return (
                <tr
                  key={pr.id}
                  onClick={() => onSelect(pr)}
                  className="group cursor-pointer hover:bg-surface-200 transition-colors"
                >
                  <td className="px-3 py-2 max-w-[280px]">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 group-hover:text-gray-900 line-clamp-1">
                        {pr.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 tracking-wide">
                        <FiHash className="w-3 h-3" /> {pr.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    <span className="inline-flex items-center gap-1">
                      <FiGitBranch className="w-4 h-4 text-gray-500" />
                      {pr.repo}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2 text-gray-500"
                    title={created.toISOString()}
                  >
                    <span className="inline-flex items-center gap-1">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      {formatDistanceToNow(created, { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{timeToMerge}</td>
                  <td className="px-3 py-2">
                    <StatusBadge state={pr.state} />
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    <div className="flex flex-col gap-1 min-w-[90px]">
                      <div className="flex items-center gap-1 text-[10px] font-medium">
                        <span className="px-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                          +{pr.lines_added}
                        </span>
                        <span className="px-1 rounded bg-rose-50 text-rose-600 border border-rose-200">
                          -{pr.lines_deleted}
                        </span>
                        <span className="px-1 rounded bg-slate-50 text-slate-500 border border-slate-200">
                          {pr.lines_added - pr.lines_deleted >= 0 ? "+" : ""}
                          {pr.lines_added - pr.lines_deleted}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-200 relative overflow-hidden">
                        {(() => {
                          const added = pr.lines_added || 0;
                          const deleted = pr.lines_deleted || 0;
                          const total = added + deleted;
                          const addPct = total ? (added / total) * 100 : 0;
                          const delPct = total ? (deleted / total) * 100 : 0;
                          return (
                            <>
                              <div
                                className="absolute left-0 top-0 h-full bg-emerald-400/70"
                                style={{ width: addPct + "%" }}
                              />
                              <div
                                className="absolute right-0 top-0 h-full bg-rose-400/70"
                                style={{ width: delPct + "%" }}
                              />
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    <span className="inline-flex items-center gap-1">
                      <FiFileText className="w-4 h-4 text-gray-500" />
                      {pr.files_changed}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allowEmpty,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allowEmpty?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-surface-300 rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      >
        {allowEmpty && <option value="">Todos</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ state }: { state: string }) {
  const map: Record<string, string> = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    closed: "bg-rose-50 text-rose-700 border-rose-200",
    merged: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border ${map[state]}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          state === "open"
            ? "bg-emerald-500"
            : state === "merged"
            ? "bg-indigo-500"
            : "bg-rose-500"
        }`}
      />
      {state}
    </span>
  );
}
