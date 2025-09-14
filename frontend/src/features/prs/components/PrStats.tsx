import { useMemo } from "react";
import type { PullRequest } from "../types/pr";
import { differenceInMinutes } from "date-fns";
import { StatCard, LinesDeltaCard, Skeleton } from "@/shared";

/**
 * Props for PR aggregate statistics component.
 */
interface PrStatsProps {
  prs: PullRequest[];
  loading?: boolean;
}

/**
 * Displays aggregate metrics for the current PR collection (client-side derived).
 * Consider server pre-aggregation if dataset scales significantly.
 */
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

  const skeleton = (
    <div className="grid gap-3 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-surface-300 bg-white px-4 py-3 shadow-sm flex flex-col gap-2"
        >
          <Skeleton tone="light" className="h-3 w-16" />
          <Skeleton tone="light" className="h-6 w-12" />
        </div>
      ))}
      <div className="rounded-2xl border border-surface-300 bg-white px-4 py-3 shadow-sm flex flex-col gap-3 xl:col-span-2 lg:col-span-2 md:col-span-2">
        <Skeleton tone="light" className="h-3 w-24" />
        <Skeleton tone="light" className="h-4 w-full" />
        <Skeleton tone="light" className="h-4 w-3/5" />
      </div>
    </div>
  );

  if (loading) return skeleton;

  return (
    <div className="grid gap-3 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
      <StatCard label="Total" value={stats?.total ?? 0} color="slate" />
      <StatCard label="Open" value={stats?.open ?? 0} color="emerald" />
      <StatCard label="Merged" value={stats?.merged ?? 0} color="indigo" />
      <StatCard label="Closed" value={stats?.closed ?? 0} color="rose" />
      <StatCard
        label="Avg Merge"
        value={stats?.avgMergeMinutes ? stats?.avgMergeMinutes + "m" : "—"}
        color="amber"
        small
      />
      <LinesDeltaCard
        additions={stats?.additions ?? 0}
        deletions={stats?.deletions ?? 0}
        className="xl:col-span-2 lg:col-span-2 md:col-span-2"
      />
    </div>
  );
}
