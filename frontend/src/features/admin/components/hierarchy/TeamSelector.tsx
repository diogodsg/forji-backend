import { Search, Users } from "lucide-react";
import type { Team } from "./types";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamIds: number[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleTeam: (teamId: number) => void;
}

export function TeamSelector({
  teams,
  selectedTeamIds,
  searchValue,
  onSearchChange,
  onToggleTeam,
}: TeamSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecionar Equipes
      </label>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar equipes..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
        />
      </div>
      <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-gray-50">
        {teams.map((team) => (
          <label
            key={team.id}
            className="flex items-center gap-3 p-4 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedTeamIds.includes(team.id)}
              onChange={() => onToggleTeam(team.id)}
              className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
            />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{team.name}</div>
                <div className="text-sm text-gray-500">
                  {team.description || "Equipe organizacional"}
                </div>
              </div>
            </div>
          </label>
        ))}
        {teams.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma equipe encontrada
          </div>
        )}
      </div>
    </div>
  );
}
