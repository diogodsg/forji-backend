// Sidebar de seleção de subordinados

export interface ReportUser {
  id: number;
  name: string;
  email: string;
}

interface ReportsSidebarProps {
  reports: ReportUser[];
  loading: boolean;
  currentId: number | undefined;
  onSelect: (id: number) => void;
}

export function ReportsSidebar({
  reports,
  loading,
  currentId,
  onSelect,
}: ReportsSidebarProps) {
  return (
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
        {reports.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onSelect(r.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors border ${
                currentId === r.id
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
  );
}
