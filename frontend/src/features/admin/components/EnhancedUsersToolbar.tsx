import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  roleFilter: "all" | "admin" | "user";
  setRoleFilter: (v: "all" | "admin" | "user") => void;
  githubFilter: "all" | "with" | "without";
  setGithubFilter: (v: "all" | "with" | "without") => void;
  onNew: () => void;
  totalUsers: number;
  filteredCount: number;
}

export function EnhancedUsersToolbar({
  query,
  setQuery,
  roleFilter,
  setRoleFilter,
  githubFilter,
  setGithubFilter,
  onNew,
  totalUsers,
  filteredCount,
}: Props) {
  const hasFilters =
    roleFilter !== "all" || githubFilter !== "all" || query.trim() !== "";

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
        <button
          onClick={onNew}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Novo usuário
        </button>
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 bg-white/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-lg border border-surface-300 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all"
          >
            <option value="all">Todos os papéis</option>
            <option value="admin">Apenas admins</option>
            <option value="user">Apenas usuários</option>
          </select>

          {/* GitHub Filter */}
          <select
            value={githubFilter}
            onChange={(e) => setGithubFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-lg border border-surface-300 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all"
          >
            <option value="all">GitHub: Todos</option>
            <option value="with">Com GitHub</option>
            <option value="without">Sem GitHub</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Filtros ativos:</span>
          {query && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">
              Busca: "{query}"
            </span>
          )}
          {roleFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
              {roleFilter === "admin" ? "Apenas admins" : "Apenas usuários"}
            </span>
          )}
          {githubFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
              {githubFilter === "with" ? "Com GitHub" : "Sem GitHub"}
            </span>
          )}
          <button
            onClick={() => {
              setQuery("");
              setRoleFilter("all");
              setGithubFilter("all");
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
