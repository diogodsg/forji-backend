import { useCallback, useEffect, useState, useMemo } from "react";import { useCallback, useEffect, useState, useMemo } from "react";

import {import {

  getMockTeams,  getMockTeams,

  getMockTeamById,  getMockTeamById,

  getMockTeamMetrics,  getMockTeamMetrics,

} from "../data/mockData";} from "../data/mockData";

import type {import type {

  TeamSummary,  TeamSummary,

  TeamDetail,  TeamDetail,

  CreateTeamInput,  CreateTeamInput,

  TeamMetrics,  TeamMetrics,

} from "../types";} from "../types";



interface UseAdminTeamsResult {interface UseAdminTeamsResult {

  teams: TeamSummary[];  teams: TeamSummary[];

  loading: boolean;  loading: boolean;

  error: string | null;  error: string | null;

  metrics: TeamMetrics | null;  metrics: TeamMetrics | null;

  selectedTeam: TeamDetail | null;  selectedTeam: TeamDetail | null;

  selecting: boolean;  selecting: boolean;

  creating: boolean;  creating: boolean;

  refreshingTeam: boolean;  refreshingTeam: boolean;

  create: (input: CreateTeamInput) => Promise<void>;  create: (input: CreateTeamInput) => Promise<void>;

  refresh: () => Promise<void>;  refresh: () => Promise<void>;

  selectTeam: (id: number | null) => Promise<void>;  selectTeam: (id: number | null) => Promise<void>;

  updateTeam: (id: number, data: Partial<CreateTeamInput>) => Promise<void>;  updateTeam: (id: number, data: Partial<CreateTeamInput>) => Promise<void>;

  deleteTeam: (id: number) => Promise<void>;  deleteTeam: (id: number) => Promise<void>;

  addMember: (  addMember: (

    teamId: number,    teamId: number,

    userId: number,    userId: number,

    role?: "MEMBER" | "MANAGER"    role?: "MEMBER" | "MANAGER"

  ) => Promise<void>;  ) => Promise<void>;

  updateMemberRole: (  updateMemberRole: (

    teamId: number,    teamId: number,

    userId: number,    userId: number,

    role: "MEMBER" | "MANAGER"    role: "MEMBER" | "MANAGER"

  ) => Promise<void>;  ) => Promise<void>;

  removeMember: (teamId: number, userId: number) => Promise<void>;  removeMember: (teamId: number, userId: number) => Promise<void>;

  setSearch: (q: string) => void;  // Filtros avançados (implementação progressiva)

  setRoleFilter: (role: "MEMBER" | "MANAGER" | "ALL") => void;  setSearch: (q: string) => void;

  setTeamFilter: (teamId: number | null) => void;  setRoleFilter: (role: "MEMBER" | "MANAGER" | "ALL") => void;

  search: string;  setTeamFilter: (teamId: number | null) => void;

  roleFilter: "MEMBER" | "MANAGER" | "ALL";  search: string;

  teamFilter: number | null;  roleFilter: "MEMBER" | "MANAGER" | "ALL";

  filteredTeams: TeamSummary[];  teamFilter: number | null;

}  filteredTeams: TeamSummary[];

}

/**

 * Hook para gerenciar equipes usando apenas dados mock (sem backend)export function useAdminTeams(): UseAdminTeamsResult {

 * Simula operações assíncronas para manter a mesma interface  const [teams, setTeams] = useState<TeamSummary[]>([]);

 */  const [loading, setLoading] = useState(true);

