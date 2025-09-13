import { useMemo, useState } from "react";
import { useMyReports } from "../hooks/useMyReports";
import { MyPrsPage } from "./MyPrsPage";
import { useRemotePdiForUser } from "../hooks/useRemotePdiForUser";
// PDI view is embedded within EditablePdiView when plan exists
import { EditablePdiView } from "../components/EditablePdiView";
import { useRemotePrs } from "../hooks/useRemotePrs";

export function ManagerDashboardPage() {
  const { reports, loading, error } = useMyReports();
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);
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
  const { all: prList, loading: prsLoading } = useRemotePrs(
    { ownerUserId: current?.id as number },
    { skip: !current?.id }
  );
  const prOpen = useMemo(
    () => prList.filter((p) => p.state === "open").length,
    [prList]
  );
  const prMerged = useMemo(
    () => prList.filter((p) => p.state === "merged").length,
    [prList]
  );
  const prClosed = useMemo(
    () => prList.filter((p) => p.state === "closed").length,
    [prList]
  );

  const filteredReports = reports; // TODO: se id do manager disponível, filtrar aqui.

  return (
    <div className="flex h-full min-h-0">
      {/* Left column: report selector */}
      <aside className="hidden lg:block w-64 border-r border-surface-300/70 bg-white/70 p-4 space-y-3">
        <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 px-1">
          Subordinados
        </div>
        {loading && (
          <div className="text-xs text-gray-500 px-1">Carregando...</div>
        )}
        {!loading && reports.length === 0 && (
          <div className="text-xs text-gray-500 px-1">
            Você ainda não gerencia ninguém.
          </div>
        )}
        <ul className="space-y-1">
          {filteredReports.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => setCurrentId(r.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors border ${
                  current?.id === r.id
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-white hover:bg-surface-100 text-gray-700 border-surface-300"
                }`}
              >
                <span className="block font-medium truncate">{r.name}</span>
                <span className="block text-[11px] text-gray-500 truncate">
                  {r.email}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {reports.length > 0 && currentId === undefined && (
          <div className="mt-3 text-[11px] text-amber-600 font-medium">
            Selecione um subordinado para habilitar PRs / PDI.
          </div>
        )}
      </aside>

      {/* Right column: header + content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-gradient-to-r from-indigo-600/10 to-sky-500/10 border-b border-surface-300 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-indigo-800 truncate">
                {current ? current.name : "Manager"}
              </h1>
              <p className="text-[11px] text-gray-500 truncate">
                {current?.email || "Selecione um subordinado para visualizar"}
              </p>
            </div>
            {current && (
              <div className="hidden sm:flex items-center gap-2">
                <Chip label="Abertos" value={prsLoading ? "-" : prOpen} />
                <Chip label="Merged" value={prsLoading ? "-" : prMerged} />
                <Chip label="Fechados" value={prsLoading ? "-" : prClosed} />
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <TabButton active={tab === "prs"} onClick={() => setTab("prs")}>
              PRs
            </TabButton>
            <TabButton active={tab === "pdi"} onClick={() => setTab("pdi")}>
              PDI
            </TabButton>
          </div>
        </div>

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
                <div className="p-5">
                  {pdiLoading && (
                    <div className="text-sm text-gray-500">
                      Carregando PDI...
                    </div>
                  )}
                  {pdiError && (
                    <div className="text-sm text-red-600">
                      Erro ao carregar: {pdiError}
                    </div>
                  )}
                  {!pdiLoading && !plan && current?.id && (
                    <div className="text-sm text-gray-700 space-y-3">
                      <div>Nenhum PDI criado para esta pessoa ainda.</div>
                      <button
                        className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-500 disabled:opacity-50"
                        disabled={!currentId}
                        onClick={() =>
                          upsertPdi({
                            userId: String(current.id),
                            competencies: [],
                            milestones: [],
                            krs: [],
                            records: [],
                          })
                        }
                      >
                        Criar PDI
                      </button>
                    </div>
                  )}
                  {plan && current?.id && (
                    <EditablePdiView
                      key={current.id}
                      initialPlan={plan}
                      saveForUserId={Number(current.id)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({
  label,
  value,
}: {
  label: string | number;
  value: string | number;
}) {
  return (
    <div className="px-2 py-1 rounded-md bg-white/80 border border-surface-300 text-[11px] text-gray-700">
      <span className="font-semibold text-indigo-700 mr-1">{value}</span>
      {label}
    </div>
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
      className={`px-2.5 py-1 rounded border ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-indigo-700 border-indigo-200"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
