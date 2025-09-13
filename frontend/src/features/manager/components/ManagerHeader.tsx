// Cabeçalho do dashboard do gestor

interface ManagerHeaderProps {
  currentName?: string;
  currentEmail?: string;
  prOpen?: number | string;
  prMerged?: number | string;
  prClosed?: number | string;
  loadingPrs: boolean;
  tab: "prs" | "pdi";
  onTabChange: (tab: "prs" | "pdi") => void;
}

export function ManagerHeader({
  currentName,
  currentEmail,
  prOpen,
  prMerged,
  prClosed,
  loadingPrs,
  tab,
  onTabChange,
}: ManagerHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600/10 to-sky-500/10 border-b border-surface-300 px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-indigo-800 truncate">
            {currentName || "Manager"}
          </h1>
          <p className="text-[11px] text-gray-500 truncate">
            {currentEmail || "Selecione um subordinado para visualizar"}
          </p>
        </div>
        {currentName && (
          <div className="hidden sm:flex items-center gap-2">
            <Chip label="Abertos" value={loadingPrs ? "-" : prOpen ?? "-"} />
            <Chip
              label="Mesclados"
              value={loadingPrs ? "-" : prMerged ?? "-"}
            />
            <Chip label="Fechados" value={loadingPrs ? "-" : prClosed ?? "-"} />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <TabButton active={tab === "prs"} onClick={() => onTabChange("prs")}>
          PRs
        </TabButton>
        <TabButton active={tab === "pdi"} onClick={() => onTabChange("pdi")}>
          PDI
        </TabButton>
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