export function useAdminTeams(): UseAdminTeamsResult {  const [error, setError] = useState<string | null>(null);

  const [teams, setTeams] = useState<TeamSummary[]>([]);  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);

  const [loading, setLoading] = useState(true);  const [creating, setCreating] = useState(false);

  const [error, setError] = useState<string | null>(null);  const [selecting, setSelecting] = useState(false);

  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);  const [refreshingTeam, setRefreshingTeam] = useState(false);

  const [creating, setCreating] = useState(false);  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null);

  const [selecting, setSelecting] = useState(false);

  const [refreshingTeam, setRefreshingTeam] = useState(false);  // Filtros

  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null);  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<"MEMBER" | "MANAGER" | "ALL">(

  // Filtros    "ALL"

  const [search, setSearch] = useState("");  );

  const [roleFilter, setRoleFilter] = useState<"MEMBER" | "MANAGER" | "ALL">(  const [teamFilter, setTeamFilter] = useState<number | null>(null);

    "ALL"

  );  // Simula carregamento inicial

  const [teamFilter, setTeamFilter] = useState<number | null>(null);  const refresh = useCallback(async () => {

    setLoading(true);

  // Simula carregamento inicial    setError(null);

  const refresh = useCallback(async () => {    try {

    setLoading(true);      // Simula delay de rede

    setError(null);      await new Promise((resolve) => setTimeout(resolve, 300));

    try {      setTeams(getMockTeams());

      await new Promise((resolve) => setTimeout(resolve, 300));      setMetrics(getMockTeamMetrics());

      setTeams(getMockTeams());    } catch (e: any) {

      setMetrics(getMockTeamMetrics());      setError(e.message || "Falha ao carregar equipes");

    } catch (e: any) {    } finally {

      setError(e.message || "Falha ao carregar equipes");      setLoading(false);

    } finally {    }

      setLoading(false);  }, []);

    }

  }, []);  useEffect(() => {

    refresh();

  useEffect(() => {  }, [refresh]);

    refresh();

  }, [refresh]);  const selectTeam = useCallback(async (id: number | null) => {

    if (id == null) {

  const selectTeam = useCallback(async (id: number | null) => {      setSelectedTeam(null);

    if (id == null) {      return;

      setSelectedTeam(null);    }

      return;    setSelecting(true);

    }    try {

    setSelecting(true);      if (cache.current.has(id)) {

    try {        setSelectedTeam(cache.current.get(id)!);

      await new Promise((resolve) => setTimeout(resolve, 200));      } else {

      const detail = getMockTeamById(id);        const detail = await teamsApi.get(id);

      setSelectedTeam(detail || null);        cache.current.set(id, detail);

    } finally {        setSelectedTeam(detail);

      setSelecting(false);      }

    }    } finally {

  }, []);      setSelecting(false);

    }

  const create = useCallback(  }, []);

    async (input: CreateTeamInput) => {

      setCreating(true);  const create = useCallback(

      try {    async (input: CreateTeamInput) => {

        await new Promise((resolve) => setTimeout(resolve, 500));      setCreating(true);

        const newId = Math.max(...teams.map((t) => t.id), 100) + 1;      try {

        const newTeam: TeamSummary = {        const created = await teamsApi.create(input);

          id: newId,        cache.current.set(created.id, created);

          name: input.name,        await refresh();

          description: input.description || null,        setSelectedTeam(created);

          members: 0,        // Atualiza metrics localmente de forma otimista

          managers: 0,        setMetrics((prev) =>

          createdAt: new Date().toISOString(),          prev

        };            ? {

        setTeams((prev) => [...prev, newTeam]);                ...prev,

        setMetrics((prev) =>                totalTeams: prev.totalTeams + 1,

          prev ? { ...prev, totalTeams: prev.totalTeams + 1 } : prev                totalMembers: prev.totalMembers + 1,

        );                totalManagers: prev.totalManagers + 1,

        console.log("✅ Equipe criada (mock):", newTeam);                usersWithoutTeam: Math.max(0, prev.usersWithoutTeam - 1),

      } finally {                lastTeamCreatedAt: prev.lastTeamCreatedAt,

        setCreating(false);              }

      }            : prev

    },        );

    [teams]      } finally {

  );        setCreating(false);

      }

  const updateTeam = useCallback(    },

    async (id: number, data: Partial<CreateTeamInput>) => {    [refresh]

      setRefreshingTeam(true);  );

      try {

        await new Promise((resolve) => setTimeout(resolve, 400));  const updateTeam = useCallback(

        setTeams((prev) =>    async (id: number, data: Partial<CreateTeamInput>) => {

          prev.map((team) =>      setRefreshingTeam(true);

            team.id === id ? { ...team, ...data } : team      try {

          )        const updated = await teamsApi.update(id, data);

        );        cache.current.set(id, updated);

        if (selectedTeam?.id === id) {        await refresh();

          setSelectedTeam((prev) => (prev ? { ...prev, ...data } : prev));        setSelectedTeam(updated);

        }      } finally {

        console.log("✅ Equipe atualizada (mock):", id, data);        setRefreshingTeam(false);

      } finally {      }

        setRefreshingTeam(false);    },

      }    [refresh]

    },  );

    [selectedTeam]

  );  const deleteTeam = useCallback(

    async (id: number) => {

  const deleteTeam = useCallback(      setRefreshingTeam(true);

    async (id: number) => {      try {

      setRefreshingTeam(true);        await teamsApi.delete(id);

      try {        cache.current.delete(id);

        await new Promise((resolve) => setTimeout(resolve, 400));        if (selectedTeam?.id === id) setSelectedTeam(null);

        setTeams((prev) => prev.filter((team) => team.id !== id));        await refresh();

        if (selectedTeam?.id === id) setSelectedTeam(null);      } finally {

        setMetrics((prev) =>        setRefreshingTeam(false);

          prev      }

            ? { ...prev, totalTeams: Math.max(0, prev.totalTeams - 1) }    },

            : prev    [refresh, selectedTeam]

        );  );

        console.log("✅ Equipe excluída (mock):", id);

      } finally {  const mutateMembership = useCallback(

        setRefreshingTeam(false);    async (cb: () => Promise<any>, teamId: number) => {

      }      setRefreshingTeam(true);

    },      try {

    [selectedTeam]        const detail = await cb();

  );        cache.current.set(teamId, detail);

        setSelectedTeam(detail);

  const addMember = useCallback(        await refresh();

    async (      } finally {

      teamId: number,        setRefreshingTeam(false);

      userId: number,      }

      role: "MEMBER" | "MANAGER" = "MEMBER"    },

    ) => {    [refresh]

      setRefreshingTeam(true);  );

      try {

        await new Promise((resolve) => setTimeout(resolve, 400));  const addMember = useCallback(

        setTeams((prev) =>    async (teamId: number, userId: number, role?: "MEMBER" | "MANAGER") => {

          prev.map((team) =>      await mutateMembership(

            team.id === teamId        () => teamsApi.addMember({ teamId, userId, role }),

              ? {        teamId

                  ...team,      );

                  members: team.members + 1,    },

                  managers:    [mutateMembership]

                    role === "MANAGER" ? team.managers + 1 : team.managers,  );

                }

              : team  const updateMemberRole = useCallback(

          )    async (teamId: number, userId: number, role: "MEMBER" | "MANAGER") => {

        );      await mutateMembership(

        console.log("✅ Membro adicionado (mock):", { teamId, userId, role });        () => teamsApi.updateMemberRole({ teamId, userId, role }),

      } finally {        teamId

        setRefreshingTeam(false);      );

      }    },

    },    [mutateMembership]

    []  );

  );

  const removeMember = useCallback(

  const updateMemberRole = useCallback(    async (teamId: number, userId: number) => {

    async (teamId: number, userId: number, role: "MEMBER" | "MANAGER") => {      await mutateMembership(

      setRefreshingTeam(true);        () => teamsApi.removeMember(teamId, userId),

      try {        teamId

        await new Promise((resolve) => setTimeout(resolve, 400));      );

        console.log("✅ Papel atualizado (mock):", { teamId, userId, role });    },

      } finally {    [mutateMembership]

        setRefreshingTeam(false);  );

      }

    },  const filteredTeams = useMemo(() => {

    []    let data = teams;

  );    if (search.trim()) {

      const q = search.trim().toLowerCase();

  const removeMember = useCallback(async (teamId: number, userId: number) => {      data = data.filter((t) => t.name.toLowerCase().includes(q));

    setRefreshingTeam(true);    }

    try {    if (teamFilter != null) {

      await new Promise((resolve) => setTimeout(resolve, 400));      data = data.filter((t) => t.id === teamFilter);

      setTeams((prev) =>    }

        prev.map((team) =>    if (roleFilter !== "ALL") {

          team.id === teamId      // roleFilter aplica-se ao desejo de ver equipes que possuem pelo menos um manager (sempre) ou etc.

            ? { ...team, members: Math.max(0, team.members - 1) }      // MVP: se roleFilter = MANAGER, mostra equipes com managers>0; se MEMBER, members>0.

            : team      if (roleFilter === "MANAGER") data = data.filter((t) => t.managers > 0);

        )      if (roleFilter === "MEMBER") data = data.filter((t) => t.members > 0);

      );    }

      console.log("✅ Membro removido (mock):", { teamId, userId });    return data;

    } finally {  }, [teams, search, roleFilter, teamFilter]);

      setRefreshingTeam(false);

    }  return {

  }, []);    teams,

    loading,

  const filteredTeams = useMemo(() => {    error,

    let data = teams;    metrics,

    if (search.trim()) {    selectedTeam,

      const q = search.trim().toLowerCase();    selecting,

      data = data.filter(    creating,

        (t) =>    refreshingTeam,

          t.name.toLowerCase().includes(q) ||    create,

          t.description?.toLowerCase().includes(q)    refresh,

      );    selectTeam,

    }    updateTeam,

    if (teamFilter != null) {    deleteTeam,

      data = data.filter((t) => t.id === teamFilter);    addMember,

    }    updateMemberRole,

    if (roleFilter !== "ALL") {    removeMember,

      if (roleFilter === "MANAGER") data = data.filter((t) => t.managers > 0);    setSearch,

      if (roleFilter === "MEMBER") data = data.filter((t) => t.members > 0);    setRoleFilter,

    }    setTeamFilter,

    return data;    search,

  }, [teams, search, roleFilter, teamFilter]);    roleFilter,

    teamFilter,

  return {    filteredTeams,

    teams,  };

    loading,}

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
