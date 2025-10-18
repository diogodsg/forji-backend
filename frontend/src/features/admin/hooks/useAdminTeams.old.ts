import { useCallback, useEffect, useState, useMemo } from "react";
import { teamsApi, type Team, type CreateTeamDto, type UpdateTeamDto, type TeamMemberRole } from "@/lib/api/endpoints/teams";
import { useToast } from "@/components/Toast";

// Adapter: Converte Team da API para TeamSummary do admin
interface TeamSummary {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  status: "ACTIVE" | "ARCHIVED" | "INACTIVE";
}

// Adapter: Converte Team com members para TeamDetail
interface TeamDetail {
  id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | "INACTIVE";
  members: Array<{
    userId: string;
    name: string;
    email: string;
    role: TeamMemberRole;
    position?: string;
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
  const [roleFilter, setRoleFilter] = useState<"MEMBER" | "MANAGER" | "ALL">("ALL");
  const [teamFilter, setTeamFilter] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setTeams(getMockTeams());
      setMetrics(getMockTeamMetrics());
    } catch (e: any) {
      const message = e.message || "Falha ao carregar equipes";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectTeam = useCallback(
    async (id: number | null) => {
      if (id === null) {
        setSelectedTeam(null);
        return;
      }
      setSelecting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const team = getMockTeamById(id);
        setSelectedTeam(team);
      } catch (e: any) {
        const message = e.message || "Falha ao carregar equipe";
        toast.error(message);
      } finally {
        setSelecting(false);
      }
    },
    [toast]
  );

  const create = useCallback(
    async (input: CreateTeamInput) => {
      setCreating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const newTeam: TeamSummary = {
          id: Date.now(),
          name: input.name,
          description: input.description,
          managers: 0,
          members: 0,
        };
        setTeams((prev) => [...prev, newTeam]);
        toast.success(`Equipe "${input.name}" criada com sucesso!`);
      } catch (e: any) {
        const message = e.message || "Falha ao criar equipe";
        toast.error(message);
        throw e;
      } finally {
        setCreating(false);
      }
    },
    [toast]
  );

  const updateTeam = useCallback(
    async (id: number, data: Partial<CreateTeamInput>) => {
      setRefreshingTeam(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTeams((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, name: data.name || t.name, description: data.description } : t
          )
        );
        if (selectedTeam?.id === id) {
          setSelectedTeam((prev) =>
            prev ? { ...prev, name: data.name || prev.name, description: data.description } : null
          );
        }
        toast.success("Equipe atualizada com sucesso");
      } catch (e: any) {
        const message = e.message || "Falha ao atualizar equipe";
        toast.error(message);
        throw e;
      } finally {
        setRefreshingTeam(false);
      }
    },
    [selectedTeam, toast]
  );

  const deleteTeam = useCallback(
    async (id: number) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTeams((prev) => prev.filter((t) => t.id !== id));
        if (selectedTeam?.id === id) {
          setSelectedTeam(null);
        }
        toast.success("Equipe removida com sucesso");
      } catch (e: any) {
        const message = e.message || "Falha ao remover equipe";
        toast.error(message);
        throw e;
      }
    },
    [selectedTeam, toast]
  );

  const addMember = useCallback(
    async (teamId: number, _userId: number, role: "MEMBER" | "MANAGER") => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTeams((prev) =>
          prev.map((t) =>
            t.id === teamId
              ? {
                  ...t,
                  members: t.members + 1,
                  managers: role === "MANAGER" ? t.managers + 1 : t.managers,
                }
              : t
          )
        );
        toast.success("Membro adicionado com sucesso");
      } catch (e: any) {
        const message = e.message || "Falha ao adicionar membro";
        toast.error(message);
        throw e;
      }
    },
    [toast]
  );

  const removeMember = useCallback(
    async (teamId: number, _userId: number) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTeams((prev) =>
          prev.map((t) =>
            t.id === teamId ? { ...t, members: Math.max(0, t.members - 1) } : t
          )
        );
        toast.success("Membro removido com sucesso");
      } catch (e: any) {
        const message = e.message || "Falha ao remover membro";
        toast.error(message);
        throw e;
      }
    },
    [toast]
  );

  const updateMemberRole = useCallback(
    async (_teamId: number, _userId: number, _role: "MEMBER" | "MANAGER") => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        toast.success("Função do membro atualizada");
      } catch (e: any) {
        const message = e.message || "Falha ao atualizar função";
        toast.error(message);
        throw e;
      }
    },
    [toast]
  );

  const filteredTeams = useMemo(() => {
    let result = teams;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(lower) ||
          t.description?.toLowerCase().includes(lower)
      );
    }

    if (teamFilter !== null) {
      result = result.filter((t) => t.id === teamFilter);
    }

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
