import { useState, useCallback, useMemo } from "react";
import type { TeamSummary, TeamDetail, TeamMetrics } from "../types/team";
import {
  getMockTeams,
  getMockTeamById,
  getMockTeamMetrics,
} from "../data/mockData";

interface TeamFilters {
  search: string;
  role: "all" | "manager" | "member";
  team: number | "all";
}

export function useTeamManagement() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null);
  const [filters, setFilters] = useState<TeamFilters>({
    search: "",
    role: "all",
    team: "all",
  });

  // Carregar times
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const mockTeams = getMockTeams();
      const mockMetrics = getMockTeamMetrics();

      setTeams(mockTeams);
      setMetrics(mockMetrics);

      console.log("✅ Times carregados (mock):", mockTeams.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar times";
      setError(message);
      console.error("❌ Erro ao carregar times:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Selecionar time para visualização/edição
  const selectTeam = useCallback(async (teamId: number | null) => {
    if (teamId === null) {
      setSelectedTeam(null);
      return;
    }

    setLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const teamDetail = getMockTeamById(teamId);

      if (!teamDetail) {
        throw new Error("Time não encontrado");
      }

      setSelectedTeam(teamDetail);
      console.log("✅ Time selecionado:", teamDetail.name);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar time";
      setError(message);
      console.error("❌ Erro ao selecionar time:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar novo time
  const createTeam = useCallback(
    async (data: { name: string; description?: string }) => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 400));

      try {
        const newTeam: TeamSummary = {
          id: Math.max(...teams.map((t) => t.id), 0) + 1,
          name: data.name,
          description: data.description,
          managers: 0,
          members: 0,
        };

        setTeams((prev) => [...prev, newTeam]);

        // Atualizar métricas
        if (metrics) {
          setMetrics({
            ...metrics,
            totalTeams: metrics.totalTeams + 1,
          });
        }

        console.log("✅ Time criado (mock):", newTeam.name);
        return newTeam;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar time";
        setError(message);
        console.error("❌ Erro ao criar time:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [teams, metrics]
  );

  // Atualizar time
  const updateTeam = useCallback(
    async (teamId: number, data: { name: string; description?: string }) => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 400));

      try {
        setTeams((prev) =>
          prev.map((team) =>
            team.id === teamId
              ? { ...team, name: data.name, description: data.description }
              : team
          )
        );

        if (selectedTeam?.id === teamId) {
          setSelectedTeam((prev) =>
            prev
              ? { ...prev, name: data.name, description: data.description }
              : null
          );
        }

        console.log("✅ Time atualizado (mock):", data.name);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar time";
        setError(message);
        console.error("❌ Erro ao atualizar time:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedTeam]
  );

  // Deletar time
  const deleteTeam = useCallback(
    async (teamId: number) => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        setTeams((prev) => prev.filter((team) => team.id !== teamId));

        if (selectedTeam?.id === teamId) {
          setSelectedTeam(null);
        }

        // Atualizar métricas
        if (metrics) {
          setMetrics({
            ...metrics,
            totalTeams: metrics.totalTeams - 1,
          });
        }

        console.log("✅ Time deletado (mock):", teamId);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao deletar time";
        setError(message);
        console.error("❌ Erro ao deletar time:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedTeam, metrics]
  );

  // Adicionar membro ao time
  const addMember = useCallback(
    async (teamId: number, userId: number, role: "MEMBER" | "MANAGER") => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        // Atualizar contadores no time summary
        setTeams((prev) =>
          prev.map((team) => {
            if (team.id === teamId) {
              return {
                ...team,
                members: role === "MEMBER" ? team.members + 1 : team.members,
                managers:
                  role === "MANAGER" ? team.managers + 1 : team.managers,
              };
            }
            return team;
          })
        );

        // Atualizar time selecionado se for o mesmo
        if (selectedTeam?.id === teamId) {
          // Aqui você precisaria buscar o usuário do mockData
          // Por simplicidade, vamos apenas recarregar o time
          const updatedTeam = getMockTeamById(teamId);
          if (updatedTeam) {
            setSelectedTeam(updatedTeam);
          }
        }

        console.log("✅ Membro adicionado (mock):", userId, role);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao adicionar membro";
        setError(message);
        console.error("❌ Erro ao adicionar membro:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedTeam]
  );

  // Atualizar role do membro
  const updateMemberRole = useCallback(
    async (teamId: number, userId: number, newRole: "MEMBER" | "MANAGER") => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        // Atualizar contadores (assumindo que mudou de member para manager ou vice-versa)
        setTeams((prev) =>
          prev.map((team) => {
            if (team.id === teamId) {
              return {
                ...team,
                members:
                  newRole === "MEMBER" ? team.members + 1 : team.members - 1,
                managers:
                  newRole === "MANAGER" ? team.managers + 1 : team.managers - 1,
              };
            }
            return team;
          })
        );

        if (selectedTeam?.id === teamId) {
          const updatedTeam = getMockTeamById(teamId);
          if (updatedTeam) {
            setSelectedTeam(updatedTeam);
          }
        }

        console.log("✅ Role atualizada (mock):", userId, newRole);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar role";
        setError(message);
        console.error("❌ Erro ao atualizar role:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedTeam]
  );

  // Remover membro do time
  const removeMember = useCallback(
    async (teamId: number, userId: number) => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        // Precisaríamos saber o role do membro para atualizar os contadores corretamente
        // Por simplicidade, vamos recarregar o time
        if (selectedTeam?.id === teamId) {
          const updatedTeam = getMockTeamById(teamId);
          if (updatedTeam) {
            setSelectedTeam(updatedTeam);

            // Atualizar lista de times com novos contadores
            setTeams((prev) =>
              prev.map((team) => {
                if (team.id === teamId) {
                  return {
                    ...team,
                    members: updatedTeam.memberships.filter(
                      (m) => m.role === "MEMBER"
                    ).length,
                    managers: updatedTeam.memberships.filter(
                      (m) => m.role === "MANAGER"
                    ).length,
                  };
                }
                return team;
              })
            );
          }
        }

        console.log("✅ Membro removido (mock):", userId);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao remover membro";
        setError(message);
        console.error("❌ Erro ao remover membro:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedTeam]
  );

  // Times filtrados
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = team.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesTeam = filters.team === "all" || team.id === filters.team;

      // Filtro de role não se aplica à lista de times, apenas à lista de membros
      // Mas mantemos para compatibilidade

      return matchesSearch && matchesTeam;
    });
  }, [teams, filters]);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<TeamFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    teams,
    filteredTeams,
    loading,
    error,
    metrics,
    selectedTeam,
    filters,
    refresh,
    selectTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    updateMemberRole,
    removeMember,
    updateFilters,
  };
}
