import React, { useMemo } from "react";
import type { PullRequest } from "../types/pr";
import { differenceInMinutes } from "date-fns";

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

function StatCard({
  label,
  value,
  color = "slate",
  small,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
  small?: boolean;
  className?: string;
}) {
  const palette: Record<string, string> = {
    slate: "bg-slate-200 text-slate-600",
    emerald: "bg-emerald-200 text-emerald-600",
    indigo: "bg-indigo-200 text-indigo-600",
    rose: "bg-rose-200 text-rose-600",
    amber: "bg-amber-200 text-amber-600",
  };
  return (
    <div
      className={`relative rounded-lg border border-surface-300/70 bg-white/60 backdrop-blur px-3 py-2 flex flex-col ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${palette[color] || palette.slate}`}
        ></span>
        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
          {label}
        </span>
      </div>
      <span
        className={`font-semibold ${
          small ? "text-sm" : "text-base"
        } text-gray-800 mt-0.5`}
      >
        {value}
      </span>
    </div>
  );
}

function LinesDeltaCard({
  additions,
  deletions,
  loading,
  className = "",
}: {
  additions: number;
  deletions: number;
  loading?: boolean;
  className?: string;
}) {
  const total = additions + deletions;
  const addPct = total ? (additions / total) * 100 : 0;
  const delPct = total ? (deletions / total) * 100 : 0;
  return (
    <div
      className={`relative rounded-lg border border-surface-300/70 bg-white/60 backdrop-blur px-3 py-2 flex flex-col justify-between ${className}`}
    >
      <div className="relative flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
          Linhas
        </span>
        {loading ? (
          <span className="text-sm font-semibold text-gray-700">...</span>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="text-emerald-600">+{additions}</span>
              <span className="text-rose-600">-{deletions}</span>
              <span className="text-gray-400 text-[10px]">
                = {additions - deletions >= 0 ? "+" : ""}
                {additions - deletions}
              </span>
            </div>
            <div
              className="h-2 rounded-full bg-surface-200 overflow-hidden relative"
              title={`Add: ${additions}  Del: ${deletions}`}
            >
              <div
                className="absolute left-0 top-0 h-full bg-emerald-400/70"
                style={{ width: addPct + "%" }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-rose-400/70"
                style={{ width: delPct + "%" }}
              />
            </div>
            <span className="text-[9px] tracking-wide text-gray-400">
              {total ? (
                <>
                  {addPct.toFixed(0)}% + / {delPct.toFixed(0)}% - (total {total}
                  )
                </>
              ) : (
                "Sem mudanças"
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
