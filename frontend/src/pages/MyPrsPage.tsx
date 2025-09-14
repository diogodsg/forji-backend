import { useState, useEffect } from "react";
import { FiGitPullRequest } from "react-icons/fi";
import type { PullRequest } from "@/features/prs";
import { useRemotePrs, PrStats, PrList, PrDetailDrawer } from "@/features/prs";
import { readPrUrlState, writePrUrlState } from "@/features/prs/lib/urlFilters";
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
  const urlInitial = readPrUrlState();
  const { filters, setFilters, page, pageSize, setPage, setPageSize } =
    usePrsFiltersPagination({
      initial: { ...initialFilters, ...urlInitial },
      initialPageSize: urlInitial.pageSize || undefined,
    });

  // Sync from URL when user navigates browser history
  useEffect(() => {
    const handler = () => {
      const st = readPrUrlState();
      setFilters((prev) => ({
        ...prev,
        repo: st.repo,
        state: st.state,
        author: st.author,
        q: st.q,
      }));
      if (st.page) setPage(st.page);
      if (st.pageSize) setPageSize(st.pageSize);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [setFilters, setPage, setPageSize]);

  // Write URL on relevant state changes (debounce search separately already at filter input)
  useEffect(() => {
    writePrUrlState(
      {
        repo: filters.repo,
        state: filters.state,
        author: filters.author,
        q: filters.q,
        page,
        pageSize,
      },
      true
    );
  }, [filters.repo, filters.state, filters.author, filters.q, page, pageSize]);

  const { prs, loading, error, total, allRepos, allAuthors } = useRemotePrs(
    { ...filters, page, pageSize },
    { fallbackMocks: true }
  );

  // Page reset now handled inside the hook

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6 space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <FiGitPullRequest className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Pull Requests
            </h1>
            <p className="text-xs text-gray-500">
              Volume, estado e impacto das alterações recentes.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <PrStats prs={prs} loading={loading} />
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <PrList
          prs={prs}
          totalItems={total}
          serverPaginated
          onSelect={setSelected}
          repoFilter={filters.repo}
          stateFilter={filters.state}
          authorFilter={filters.author}
          onFilterChange={setFilters}
          allRepos={allRepos}
          allAuthors={allAuthors}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s: number) => {
            setPageSize(s);
            setPage(1);
          }}
          loading={loading}
        />
      </div>

      <PrDetailDrawer pr={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
