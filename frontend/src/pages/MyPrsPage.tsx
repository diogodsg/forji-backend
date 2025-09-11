import { useState, useMemo } from "react";
import { mockPrs } from "../mocks/prs";
import { useRemotePrs } from "../hooks/useRemotePrs";
import { PrStats } from "../components/PrStats";
import type { PullRequest } from "../types/pr";
import { PrList } from "../components/PrList";
import { PrDetailDrawer } from "../components/PrDetailDrawer";

export function MyPrsPage({
  initialFilters,
}: {
  initialFilters?: { repo?: string; state?: string; ownerUserId?: number };
} = {}) {
  const [selected, setSelected] = useState<PullRequest | null>(null);
  const [filters, setFilters] = useState<{
    repo?: string;
    state?: string;
    ownerUserId?: number;
  }>(initialFilters || {});

  const { prs: remotePrs, loading, error } = useRemotePrs(filters);

  const source = remotePrs.length ? remotePrs : mockPrs; // fallback enquanto não há dados
  const filtered = useMemo(() => source, [source]);

  return (
    <div className="p-5 space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span>Pull Requests</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
            visão geral
          </span>
        </h1>
        <p className="text-[11px] text-gray-500 max-w-xl">
          Volume, estado e impacto de alterações nos seus PRs recentes.
        </p>
      </header>

      <PrStats prs={source} loading={loading} />

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {loading && source.length === 0 && (
          <div className="text-xs text-gray-500">Carregando PRs...</div>
        )}
        <PrList
          prs={filtered}
          onSelect={setSelected}
          repoFilter={filters.repo}
          stateFilter={filters.state}
          onFilterChange={setFilters}
        />
      </div>

      <PrDetailDrawer pr={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
