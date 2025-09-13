import { useState, useMemo } from "react";
import { FiGitPullRequest } from "react-icons/fi";
import type { PullRequest } from "@/features/prs";
import { useRemotePrs, PrStats, PrList, PrDetailDrawer } from "@/features/prs";
import { usePrsFiltersPagination } from "@/features/prs/hooks/usePrsFiltersPagination";

/**
 * MyPrsPage
 *
 * Presents a paginated & filterable list of pull requests for the current user (or an
 * optionally provided `ownerUserId`). Portuguese UI strings preserved; description in English.
 *
 * Filtering & Pagination:
 * - Local filter/pagination state encapsulated by `usePrsFiltersPagination` which resets page
 *   automatically when filters change.
 * - Server pagination: passes page & pageSize to the remote hook and sets `serverPaginated` on list.
 *
 * Data Fetching:
 * - `useRemotePrs` returns { prs, total, loading, error }.
 * - `fallbackMocks: true` allows graceful display of mock data during early development / API errors.
 *
 * Drawer:
 * - Selecting a PR stores it in `selected` state and renders `PrDetailDrawer`.
 */
export function MyPrsPage({
  initialFilters,
}: {
  initialFilters?: { repo?: string; state?: string; ownerUserId?: number };
} = {}) {
  const [selected, setSelected] = useState<PullRequest | null>(null);
  const { filters, setFilters, page, pageSize, setPage, setPageSize } =
    usePrsFiltersPagination({ initial: initialFilters });

  const { prs, loading, error, total } = useRemotePrs(
    { ...filters, page, pageSize },
    { fallbackMocks: true }
  );

  const filtered = useMemo(() => prs, [prs]);

  // Page reset now handled inside the hook

  return (
    <div className="p-5 space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FiGitPullRequest className="w-5 h-5 text-indigo-600" />
          <span>Pull Requests</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
            visão geral
          </span>
        </h1>
        <p className="text-[11px] text-gray-500 max-w-xl">
          Volume, estado e impacto das alterações nos seus pull requests
          recentes.
        </p>
      </header>

      <PrStats prs={prs} loading={loading} />

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {loading && filtered.length === 0 && (
          <div className="text-xs text-gray-500">
            Carregando pull requests...
          </div>
        )}
        <PrList
          prs={filtered}
          totalItems={total}
          serverPaginated
          onSelect={setSelected}
          repoFilter={filters.repo}
          stateFilter={filters.state}
          authorFilter={filters.author}
          onFilterChange={setFilters}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s: number) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>

      <PrDetailDrawer pr={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
