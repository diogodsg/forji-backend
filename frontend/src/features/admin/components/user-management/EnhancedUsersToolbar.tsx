import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  roleFilter: "all" | "admin" | "user";
  setRoleFilter: (v: "all" | "admin" | "user") => void;
  onNew?: () => void; // Tornando opcional para remover duplicação
  totalUsers: number;
  filteredCount: number;
}

export function EnhancedUsersToolbar({
  query,
  setQuery,
  roleFilter,
  setRoleFilter,
  onNew,
  totalUsers,
  filteredCount,
}: Props) {
  const hasFilters = roleFilter !== "all" || query.trim() !== "";

  return (
    <div className="space-y-4 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Usuários</h2>
          <p className="text-sm text-gray-600">
            {hasFilters && filteredCount !== totalUsers
              ? `${filteredCount} de ${totalUsers} usuários`
              : `${totalUsers} usuários`}
          </p>
        </div>
        {onNew && (
          <button
            onClick={onNew}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 via-sky-500 to-brand-400 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 shadow-sm transition-opacity"
          >
            <FiPlus className="w-4 h-4" />
            Novo usuário
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiFilter className="w-4 h-4 text-violet-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="pl-10 pr-4 py-2 rounded-lg border border-surface-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all appearance-none cursor-pointer shadow-sm hover:border-violet-400 min-w-[250px]"
            >
              <option value="all">Todos os papéis</option>
              <option value="admin">Apenas admins</option>
              <option value="user">Apenas usuários</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Filtros ativos:</span>
          {query && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-100 text-brand-700 rounded-md">
              Busca: "{query}"
            </span>
          )}
          {roleFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
              {roleFilter === "admin" ? "Apenas admins" : "Apenas usuários"}
            </span>
          )}
          <button
            onClick={() => {
              setQuery("");
              setRoleFilter("all");
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
