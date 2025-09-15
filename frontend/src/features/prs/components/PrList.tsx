import type { PullRequest } from "../types/pr";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiGitBranch, FiHash, FiClock, FiFileText } from "react-icons/fi";
import { PrFiltersBar } from "./PrFiltersBar";
import { PaginationFooter, Skeleton } from "@/shared";
import { PrStatusBadge } from "./PrStatusBadge";
import { useMemo } from "react";

/**
 * Props for `PrList` table component. Supports both client and server pagination.
 */
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
  allRepos?: string[];
  allAuthors?: string[];
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  serverPaginated?: boolean;
  totalItems?: number;
  loading?: boolean;
}

/**
 * Renders a paginated list (table) of Pull Requests with filtering and basic metrics.
 * - If `serverPaginated` is true, slicing is skipped and `prs` is assumed current page.
 * - Provides resilient page clamping when data length changes.
 */
export function PrList({
  prs,
  onSelect,
  repoFilter,
  stateFilter,
  authorFilter,
  onFilterChange,
  allRepos,
  allAuthors,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  serverPaginated = false,
  totalItems,
  loading,
}: PrListProps) {
  // Use provided full option sets; fallback to deriving from current list if not supplied
  const repos =
    allRepos ||
    useMemo(() => Array.from(new Set(prs.map((p) => p.repo))), [prs]);
  const authors =
    allAuthors ||
    useMemo(
      () =>
        Array.from(new Set(prs.map((p) => p.user || p.author).filter(Boolean))),
      [prs]
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
        onChange={(f: {
          repo?: string;
          state?: string;
          author?: string;
          q?: string;
        }) => onFilterChange?.(f)}
      />
      <div className="overflow-x-auto rounded-2xl border border-surface-300 bg-white shadow-md">
        <table className="w-full text-sm" aria-describedby="prs-caption">
          <caption id="prs-caption" className="sr-only">
            Lista paginada de pull requests com filtros e métricas
          </caption>
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-surface-300/80">
              <th scope="col" className="text-left px-4 py-3 font-semibold">
                Pull Request
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold">
                Repo
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold">
                Criado
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold">
                Linhas
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold">
                Arquivos
              </th>
              <th
                scope="col"
                className="text-right px-4 py-3 font-semibold"
                aria-label="Ações"
              />
            </tr>
          </thead>
          <tbody className="">
            {loading && pageItems.length === 0 && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <Skeleton tone="light" className="h-4 w-72" />
                        <Skeleton tone="light" className="h-3 w-40" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton tone="light" className="h-4 w-28" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton tone="light" className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton tone="light" className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton tone="light" className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton tone="light" className="h-4 w-12" />
                    </td>
                  </tr>
                ))}
              </>
            )}
            {pageItems.map((pr) => {
              const created = new Date(pr.created_at as any);
              const validCreated = !isNaN(created.getTime());
              const createdTitle = validCreated
                ? created.toISOString()
                : "Data inválida";
              return (
                <tr
                  key={pr.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(pr);
                    }
                  }}
                  onClick={() => onSelect(pr)}
                  className="group cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 odd:bg-white even:bg-gray-50 hover:bg-indigo-50"
                >
                  <td className="px-4 py-3 max-w-[420px]">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(pr);
                        }}
                        className="text-left font-medium text-indigo-700 hover:text-indigo-800 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded"
                      >
                        {pr.title}
                      </button>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <FiHash className="w-3 h-3" /> {pr.id}
                        </span>
                        {pr.user || pr.author ? (
                          <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                            @{pr.user || pr.author}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center gap-1">
                      <FiGitBranch className="w-4 h-4 text-gray-500" />
                      {pr.repo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500" title={createdTitle}>
                    <span className="inline-flex items-center gap-1">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      {validCreated
                        ? formatDistanceToNow(created, {
                            addSuffix: true,
                            locale: ptBR,
                          })
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PrStatusBadge state={pr.state} className="text-xs" />
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <LineChangesBar
                        additions={pr.lines_added}
                        deletions={pr.lines_deleted}
                      />
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-gray-700"
                    title={`${pr.files_changed} arquivos modificados`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <FiFileText
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                      />
                      {pr.files_changed}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(pr);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                    >
                      Ver
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
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
        onPageChange={(p: number) => onPageChange?.(p)}
        onPageSizeChange={(s: number) => onPageSizeChange?.(s)}
      />
    </div>
  );
}

/**
 * Visual distribution bar for additions vs deletions (simple proportional bar).
 */
function LineChangesBar({
  additions,
  deletions,
}: {
  additions: number;
  deletions: number;
}) {
  const added = +additions || 0;
  const deleted = +deletions || 0;
  const total = added + deleted;
  const net = added - deleted;
  // Percentuais proporcionais simples (sem arredondamento que distorce visual).
  const addPct = total ? (added / total) * 100 : 0;
  const delPct = total ? (deleted / total) * 100 : 0;
  return (
    <div
      className="space-y-1"
      title={`+${added} / -${deleted} (net ${net >= 0 ? "+" : ""}${net})`}
    >
      <div className="flex justify-between text-[10px] font-medium tracking-wide">
        <span className="text-emerald-600">+{added}</span>
        <span className="text-rose-600">-{deleted}</span>
        <span className="text-slate-500">
          {net >= 0 ? "+" : ""}
          {net}
        </span>
      </div>
      <div
        className="h-1.5 w-full rounded-full bg-surface-200 overflow-hidden flex"
        role="img"
        aria-label={`Adições ${addPct.toFixed(1)}% vs deleções ${delPct.toFixed(
          1
        )}%`}
        data-total={total}
        data-add={added}
        data-del={deleted}
      >
        {added > 0 && (
          <span
            className="h-full bg-emerald-400/80"
            style={{ width: `${addPct}%` }}
            data-seg="add"
          />
        )}
        {deleted > 0 && (
          <span
            className="h-full bg-rose-400/80"
            style={{ width: `${delPct}%` }}
            data-seg="del"
          />
        )}
      </div>
    </div>
  );
}

// PaginationFooter agora movido para shared/components
