import type { ReportSummary } from "../types/manager";
import { ManagerPdiPanel } from "./ManagerPdiPanel";
import { useRemotePdiForUser } from "@/features/pdi/hooks/useRemotePdiForUser";

interface ReportDetailsPanelProps {
  report: ReportSummary | null;
  onClose: () => void;
  closeLabel?: string;
}

/**
 * Painel de detalhes inline para substituir drawer lateral.
 * Ocupa largura total abaixo da grade de cards focado no PDI.
 */
export function ReportDetailsPanel({
  report,
  onClose,
  closeLabel,
}: ReportDetailsPanelProps) {
  const userId = report?.userId;
  const {
    plan,
    loading: pdiLoading,
    error: pdiError,
    upsert: upsertPdi,
  } = useRemotePdiForUser(userId);

  if (!report) return null;

  return (
    <div className="mt-4 border border-surface-200 rounded-2xl bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start gap-4 p-5 border-b border-surface-200 flex-wrap">
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar name={report.name} />
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{report.name}</div>
            <div className="text-[11px] text-surface-500 truncate">
              {report.email}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium flex-wrap">
          <Badge color="amber">
            PDI {Math.round(report.pdi.progress * 100)}%
          </Badge>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-[11px] rounded bg-surface-100 hover:bg-surface-200 text-surface-600"
          >
            {closeLabel ?? "Fechar"}
          </button>
        </div>
      </div>
      <div className="p-5">
        <ManagerPdiPanel
          loading={pdiLoading}
          error={pdiError}
          plan={plan}
          currentUserId={userId}
          onCreate={() =>
            userId &&
            upsertPdi({
              userId: String(userId),
              cycles: [],
              competencies: [],
              milestones: [],
              krs: [],
              records: [],
            })
          }
        />
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
    <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
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
    <span
      className={`px-2 py-0.5 rounded text-[11px] font-medium ${map[color]}`}
    >
      {children}
    </span>
  );
}
