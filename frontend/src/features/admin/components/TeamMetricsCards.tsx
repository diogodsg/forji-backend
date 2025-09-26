import type { TeamMetrics } from "../types";
import { FiUsers, FiStar, FiGrid, FiSlash, FiClock } from "react-icons/fi";
import type React from "react";

interface Props {
  metrics: TeamMetrics | null;
  loading: boolean;
}

// Reusable stat card pattern (mirrors PR cards style assumptions)
function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-surface-300/70 bg-white/80 backdrop-blur px-4 py-3 shadow-sm">
      <div
        className={`h-11 w-11 flex items-center justify-center rounded-lg ${accent}`}
      >
        <span className="text-[18px] text-current inline-flex items-center justify-center">
          {icon}
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {label}
        </span>
        <span className="text-lg font-semibold text-gray-800 tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}

export function TeamMetricsCards({ metrics, loading }: Props) {
  const skeleton = (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-[76px] rounded-xl border border-surface-300/60 bg-surface-100/60"
        />
      ))}
    </div>
  );
  if (loading && !metrics) return skeleton;
  if (!metrics) return skeleton;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <StatCard
        label="Times"
        value={metrics.totalTeams}
        icon={<FiUsers />}
        accent="bg-indigo-50 text-indigo-600"
      />
      <StatCard
        label="Managers"
        value={metrics.totalManagers}
        icon={<FiStar />}
        accent="bg-amber-50 text-amber-600"
      />
      <StatCard
        label="Membros"
        value={metrics.totalMembers}
        icon={<FiGrid />}
        accent="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        label="Sem Equipe"
        value={metrics.usersWithoutTeam}
        icon={<FiSlash />}
        accent="bg-rose-50 text-rose-600"
      />
      <StatCard
        label="Última Criação"
        value={
          metrics.lastTeamCreatedAt
            ? new Date(metrics.lastTeamCreatedAt).toLocaleDateString()
            : "--"
        }
        icon={<FiClock />}
        accent="bg-purple-50 text-purple-600"
      />
    </div>
  );
}
