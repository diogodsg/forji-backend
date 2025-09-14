import type { ManagerDashboardData } from "../types/manager";
import { useDeferredLoading } from "../hooks/useDeferredLoading";

interface TeamOverviewBarProps {
  data?: ManagerDashboardData;
  loading?: boolean;
}

// UX Rationale:
// - Single horizontal bar to reduce vertical consumption vs. 3 separate cards
// - Subtle container: light border + slight background tint for separation without heavy chrome
// - Metrics read left-to-right with strong value emphasis and semantic pluralization in PT-BR
// - Uses middot separators for visual rhythm, accessible text still plain
// - Non-interactive: role="group" purely informational
export function TeamOverviewBar({ data, loading }: TeamOverviewBarProps) {
  const reportsCount = data?.metrics.totalReports ?? 0;
  const openPrs = data?.metrics.prs.open ?? 0;
  const activePdi = data?.metrics.pdiActive ?? 0;
  const deferred = useDeferredLoading(!!loading, {
    delay: 120,
    minVisible: 320,
  });

  const plural = (value: number, singular: string, plural: string) =>
    `${value} ${value === 1 ? singular : plural}`;

  return (
    <div
      className="mt-2 mb-2 px-4"
      role="group"
      aria-label="Visão Geral da Equipe"
    >
      <div className="w-full rounded-lg border border-surface-200 bg-white/60 backdrop-blur-sm shadow-sm px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        <span className="font-medium text-surface-500 tracking-tight pr-1">
          Visão Geral da Equipe
        </span>
        <Separator />
        {deferred ? (
          <div className="flex items-center gap-x-6 gap-y-1 flex-wrap animate-pulse">
            <SkeletonMetric width={80} />
            <Dot />
            <SkeletonMetric width={100} />
            <Dot />
            <SkeletonMetric width={90} />
          </div>
        ) : (
          <>
            <Metric
              value={reportsCount}
              label={plural(reportsCount, "Subordinado", "Subordinados")}
            />
            <Dot />
            <Metric
              value={openPrs}
              label={plural(openPrs, "PR Aberto", "PRs Abertos")}
            />
            <Dot />
            <Metric
              value={activePdi}
              label={plural(activePdi, "PDI Ativo", "PDIs Ativos")}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="font-semibold text-surface-900 tabular-nums">
        {value}
      </span>
      <span className="text-surface-600">{label.replace(/^\d+\s/, "")}</span>
    </span>
  );
}

function Separator() {
  return <span className="h-4 w-px bg-surface-200" aria-hidden="true" />;
}

function Dot() {
  return (
    <span className="text-surface-300 select-none" aria-hidden="true">
      •
    </span>
  );
}

function SkeletonMetric({ width }: { width: number }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="rounded h-4 bg-surface-200/70" style={{ width: 20 }} />
      <span
        className="rounded h-3 bg-surface-200/50"
        style={{ width }}
        aria-hidden="true"
      />
    </span>
  );
}
