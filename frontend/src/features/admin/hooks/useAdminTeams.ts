import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { teamsApi } from "../services/teamsApi";
import type {
  TeamSummary,
  TeamDetail,
  CreateTeamInput,
  TeamMetrics,
} from "../types";

interface UseAdminTeamsResult {
  teams: TeamSummary[];
  loading: boolean;
  error: string | null;
  metrics: TeamMetrics | null;
  selectedTeam: TeamDetail | null;
  selecting: boolean;
  creating: boolean;
  refreshingTeam: boolean;
  create: (input: CreateTeamInput) => Promise<void>;
  refresh: () => Promise<void>;
  selectTeam: (id: number | null) => Promise<void>;
  updateTeam: (id: number, data: Partial<CreateTeamInput>) => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
  addMember: (
    teamId: number,
    userId: number,
    role?: "MEMBER" | "MANAGER"
  ) => Promise<void>;
  updateMemberRole: (
    teamId: number,
    userId: number,
    role: "MEMBER" | "MANAGER"
  ) => Promise<void>;
  removeMember: (teamId: number, userId: number) => Promise<void>;
  // Filtros avançados (implementação progressiva)
  setSearch: (q: string) => void;
  setRoleFilter: (role: "MEMBER" | "MANAGER" | "ALL") => void;
  setTeamFilter: (teamId: number | null) => void;
  search: string;
  roleFilter: "MEMBER" | "MANAGER" | "ALL";
  teamFilter: number | null;
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
  const cache = useRef<Map<number, TeamDetail>>(new Map());
  // Filtros
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"MEMBER" | "MANAGER" | "ALL">(
    "ALL"
  );
  const [teamFilter, setTeamFilter] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, m] = await Promise.all([
        teamsApi.list(),
        teamsApi.metrics().catch(() => null),
      ]);
      setTeams(list);
      if (m) setMetrics(m);
    } catch (e: any) {
      setError(e.message || "Falha ao carregar equipes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectTeam = useCallback(async (id: number | null) => {
    if (id == null) {
      setSelectedTeam(null);
      return;
    }
    setSelecting(true);
    try {
      if (cache.current.has(id)) {
        setSelectedTeam(cache.current.get(id)!);
      } else {
        const detail = await teamsApi.get(id);
        cache.current.set(id, detail);
        setSelectedTeam(detail);
      }
    } finally {
      setSelecting(false);
    }
  }, []);

  const create = useCallback(
    async (input: CreateTeamInput) => {
      setCreating(true);
      try {
        const created = await teamsApi.create(input);
        cache.current.set(created.id, created);
        await refresh();
        setSelectedTeam(created);
        // Atualiza metrics localmente de forma otimista
        setMetrics((prev) =>
          prev
            ? {
                ...prev,
                totalTeams: prev.totalTeams + 1,
                totalMembers: prev.totalMembers + 1,
                totalManagers: prev.totalManagers + 1,
                usersWithoutTeam: Math.max(0, prev.usersWithoutTeam - 1),
                lastTeamCreatedAt: prev.lastTeamCreatedAt,
              }
            : prev
        );
      } finally {
        setCreating(false);
      }
    },
    [refresh]
  );

  const updateTeam = useCallback(
    async (id: number, data: Partial<CreateTeamInput>) => {
      setRefreshingTeam(true);
      try {
        const updated = await teamsApi.update(id, data);
        cache.current.set(id, updated);
        await refresh();
        setSelectedTeam(updated);
      } finally {
        setRefreshingTeam(false);
      }
    },
    [refresh]
  );

  const deleteTeam = useCallback(
    async (id: number) => {
      setRefreshingTeam(true);
      try {
        await teamsApi.delete(id);
        cache.current.delete(id);
        if (selectedTeam?.id === id) setSelectedTeam(null);
        await refresh();
      } finally {
        setRefreshingTeam(false);
      }
    },
    [refresh, selectedTeam]
  );

  const mutateMembership = useCallback(
    async (cb: () => Promise<any>, teamId: number) => {
      setRefreshingTeam(true);
      try {
        const detail = await cb();
        cache.current.set(teamId, detail);
        setSelectedTeam(detail);
        await refresh();
      } finally {
        setRefreshingTeam(false);
      }
    },
    [refresh]
  );

  const addMember = useCallback(
    async (teamId: number, userId: number, role?: "MEMBER" | "MANAGER") => {
      await mutateMembership(
        () => teamsApi.addMember({ teamId, userId, role }),
        teamId
      );
    },
    [mutateMembership]
  );

  const updateMemberRole = useCallback(
    async (teamId: number, userId: number, role: "MEMBER" | "MANAGER") => {
      await mutateMembership(
        () => teamsApi.updateMemberRole({ teamId, userId, role }),
        teamId
      );
    },
    [mutateMembership]
  );

  const removeMember = useCallback(
    async (teamId: number, userId: number) => {
      await mutateMembership(
        () => teamsApi.removeMember(teamId, userId),
        teamId
      );
    },
    [mutateMembership]
  );

  const filteredTeams = useMemo(() => {
    let data = teams;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter((t) => t.name.toLowerCase().includes(q));
    }
    if (teamFilter != null) {
      data = data.filter((t) => t.id === teamFilter);
    }
    if (roleFilter !== "ALL") {
      // roleFilter aplica-se ao desejo de ver equipes que possuem pelo menos um manager (sempre) ou etc.
      // MVP: se roleFilter = MANAGER, mostra equipes com managers>0; se MEMBER, members>0.
      if (roleFilter === "MANAGER") data = data.filter((t) => t.managers > 0);
      if (roleFilter === "MEMBER") data = data.filter((t) => t.members > 0);
    }
    return data;
  }, [teams, search, roleFilter, teamFilter]);

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
    updateMemberRole,
    removeMember,
    setSearch,
    setRoleFilter,
    setTeamFilter,
    search,
    roleFilter,
    teamFilter,
    filteredTeams,
  };
}
