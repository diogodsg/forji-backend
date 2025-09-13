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
import { MyPrsPage } from "./MyPrsPage";
import { useRemotePdiForUser } from "../features/pdi/hooks/useRemotePdiForUser";
import { useRemotePrs, usePrCounts } from "@/features/prs";
import {
  ReportsSidebar,
  ManagerHeader,
  ManagerPdiPanel,
} from "../features/manager";

export function ManagerDashboardPage() {
  const { reports, loading, error } = useMyReports();
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);
  // Derive currently selected report user; memoized to avoid unnecessary downstream re-renders.
  const current = useMemo(
    () => reports.find((r) => r.id === currentId),
    [reports, currentId]
  );

  const [tab, setTab] = useState<"prs" | "pdi">("prs");
  const {
    plan,
    loading: pdiLoading,
    error: pdiError,
    upsert: upsertPdi,
  } = useRemotePdiForUser(current?.id);

  // Fetch a small PR sample for header chips
  const { prs: prList, loading: prsLoading } = useRemotePrs(
    { ownerUserId: current?.id },
    { skip: !current?.id } // Avoid fetch until a report is selected.
  );
  const {
    open: prOpen,
    merged: prMerged,
    closed: prClosed,
  } = usePrCounts(prList);

  const filteredReports = reports; // FUTURE: apply server / role filtering if necessary.

  return (
    <div className="flex h-full min-h-0">
      <ReportsSidebar
        reports={filteredReports as any}
        loading={loading}
        currentId={currentId}
        onSelect={setCurrentId}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <ManagerHeader
          currentName={current?.name}
          currentEmail={current?.email}
          prOpen={prOpen}
          prMerged={prMerged}
          prClosed={prClosed}
          loadingPrs={prsLoading}
          tab={tab}
          onTabChange={setTab}
        />
        {error && (
          <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-auto min-h-0">
          {!loading && currentId === undefined && reports.length > 0 && (
            <div className="p-10 text-sm text-gray-600">
              Escolha um subordinado na coluna lateral para visualizar PRs ou
              PDI.
            </div>
          )}
          {!loading && current && (
            <div>
              {tab === "prs" && (
                <MyPrsPage initialFilters={{ ownerUserId: current.id }} />
              )}
              {tab === "pdi" && (
                <ManagerPdiPanel
                  loading={pdiLoading}
                  error={pdiError}
                  plan={plan}
                  currentUserId={current.id}
                  onCreate={() =>
                    upsertPdi({
                      userId: String(current.id),
                      competencies: [],
                      milestones: [],
                      krs: [],
                      records: [],
                    })
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
