import { Users } from "lucide-react";
import { TeamCard } from "./TeamCard";
import type { TeamSummary } from "@/features/admin/types/team";

interface TeamsListProps {
  teams: TeamSummary[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterBy: string;
  onEdit: (team: TeamSummary) => void;
  onDelete: (teamId: string) => void;
  onRefresh: () => void;
}

export function TeamsList({
  teams,
  loading,
  error,
  searchQuery,
  filterBy,
  onEdit,
  onDelete,
  onRefresh,
}: TeamsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Carregando equipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Erro ao carregar equipes: {error}</p>
        <button
          onClick={onRefresh}
          className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">
          Nenhuma equipe encontrada
        </p>
        <p className="text-sm text-gray-500">
          {searchQuery || filterBy !== "all"
            ? "Tente ajustar os filtros de busca"
            : "Comece criando sua primeira equipe"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onEdit={() => onEdit(team)}
          onDelete={() => onDelete(team.id)}
        />
      ))}
    </div>
  );
}
