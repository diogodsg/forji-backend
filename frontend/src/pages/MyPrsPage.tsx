import { useState, useMemo } from "react";
import { mockPrs } from "../mocks/prs";
import type { PullRequest } from "../types/pr";
import { PrList } from "../components/PrList";
import { PrDetailDrawer } from "../components/PrDetailDrawer";

export function MyPrsPage() {
  const [selected, setSelected] = useState<PullRequest | null>(null);
  const [filters, setFilters] = useState<{ repo?: string; state?: string }>({});

  const filtered = useMemo(() => {
    return mockPrs.filter((p) => {
      if (filters.repo && p.repo !== filters.repo) return false;
      if (filters.state && p.state !== filters.state) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Meus PRs</h1>
      <PrList
        prs={filtered}
        onSelect={setSelected}
        repoFilter={filters.repo}
        stateFilter={filters.state}
        onFilterChange={setFilters}
      />
      <PrDetailDrawer pr={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
