import { useMemo } from "react";
import { useAdminTeams } from "./useAdminTeams";
import type {
  TeamSummary as AdminTeamSummary,
  TeamDetail as AdminTeamDetail,
} from "../types/team";

/**
 * Adapter para compatibilidade com componentes antigos
 * Converte tipos novos (string IDs) para tipos antigos (number IDs)
 */
export function useTeamManagement() {
  const hook = useAdminTeams();

  // Adapter: mantém UUIDs como string
  const teams: AdminTeamSummary[] = useMemo(
    () =>
      hook.teams.map((t) => ({
        id: t.id, // UUID string mantido
        name: t.name,
        description: t.description,
        managers: 0, // Não temos essa info no novo modelo
        members: t.memberCount,
        createdAt: new Date().toISOString(),
      })),
    [hook.teams]
  );

  // Adapter: converte selectedTeam
  const selectedTeam: AdminTeamDetail | null = useMemo(
    () =>
      hook.selectedTeam
        ? {
            id: hook.selectedTeam.id, // UUID string mantido
            name: hook.selectedTeam.name,
            description: hook.selectedTeam.description,
            memberships: hook.selectedTeam.members.map((m) => ({
              user: {
                id: m.userId, // UUID string mantido
                name: m.name,
                email: m.email,
              },
              role: m.role === "LEADER" ? "MANAGER" : "MEMBER",
            })),
          }
        : null,
    [hook.selectedTeam]
  );

  // Adapter: converte filteredTeams (mantém UUIDs)
  const filteredTeams: AdminTeamSummary[] = useMemo(
    () =>
      hook.filteredTeams.map((t) => ({
        id: t.id, // UUID string mantido
        name: t.name,
        description: t.description,
        managers: 0,
        members: t.memberCount,
        createdAt: new Date().toISOString(),
      })),
    [hook.filteredTeams]
  );

  // Wrappers agora recebem string UUIDs diretamente
  const selectTeam = async (id: string | null) => {
    await hook.selectTeam(id);
  };

  const deleteTeam = async (id: string) => {
    await hook.deleteTeam(id);
  };

  const updateTeam = async (id: string, data: any) => {
    await hook.updateTeam(id, data);
  };

  const addMember = async (
    teamId: string,
    userId: string,
    role: "MEMBER" | "MANAGER"
  ) => {
    await hook.addMember(
      teamId,
      userId,
      role === "MANAGER" ? "LEADER" : "MEMBER"
    );
  };

  const removeMember = async (teamId: string, userId: string) => {
    await hook.removeMember(teamId, userId);
  };

  const updateMemberRole = async (
    teamId: string,
    userId: string,
    role: "MEMBER" | "MANAGER"
  ) => {
    await hook.updateMemberRole(
      teamId,
      userId,
      role === "MANAGER" ? "LEADER" : "MEMBER"
    );
  };

  return {
    teams,
    loading: hook.loading,
    error: hook.error,
    metrics: hook.metrics,
    selectedTeam,
    selecting: hook.selecting,
    creating: hook.creating,
    refreshingTeam: hook.refreshingTeam,
    create: hook.create,
    refresh: hook.refresh,
    selectTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    updateMemberRole,
    setSearch: hook.setSearch,
    setRoleFilter: (role: "MEMBER" | "MANAGER" | "ALL") => {
      hook.setRoleFilter(
        role === "MANAGER" ? "LEADER" : role === "MEMBER" ? "MEMBER" : "ALL"
      );
    },
    setTeamFilter: (id: string | null) => hook.setTeamFilter(id),
    search: hook.search,
    roleFilter: hook.roleFilter === "LEADER" ? "MANAGER" : hook.roleFilter,
    teamFilter: hook.teamFilter, // UUID string ou null
    filteredTeams, // Usa o memo calculado acima
  };
}
