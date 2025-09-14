import React from "react";
import { MetricCard } from "../../../shared/ui";
import {
  FiList,
  FiGitMerge,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
} from "react-icons/fi";

interface PrsStatsProps {
  total: number;
  open: number;
  merged: number;
  closed: number;
  avgMergeHours?: number; // média em horas
  totalLines?: number; // additions + deletions
  loading?: boolean;
}

export const StatGridPrs: React.FC<PrsStatsProps> = ({
  total,
  open,
  merged,
  closed,
  avgMergeHours = 0,
  totalLines = 0,
  loading,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
        icon={FiBarChart2}
        label="Avg Merge (h)"
        value={avgMergeHours.toFixed(1)}
        tone="amber"
        loading={loading}
      />
      <MetricCard
        icon={FiBarChart2}
        label="Linhas"
        value={totalLines}
        tone="indigo"
        loading={loading}
      />
    </div>
  );
};
