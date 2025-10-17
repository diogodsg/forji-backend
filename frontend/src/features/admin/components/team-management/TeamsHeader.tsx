import { Users, Plus, Search } from "lucide-react";
import type { FilterType } from "./types";

interface TeamsHeaderProps {
  searchQuery: string;
  filterBy: FilterType;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onCreateTeam: () => void;
}

export function TeamsHeader({
  searchQuery,
  filterBy,
  onSearchChange,
  onFilterChange,
  onCreateTeam,
}: TeamsHeaderProps) {
  return (
    <>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-white to-surface-50 rounded-2xl border border-surface-300 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
                Gestão de Equipes
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                Gerencie times, líderes e membros da organização
              </p>
            </div>
          </div>

          <button
            onClick={onCreateTeam}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            Nova Equipe
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-gradient-to-br from-white to-surface-50 p-5 rounded-xl border border-surface-300 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar equipes por nome ou descrição..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm bg-white"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => onFilterChange(e.target.value as FilterType)}
              className="px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm bg-white font-medium min-w-[180px]"
            >
              <option value="all">Todas as equipes</option>
              <option value="with-manager">Com líder</option>
              <option value="without-manager">Sem líder</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
