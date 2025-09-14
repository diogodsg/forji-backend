// TODO(refactor): Extrair sidebar, header e painel de PDI para `features/manager/components`.
// Manter esta página apenas como orquestradora de rota.
import { useMemo, useState } from "react";
/**
 * ManagerDashboardPage
 *
 * Consolidated dashboard for a manager to switch between PR visibility and PDI management
 * for selected direct reports. Portuguese UI strings kept; documentation in English.
 *
 * Flow:
 * 1. Fetch reports list (potentially empty) via `useMyReports`.
 * 2. User selects a report (or none) -> sets `currentId`.
 * 3. When a user is selected, fetch PR sample & PDI plan concurrently.
 * 4. Allow switching between PR list reuse (`MyPrsPage`) and embedded PDI panel.
 *
 * Decomposition:
 * - Sidebar: `ReportsSidebar`
 * - Header: `ManagerHeader` (shows counters and tab switch)
 * - PDI Panel: `ManagerPdiPanel` (creation + view logic)
 *
 * Future considerations:
 * - Add server-side filtering for large report lists.
 * - Persist last selected tab and user (e.g., localStorage / URL params).
 * - Replace `any` cast on reports with stronger shared types.
 */
import { useMyReports } from "../features/admin";
// PDI carregado dentro do painel de detalhes agora
// import { useRemotePrs } from "@/features/prs";
import {
  ReportCard,
  ReportCardSkeleton,
  ReportDetailsPanel,
  useManagerDashboard,
  type ReportSummary,
  TeamOverviewBar,
} from "../features/manager";
import { useDeferredLoading } from "../features/manager/hooks/useDeferredLoading";

export function ManagerDashboardPage() {
  // Fallback: usar hook legado de reports para compor caso endpoint agregado ainda não exista.
  const legacy = useMyReports();
  const {
    data,
    loading: loadingSummary,
    error: summaryError,
  } = useManagerDashboard();
  const showSkeletonList = useDeferredLoading(loadingSummary && !data, {
    delay: 100,
    minVisible: 300,
  });

  // Derivar lista de reports: se summary não disponível, usar legacy.
  const reports: ReportSummary[] =
    data?.reports ||
    (legacy.reports || []).map((r) => ({
      userId: r.id,
      name: r.name,
      email: r.email,
      pdi: { exists: false, progress: 0 },
      prs: { open: 0, merged: 0, closed: 0 },
    }));

  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const active = useMemo(
    () => reports.find((r) => r.userId === activeUserId) || null,
    [reports, activeUserId]
  );

  const [detailsTab, setDetailsTab] = useState("prs"); // 'prs' | 'pdi'

  // PR + PDI fetches (individual) quando há usuário selecionado.
  // const { loading: prsLoading } = useRemotePrs(
  //   { ownerUserId: active?.userId },
  //   { skip: !active?.userId }
  // );

  return (
    <div className="flex flex-col h-full min-h-0">
      <TeamOverviewBar
        data={data || undefined}
        loading={loadingSummary && !data}
      />
      {summaryError && (
        <div className="mx-4 mb-2 -mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
          {summaryError}
        </div>
      )}
      {!loadingSummary && reports.length === 0 && (
        <div className="p-10 text-sm text-surface-600">
          Você ainda não gerencia ninguém.
        </div>
      )}
      <div className="flex-1 overflow-auto px-4 pb-8">
        <div
          className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300"
          style={{ opacity: showSkeletonList ? 0.55 : 1 }}
        >
          {showSkeletonList
            ? Array.from({ length: 4 }).map((_, i) => (
                <ReportCardSkeleton key={i} />
              ))
            : reports.map((r) => (
                <ReportCard
                  key={r.userId}
                  report={r}
                  active={r.userId === activeUserId}
                  onSelect={(id) => {
                    setActiveUserId(id === activeUserId ? null : id);
                    setTimeout(() => {
                      const el = document.getElementById(
                        "manager-report-details-panel"
                      );
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }, 10);
                  }}
                />
              ))}
        </div>
        {active && <div className="h-4" />} {/* Espaço antes do painel */}
        <div id="manager-report-details-panel">
          <ReportDetailsPanel
            report={active}
            onClose={() => setActiveUserId(null)}
            tab={detailsTab}
            onTabChange={setDetailsTab}
          />
        </div>
      </div>
    </div>
  );
}
