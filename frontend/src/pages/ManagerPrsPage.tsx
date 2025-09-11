import { MyPrsPage } from "./MyPrsPage";
import { useMyReports } from "../hooks/useMyReports";
import { useMemo, useState } from "react";

// MVP: usa o primeiro subordinado; futuras versões vão escolher por select/url param
export function ManagerPrsPage() {
  const { reports, loading, error } = useMyReports();
  const first = useMemo(() => reports[0], [reports]);
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);
  const current = useMemo(
    () => reports.find((r) => r.id === currentId) || first,
    [reports, currentId, first]
  );
  return (
    <div>
      <div className="bg-indigo-600/10 border-b border-indigo-700/30 px-6 py-3">
        <h2 className="text-sm text-indigo-300 flex items-center gap-3">
          {loading && "Carregando subordinados..."}
          {!loading && current && (
            <>
              Visualizando PRs de:{" "}
              <span className="font-semibold text-indigo-200">
                {current.name}
              </span>
            </>
          )}
          {!loading && !first && (
            <span className="text-indigo-200">
              Você ainda não gerencia ninguém
            </span>
          )}
          {!loading && reports.length > 1 && (
            <select
              className="ml-auto text-xs bg-white/80 border border-indigo-200 rounded px-2 py-1 text-indigo-900"
              value={current?.id ?? ""}
              onChange={(e) => setCurrentId(Number(e.target.value))}
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
        </h2>
      </div>
      {error && (
        <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200">
          {error}
        </div>
      )}
      {!loading && current && (
        <MyPrsPage initialFilters={{ ownerUserId: current.id }} />
      )}
    </div>
  );
}
