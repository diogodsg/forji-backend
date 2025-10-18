import { useState, useCallback } from "react";
import { teamsApi, extractErrorMessage } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type {
  Team,
  TeamMember,
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  ListTeamsParams,
} from "@/lib/api";

/**
 * Hook para gerenciar teams
 *
 * Funções disponíveis:
 * - fetchTeams() - Lista teams do workspace
 * - searchTeams() - Busca teams por nome
 * - createTeam() - Cria novo team
 * - fetchTeam() - Detalhes de um team
 * - updateTeam() - Atualiza team
 * - removeTeam() - Remove team (soft delete)
 * - fetchMembers() - Lista membros do team
 * - addMember() - Adiciona membro ao team
 * - updateMemberRole() - Atualiza role do membro
 * - removeMember() - Remove membro do team
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * Lista todos teams do workspace
   */
  const fetchTeams = useCallback(
    async (params: ListTeamsParams = {}) => {
      setLoading(true);
      try {
        const data = await teamsApi.findAll(params);
        setTeams(data);
        return data;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar times");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Busca teams por nome
   */
  const searchTeams = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setTeams([]);
        return [];
      }

      setLoading(true);
      try {
        const results = await teamsApi.search(query);
        setTeams(results);
        return results;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro na busca");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Cria novo team
   */
  const createTeam = useCallback(
    async (dto: CreateTeamDto) => {
      setLoading(true);
      try {
        const newTeam = await teamsApi.create(dto);
        setTeams((prev) => [newTeam, ...prev]);
        toast.success(
          `Time "${newTeam.name}" criado com sucesso!`,
          "Time criado"
        );
        return newTeam;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao criar time");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Obtém detalhes de um team
   */
  const fetchTeam = useCallback(
    async (teamId: string, includeMembers: boolean = false) => {
      setLoading(true);
      try {
        const team = await teamsApi.findOne(teamId, includeMembers);
        setCurrentTeam(team);
        if (includeMembers && team.members) {
          setMembers(team.members);
        }
        return team;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar time");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Atualiza team
   */
  const updateTeam = useCallback(
    async (teamId: string, dto: UpdateTeamDto) => {
      setLoading(true);
      try {
        const updated = await teamsApi.update(teamId, dto);
        setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)));
        if (currentTeam?.id === teamId) {
          setCurrentTeam(updated);
        }
        toast.success("Time atualizado com sucesso!");
        return updated;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao atualizar time");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentTeam?.id, toast]
  );

  /**
   * Remove team (soft delete)
   */
  const removeTeam = useCallback(
    async (teamId: string) => {
      setLoading(true);
      try {
        await teamsApi.remove(teamId);
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
        if (currentTeam?.id === teamId) {
          setCurrentTeam(null);
        }
        toast.success("Time removido com sucesso");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao remover time");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentTeam?.id, toast]
  );

  /**
   * Lista membros do team
   */
  const fetchMembers = useCallback(
    async (teamId: string) => {
      setLoading(true);
      try {
        const data = await teamsApi.getMembers(teamId);
        setMembers(data);
        return data;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar membros");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Adiciona membro ao team
   */
  const addMember = useCallback(
    async (teamId: string, dto: AddMemberDto) => {
      setLoading(true);
      try {
        const newMember = await teamsApi.addMember(teamId, dto);
        setMembers((prev) => [...prev, newMember]);
        toast.success(
          `${newMember.user.name} adicionado ao time`,
          "Membro adicionado"
        );
        return newMember;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao adicionar membro");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Atualiza role do membro (LEADER/MEMBER)
   */
  const updateMemberRole = useCallback(
    async (teamId: string, userId: string, dto: UpdateMemberRoleDto) => {
      setLoading(true);
      try {
        const updated = await teamsApi.updateMemberRole(teamId, userId, dto);
        setMembers((prev) =>
          prev.map((m) => (m.userId === userId ? updated : m))
        );
        toast.success("Papel do membro atualizado");
        return updated;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao atualizar papel");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Remove membro do team
   */
  const removeMember = useCallback(
    async (teamId: string, userId: string) => {
      setLoading(true);
      try {
        await teamsApi.removeMember(teamId, userId);
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
        toast.success("Membro removido do time");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao remover membro");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Limpa a busca
   */
  const clearSearch = useCallback(() => {
    setTeams([]);
  }, []);

  return {
    // Estado
    teams,
    currentTeam,
    members,
    loading,

    // Ações - Teams
    fetchTeams,
    searchTeams,
    createTeam,
    fetchTeam,
    updateTeam,
    removeTeam,
    clearSearch,

    // Ações - Membros
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
