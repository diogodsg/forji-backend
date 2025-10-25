import { useCallback, useEffect, useState, useMemo } from "react";
import {
  teamsApi,
  type Team,
  type CreateTeamDto,
  type UpdateTeamDto,
  type TeamMemberRole,
} from "@/lib/api/endpoints/teams";
import { useToast } from "@/components/Toast";
import { extractErrorMessage } from "@/lib/api";

// Adapter: Converte Team da API para formato usado no admin
interface TeamSummary {
  id: string;
  name: string;
  description?: string;
  managers: number;
  members: number;
  leaderName?: string | null;
  createdAt?: string;
}

interface TeamDetail {
  id: string;
  name: string;
  description?: string;
  memberships: Array<{
    user: { id: string; name: string; email: string; avatarId?: string };
    role: TeamMemberRole;
  }>;
}

interface TeamMetrics {
  totalTeams: number;
  activeTeams: number;
  totalMembers: number;
  avgMembersPerTeam: number;
}

interface UseAdminTeamsResult {
  teams: TeamSummary[];
  loading: boolean;
  error: string | null;
  metrics: TeamMetrics | null;
  selectedTeam: TeamDetail | null;
  selecting: boolean;
  creating: boolean;
  refreshingTeam: boolean;
  create: (input: { name: string; description?: string }) => Promise<void>;
  refresh: () => Promise<void>;
  selectTeam: (id: string | null) => Promise<void>;
  updateTeam: (id: string, data: Partial<UpdateTeamDto>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addMember: (
    teamId: string,
    userId: string,
    role: TeamMemberRole
  ) => Promise<void>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
  updateMemberRole: (
    teamId: string,
    userId: string,
    role: TeamMemberRole
  ) => Promise<void>;
  setSearch: (search: string) => void;
  setRoleFilter: (role: "MEMBER" | "LEADER" | "ALL") => void;
  setTeamFilter: (teamId: string | null) => void;
  search: string;
  roleFilter: "MEMBER" | "LEADER" | "ALL";
  teamFilter: string | null;
  filteredTeams: TeamSummary[];
}

/**
 * Hook para gerenciar teams via API REST
 * Migrado de mock data para backend real
 */
export function useAdminTeams(): UseAdminTeamsResult {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [creating, setCreating] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [refreshingTeam, setRefreshingTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"MEMBER" | "LEADER" | "ALL">(
    "ALL"
  );
  const [teamFilter, setTeamFilter] = useState<string | null>(null);

  /**
   * Converte Team da API para TeamSummary
   */
  const toTeamSummary = (team: Team): TeamSummary => {
    // Backend retorna: { memberCount, managers, members, leaderName }
    // members = total count
    // managers = count of managers
    // leaderName = name of the manager
    const teamAny = team as any;

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      managers: teamAny.managers || 0,
      members: teamAny.members || teamAny.memberCount || 0,
      leaderName: teamAny.leaderName || null,
      createdAt: team.createdAt,
    };
  };

  /**
   * Converte Team com members para TeamDetail
   */
  const toTeamDetail = (team: Team): TeamDetail => ({
    id: team.id,
    name: team.name,
    description: team.description,
    memberships: (team.members || []).map((m) => ({
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        avatarId: m.user.avatarId,
      },
      role: m.role,
    })),
  });

  /**
   * Calcula métricas dos teams
   */
  const calculateMetrics = (teamsList: Team[]): TeamMetrics => {
    const activeTeams = teamsList.filter((t) => t.status === "ACTIVE");
    const totalMembers = teamsList.reduce(
      (sum, t) => sum + (t.memberCount || 0),
      0
    );

    return {
      totalTeams: teamsList.length,
      activeTeams: activeTeams.length,
      totalMembers,
      avgMembersPerTeam:
        teamsList.length > 0 ? totalMembers / teamsList.length : 0,
    };
  };

