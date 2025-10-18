import { useState } from "react";
import { useTeamManagement } from "@/features/admin/hooks/useTeamManagement";
import type { TeamSummary } from "@/features/admin/types/team";
import type { ViewMode, FilterType } from "./types";
import { TeamsHeader } from "./TeamsHeader";
import { TeamsList } from "./TeamsList";
import { TeamEditView } from "./TeamEditView";
import { TeamCreateView } from "./TeamCreateView";

export function TeamsManagement() {
  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Hooks para dados
  const {
    teams,
    loading,
    error,
    deleteTeam,
    refresh,
    selectedTeam,
    selectTeam,
  } = useTeamManagement();

  // Filtrar equipes
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "with-manager" && team.managers > 0) ||
      (filterBy === "without-manager" && team.managers === 0);

    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleEditTeam = async (team: TeamSummary) => {
    await selectTeam(team.id);
    setViewMode("edit");
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      refresh();
    } catch (error) {
      console.error("Erro ao excluir equipe:", error);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    selectTeam(null);
  };

  const handleCreateTeam = () => {
    setViewMode("create");
  };

  // Se estiver no modo de edição, mostrar a tela de edição
  if (viewMode === "edit" && selectedTeam) {
    return <TeamEditView team={selectedTeam} onBack={handleBackToList} />;
  }

  // Se estiver no modo de criação, mostrar a tela de criação
  if (viewMode === "create") {
    return <TeamCreateView onBack={handleBackToList} onCreated={refresh} />;
  }

  // Vista principal da lista de equipes
  return (
    <div className="space-y-6">
      <TeamsHeader
        searchQuery={searchQuery}
        filterBy={filterBy}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterBy}
        onCreateTeam={handleCreateTeam}
      />

      <TeamsList
        teams={filteredTeams}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        filterBy={filterBy}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeam}
        onRefresh={refresh}
      />
    </div>
  );
}
