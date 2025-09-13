import React, { useMemo } from "react";
import type { PullRequest } from "../types/pr";
import { differenceInMinutes } from "date-fns";
import { StatCard, LinesDeltaCard } from "@/shared";

interface PrStatsProps {
  prs: PullRequest[];
  loading?: boolean;
}

export function PrStats({ prs, loading }: PrStatsProps) {
  const stats = useMemo(() => {
    if (!prs.length) return null;
    const open = prs.filter((p) => p.state === "open").length;
    const merged = prs.filter((p) => p.state === "merged").length;
    const closed = prs.filter((p) => p.state === "closed").length;
    const additions = prs.reduce((acc, p) => acc + (p.lines_added || 0), 0);
    const deletions = prs.reduce((acc, p) => acc + (p.lines_deleted || 0), 0);
    const mergedTimes: number[] = prs
      .filter((p) => p.merged_at)
      .map((p) => {
        const created = new Date(p.created_at);
        const mergedDate = new Date(p.merged_at!);
        return differenceInMinutes(mergedDate, created);
      });
    const avgMergeMinutes = mergedTimes.length
      ? Math.round(mergedTimes.reduce((a, b) => a + b, 0) / mergedTimes.length)
      : 0;
    return {
      total: prs.length,
      open,
      merged,
      closed,
      additions,
      deletions,
      avgMergeMinutes,
    };
  }, [prs]);

  return (
    <div className="grid gap-3 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
      <StatCard
        label="Total"
        value={loading ? "..." : stats?.total ?? 0}
        color="slate"
      />
      <StatCard
        label="Open"
        value={loading ? "..." : stats?.open ?? 0}
        color="emerald"
      />
      <StatCard
        label="Merged"
        value={loading ? "..." : stats?.merged ?? 0}
        color="indigo"
      />
      <StatCard
        label="Closed"
        value={loading ? "..." : stats?.closed ?? 0}
        color="rose"
      />
      <StatCard
        label="Avg Merge"
        value={
          loading
            ? "..."
            : stats?.avgMergeMinutes
            ? stats?.avgMergeMinutes + "m"
            : "—"
        }
        color="amber"
        small
      />
      <LinesDeltaCard
        loading={loading}
        additions={stats?.additions ?? 0}
        deletions={stats?.deletions ?? 0}
        className="xl:col-span-2 lg:col-span-2 md:col-span-2"
      />
    </div>
  );
}
