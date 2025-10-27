import type { ReportSummary } from "../types/manager";

interface ReportCardProps {
  report: ReportSummary;
  onSelect: (userId: string) => void;
  active: boolean;
}

export function ReportCard({ report, onSelect, active }: ReportCardProps) {
  const { pdi } = report;
  const progressPct = Math.round((pdi.progress || 0) * 100);

  const handleClick = () => {
    onSelect(report.userId);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-left w-full rounded-xl border p-4 flex flex-col gap-3 transition shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400/50
        ${
          active
            ? "bg-indigo-50 border-indigo-300"
            : "bg-white border-surface-200"
        }`}
      title="Abrir edição do colaborador"
    >
      <div className="flex items-center gap-3">
        <Avatar name={report.name} />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{report.name}</div>
          {report.position && (
            <div className="text-[11px] text-indigo-600 truncate font-medium">
              {report.position}
            </div>
          )}
          <div className="text-[11px] text-surface-500 truncate">
            {report.email}
          </div>
        </div>
      </div>
      {/* Teams */}
      {report.teams && report.teams.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {report.teams.slice(0, 2).map((team) => (
            <span
              key={team.id}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700"
            >
              {team.name}
            </span>
          ))}
          {report.teams.length > 2 && (
            <span className="text-[10px] text-surface-500 font-medium">
              +{report.teams.length - 2} mais
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] font-medium flex-wrap">
        <Badge color="amber">PDI {pdi.exists ? `${progressPct}%` : "—"}</Badge>
      </div>
      <div className="space-y-1">
        <ProgressBar value={progressPct} exists={pdi.exists} />
      </div>
    </button>
  );
}

// Skeleton placeholder para estado de carregamento inicial da lista
export function ReportCardSkeleton() {
  return (
    <div className="animate-pulse w-full rounded-xl border border-surface-200 bg-white p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-surface-200" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-32 bg-surface-200 rounded" />
          <div className="h-2 w-40 bg-surface-100 rounded" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="h-4 w-14 bg-emerald-50 rounded" />
        <div className="h-4 w-14 bg-violet-50 rounded" />
        <div className="h-4 w-14 bg-rose-50 rounded" />
        <div className="h-4 w-14 bg-amber-50 rounded" />
      </div>
      <div className="space-y-1">
        <div className="h-2 w-full rounded-full bg-surface-100 overflow-hidden">
          <div className="h-full w-1/3 bg-surface-200" />
        </div>
        <div className="h-2 w-20 bg-surface-100 rounded" />
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "emerald" | "violet" | "rose" | "amber" | "gray";
}) {
  const map: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    gray: "bg-surface-100 text-surface-600",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded ${map[color]}`}>{children}</span>
  );
}

function ProgressBar({ value, exists }: { value: number; exists: boolean }) {
  return (
    <div className="h-2 w-full rounded-full bg-surface-100 overflow-hidden">
      <div
        className={`h-full transition-all ${
          !exists
            ? "bg-surface-300"
            : value < 25
            ? "bg-rose-400"
            : value < 60
            ? "bg-amber-400"
            : "bg-emerald-500"
        }`}
        style={{ width: exists ? `${value}%` : "20%" }}
      />
    </div>
  );
}
