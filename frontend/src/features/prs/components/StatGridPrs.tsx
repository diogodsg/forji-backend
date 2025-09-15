import React from "react";
import { MetricCard } from "../../../shared/ui";
import { FiList, FiGitMerge, FiCheckCircle, FiXCircle, FiTrendingUp } from "react-icons/fi";

interface PrsStatsProps {
  total: number;
  open: number;
  merged: number;
  closed: number;
  additions?: number;
  deletions?: number;
  loading?: boolean;
}

export const StatGridPrs: React.FC<PrsStatsProps> = ({
  total,
  open,
  merged,
  closed,
  additions = 0,
  deletions = 0,
  loading,
}) => {
  const totalChanged = additions + deletions;
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <MetricCard
        icon={FiList}
        label="Total"
        value={total}
        tone="indigo"
        loading={loading}
      />
      <MetricCard
        icon={FiCheckCircle}
        label="Open"
        value={open}
        tone="emerald"
        loading={loading}
      />
      <MetricCard
        icon={FiGitMerge}
        label="Merged"
        value={merged}
        tone="blue"
        loading={loading}
      />
      <MetricCard
        icon={FiXCircle}
        label="Closed"
        value={closed}
        tone="red"
        loading={loading}
      />
      <MetricCard
        icon={FiTrendingUp}
        label="Linhas"
        value={
          loading ? "" : (
            <span className="flex flex-col text-sm leading-tight">
              <span>
                <span className="text-emerald-600">+{additions}</span>{" "}
                <span className="text-rose-600">-{deletions}</span>
              </span>
              <span className="text-[11px] text-gray-500 font-normal">
                total {totalChanged}
              </span>
            </span>
          )
        }
        tone="amber"
        loading={loading}
      />
    </div>
  );
};
