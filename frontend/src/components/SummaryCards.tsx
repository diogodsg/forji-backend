import { weeklyMetrics } from "../mocks/prs";

export function SummaryCards() {
  const totalPrs = weeklyMetrics.reduce((a, b) => a + b.prs, 0);
  const avgTime = Math.round(
    weeklyMetrics.reduce((a, b) => a + b.avgTimeToMergeHours, 0) /
      weeklyMetrics.length
  );
  const avgRework = Math.round(
    weeklyMetrics.reduce((a, b) => a + b.reworkRatePct, 0) /
      weeklyMetrics.length
  );
  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <Card label="Total PRs" value={totalPrs} />
      <Card label="Tempo médio merge (h)" value={avgTime} />
      <Card label="% rework" value={avgRework + "%"} />
    </div>
  );
}

const Card = ({ label, value }: { label: string; value: number | string }) => (
  <div className="bg-gray-900 border border-gray-800 rounded p-4">
    <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
      {label}
    </div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);
