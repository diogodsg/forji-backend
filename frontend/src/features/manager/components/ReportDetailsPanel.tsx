import type { ReportSummary } from "../types/manager";
import { MyPrsPage } from "@/pages/MyPrsPage";
import { ManagerPdiPanel } from "./ManagerPdiPanel";
import { useRemotePdiForUser } from "@/features/pdi/hooks/useRemotePdiForUser";
import { useRemotePrs, usePrCounts } from "@/features/prs";
import { useEffect } from "react";

interface ReportDetailsPanelProps {
  report: ReportSummary | null;
  onClose: () => void;
  tab: string; // 'prs' | 'pdi'
  onTabChange: (tab: string) => void;
}

/**
 * Painel de detalhes inline para substituir drawer lateral.
 * Ocupa largura total abaixo da grade de cards e fornece abas PRs / PDI.
 */
export function ReportDetailsPanel({
  report,
  onClose,
  tab,
  onTabChange,
}: ReportDetailsPanelProps) {
  const userId = report?.userId;
  const {
    plan,
    loading: pdiLoading,
    error: pdiError,
    upsert: upsertPdi,
  } = useRemotePdiForUser(userId);
  const { prs, loading: prsLoading } = useRemotePrs(
    { ownerUserId: userId },
    { skip: !userId }
  );
  const counts = usePrCounts(prs);

  // Ajuste: ao trocar usuário, priorizar PDI como primeira aba.
  // Mantemos a aba atual se o usuário apenas re-selecionar o mesmo card.
  useEffect(() => {
    if (!userId) return;
    // Força para 'pdi' sempre que mudar de usuário.
    onTabChange("pdi");
  }, [userId]);

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
          <Badge color="emerald">Open {counts.open}</Badge>
          <Badge color="violet">Merged {counts.merged}</Badge>
          <Badge color="rose">Closed {counts.closed}</Badge>
          <Badge color="amber">
            PDI {Math.round(report.pdi.progress * 100)}%
          </Badge>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs">
          <TabButton active={tab === "prs"} onClick={() => onTabChange("prs")}>
            PRs
          </TabButton>
          <TabButton active={tab === "pdi"} onClick={() => onTabChange("pdi")}>
            PDI
          </TabButton>
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-[11px] rounded bg-surface-100 hover:bg-surface-200 text-surface-600"
          >
            Fechar
          </button>
        </div>
      </div>
      <div className="p-5">
        {tab === "prs" && (
          <div className="space-y-5">
            {prsLoading && (
              <div className="text-xs text-surface-500">Carregando PRs...</div>
            )}
            {!prsLoading && (
              <MyPrsPage initialFilters={{ ownerUserId: userId }} />
            )}
          </div>
        )}
        {tab === "pdi" && (
          <ManagerPdiPanel
            loading={pdiLoading}
            error={pdiError}
            plan={plan}
            currentUserId={userId}
            onCreate={() =>
              userId &&
              upsertPdi({
                userId: String(userId),
                competencies: [],
                milestones: [],
                krs: [],
                records: [],
              })
            }
          />
        )}
        {/* KPI aba removida para reduzir densidade visual */}
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

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded border text-[11px] font-medium transition ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-indigo-700 border-indigo-200 hover:bg-surface-100"
      }`}
    >
      {children}
    </button>
  );
}