  /**
   * Carrega lista de teams
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const teamsList = await teamsApi.findAll({ includeMemberCount: true });
      setTeams(teamsList.map(toTeamSummary));
      setMetrics(calculateMetrics(teamsList));
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      toast.error(message, "Erro ao carregar teams");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Toast é estável, não precisa estar nas dependências

  useEffect(() => {
    refresh(); // Carregamento inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Só carrega uma vez no mount

  /**
   * Seleciona team e carrega detalhes com membros
   */
  const selectTeam = useCallback(
    async (id: string | null) => {
      if (id === null) {
        setSelectedTeam(null);
        return;
      }
      setSelecting(true);
      try {
        const team = await teamsApi.findOne(id, true);
        setSelectedTeam(toTeamDetail(team));
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao carregar equipe");
      } finally {
        setSelecting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Cria novo team
   */
  const create = useCallback(
    async (input: { name: string; description?: string }) => {
      setCreating(true);
      try {
        const newTeam = await teamsApi.create({
          name: input.name,
          description: input.description,
          // Backend define status como ACTIVE por padrão
        });

        // Atualização otimista
        setTeams((prev) => [...prev, toTeamSummary(newTeam)]);

        toast.success(
          `Equipe "${newTeam.name}" criada com sucesso!`,
          "Team criado"
        );

        // Recarregar lista completa em background para garantir consistência
        await refresh();
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao criar team");
        throw err;
      } finally {
        setCreating(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh]
  );

  /**
   * Atualiza team
   */
  const updateTeam = useCallback(
    async (id: string, data: Partial<UpdateTeamDto>) => {
      setRefreshingTeam(true);
      try {
        const updated = await teamsApi.update(id, data);

        setTeams((prev) =>
          prev.map((t) => (t.id === id ? toTeamSummary(updated) : t))
        );

        if (selectedTeam?.id === id) {
          const fullTeam = await teamsApi.findOne(id, true);
          setSelectedTeam(toTeamDetail(fullTeam));
        }

        toast.success("Equipe atualizada com sucesso!", "Team atualizado");
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao atualizar team");
        throw err;
      } finally {
        setRefreshingTeam(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTeam]
  );

  /**
   * Remove team
   */
  const deleteTeam = useCallback(
    async (id: string) => {
      try {
        await teamsApi.remove(id);

        // Atualização otimista
        setTeams((prev) => prev.filter((t) => t.id !== id));
        if (selectedTeam?.id === id) {
          setSelectedTeam(null);
        }

        toast.success("Equipe removida com sucesso!", "Team removido");

        // Recarregar em background
        await refresh();
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao remover team");
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTeam, refresh]
  );

  /**
   * Adiciona membro ao team
   */
  const addMember = useCallback(
    async (teamId: string, userId: string, role: TeamMemberRole) => {
      try {
        await teamsApi.addMember(teamId, { userId, role });

        // Atualiza contador na lista
        setTeams((prev) =>
          prev.map((t) =>
            t.id === teamId ? { ...t, members: t.members + 1 } : t
          )
        );

        // Recarrega detalhes do team selecionado
        if (selectedTeam?.id === teamId) {
          const updated = await teamsApi.findOne(teamId, true);
          setSelectedTeam(toTeamDetail(updated));
        }

        toast.success("Membro adicionado com sucesso!");
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao adicionar membro");
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTeam]
  );

  /**
   * Remove membro do team
   */
  const removeMember = useCallback(
    async (teamId: string, userId: string) => {
      try {
        await teamsApi.removeMember(teamId, userId);

        // Atualiza contador na lista
        setTeams((prev) =>
          prev.map((t) =>
            t.id === teamId ? { ...t, members: Math.max(0, t.members - 1) } : t
          )
        );

        // Recarrega detalhes do team selecionado
        if (selectedTeam?.id === teamId) {
          const updated = await teamsApi.findOne(teamId, true);
          setSelectedTeam(toTeamDetail(updated));
        }

        toast.success("Membro removido com sucesso!");
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao remover membro");
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTeam]
  );

  /**
   * Atualiza role de membro
   */
  const updateMemberRole = useCallback(
    async (teamId: string, userId: string, role: TeamMemberRole) => {
      try {
        await teamsApi.updateMemberRole(teamId, userId, { role });

        // Recarrega detalhes do team selecionado
        if (selectedTeam?.id === teamId) {
          const updated = await teamsApi.findOne(teamId, true);
          setSelectedTeam(toTeamDetail(updated));
        }

        toast.success("Role atualizada com sucesso!");
      } catch (err) {
        const message = extractErrorMessage(err);
        toast.error(message, "Erro ao atualizar role");
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTeam]
  );

  /**
   * Filtra teams baseado em busca e filtros
   */
  const filteredTeams = useMemo(() => {
    let result = teams;

    // Busca por nome
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Filtro por team específico
    if (teamFilter) {
      result = result.filter((t) => t.id === teamFilter);
    }

    // Ordenação já vem do backend (por quantidade de membros)
    // Não reordenar aqui para manter a ordem do backend

    return result;
  }, [teams, search, teamFilter]);

  return {
    teams,
    loading,
    error,
    metrics,
    selectedTeam,
    selecting,
    creating,
    refreshingTeam,
    create,
    refresh,
    selectTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    updateMemberRole,
    setSearch,
    setRoleFilter,
    setTeamFilter,
    search,
    roleFilter,
    teamFilter,
    filteredTeams,
  };
}
