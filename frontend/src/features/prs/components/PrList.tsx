import type { PullRequest } from "../types/pr";
import { formatDistanceToNow } from "date-fns";
import { FiGitBranch, FiHash, FiClock, FiFileText } from "react-icons/fi";
import { PrFiltersBar } from "./PrFiltersBar";

interface PrListProps {
  prs: PullRequest[];
  onSelect: (pr: PullRequest) => void;
  repoFilter?: string;
  stateFilter?: string;
  authorFilter?: string;
  onFilterChange?: (f: {
    repo?: string;
    state?: string;
    author?: string;
    sort?: string;
  }) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  serverPaginated?: boolean;
  totalItems?: number;
}

export function PrList({
  prs,
  onSelect,
  repoFilter,
  stateFilter,
  authorFilter,
  onFilterChange,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  serverPaginated = false,
  totalItems,
}: PrListProps) {
  const repos = Array.from(new Set(prs.map((p) => p.repo)));
  const authors = Array.from(
    new Set(prs.map((p) => p.user || p.author).filter(Boolean))
  );
  const total = serverPaginated ? totalItems ?? prs.length : prs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageItems = serverPaginated
    ? prs
    : prs.slice(
        (safePage - 1) * pageSize,
        (safePage - 1) * pageSize + pageSize
      );

  return (
    <div className="space-y-6">
      <PrFiltersBar
        repos={repos}
        repo={repoFilter}
        state={stateFilter}
        authors={authors as string[]}
        author={authorFilter}
        onChange={(f: { repo?: string; state?: string; author?: string }) =>
          onFilterChange?.(f)
        }
      />
      <div className="overflow-x-auto rounded-xl border border-surface-300 bg-white/70 backdrop-blur shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-surface-300/80">
              <th className="text-left px-3 py-2 font-medium">Título</th>
              <th className="text-left px-3 py-2 font-medium">Autor</th>
              <th className="text-left px-3 py-2 font-medium">Repo</th>
              <th className="text-left px-3 py-2 font-medium">Criado</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Linhas</th>
              <th className="text-left px-3 py-2 font-medium">Arquivos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-300/70">
            {pageItems.map((pr) => {
              const created = new Date(pr.created_at);
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
                    {pr.user ? (
                      <span className="text-xs font-medium text-gray-800">
                        @{pr.user}
                      </span>
                    ) : pr.author ? (
                      <span className="text-xs text-gray-500">
                        @{pr.author}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
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
      <PaginationFooter
        page={safePage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={(p) => onPageChange?.(p)}
        onPageSizeChange={(s) => onPageSizeChange?.(s)}
      />
    </div>
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

function PaginationFooter({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange?: (p: number) => void;
  onPageSizeChange?: (s: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600 bg-white/60 rounded-lg">
      <div className="flex items-center gap-2 order-2 sm:order-1">
        <button
          onClick={() => page > 1 && onPageChange?.(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded border border-surface-300 disabled:opacity-40 bg-white hover:bg-surface-100"
        >
          Prev
        </button>
        <span className="px-2">
          Página <strong>{page}</strong> de <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => page < totalPages && onPageChange?.(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 rounded border border-surface-300 disabled:opacity-40 bg-white hover:bg-surface-100"
        >
          Next
        </button>
      </div>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <span className="uppercase tracking-wide text-[10px] text-gray-500">
          Itens por página
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
          className="border border-surface-300 rounded-md bg-white/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-gray-400 hidden md:inline">•</span>
        <span className="text-gray-500">
          Total <strong>{totalItems}</strong>
        </span>
      </div>
    </div>
  );
}
