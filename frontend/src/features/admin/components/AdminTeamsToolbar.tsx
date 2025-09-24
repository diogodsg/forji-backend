interface Props {
  search: string;
  onSearch: (v: string) => void;
  role: "ALL" | "MEMBER" | "MANAGER";
  onRole: (r: "ALL" | "MEMBER" | "MANAGER") => void;
  teamId: number | null;
  onTeam: (id: number | null) => void;
  teams: Array<{ id: number; name: string }>;
  onNew: () => void;
  hint?: string;
}

export function AdminTeamsToolbar({
  search,
  onSearch,
  role,
  onRole,
  teamId,
  onTeam,
  teams,
  onNew,
  hint,
}: Props) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold tracking-tight text-gray-800">
            Equipes
          </h2>
          {hint && (
            <span className="hidden md:inline text-[11px] text-gray-500">
              {hint}
            </span>
          )}
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
        >
          Nova equipe
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por nome / filtrar..."
            className="w-full rounded-md border border-surface-300 pl-3 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
          />
        </div>
        <div>
          <select
            value={role}
            onChange={(e) => onRole(e.target.value as any)}
            className="w-full rounded-md border border-surface-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option value="ALL">Todas funções</option>
            <option value="MANAGER">Com Managers</option>
            <option value="MEMBER">Com Membros</option>
          </select>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <select
              value={teamId ?? ""}
              onChange={(e) =>
                onTeam(e.target.value ? Number(e.target.value) : null)
              }
              className="flex-1 rounded-md border border-surface-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option value="">Todas as equipes</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {teamId != null && (
              <button
                onClick={() => onTeam(null)}
                className="shrink-0 text-[11px] text-gray-500 hover:text-gray-700 underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>
      {hint && (
        <div className="md:hidden text-[11px] text-gray-500">{hint}</div>
      )}
    </div>
  );
}
