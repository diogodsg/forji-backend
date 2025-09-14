import React from "react";
import { MetricCard } from "../../../shared/ui";
import { FiTarget, FiTrendingUp, FiCalendar, FiLayers } from "react-icons/fi";

interface PdiStatsProps {
  competenciesCount: number;
  openKrs: number;
  meetings: number;
  avgProgressPct: number; // 0-100
  loading?: boolean;
}

export const StatGridPdi: React.FC<PdiStatsProps> = ({
  competenciesCount,
  openKrs,
  meetings,
  avgProgressPct,
  loading,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={FiLayers}
        label="Competências"
        value={competenciesCount}
        tone="blue"
        loading={loading}
      />
      <MetricCard
        icon={FiTarget}
        label="KRs Abertos"
        value={openKrs}
        tone="indigo"
        loading={loading}
      />
      <MetricCard
        icon={FiCalendar}
        label="Acompanhamentos"
        value={meetings}
        tone="emerald"
        loading={loading}
      />
      <MetricCard
        icon={FiTrendingUp}
        label="Progresso Médio"
        value={`${avgProgressPct.toFixed(0)}%`}
        tone="amber"
        loading={loading}
      />
    </div>
  );
};
