import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/apiClient";
import type { TeamSummary, TeamDetail } from "@/features/admin/types/team";

interface UseMyTeamsResult {
  teams: TeamSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getTeam: (id: number) => Promise<TeamDetail>;
  details: Record<number, TeamDetail | undefined>;
  loadingTeam: Set<number>;
}

export function useMyTeams(): UseMyTeamsResult {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const details = useRef<Record<number, TeamDetail | undefined>>({});
  const loadingTeam = useRef<Set<number>>(new Set());
  const [, force] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<TeamSummary[]>("/teams/mine", { auth: true });
      setTeams(data);
    } catch (e: any) {
      setError(e.message || "Falha ao carregar equipes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getTeam = useCallback(async (id: number) => {
    if (details.current[id]) return details.current[id]!;
    loadingTeam.current.add(id);
    force((x) => x + 1);
    try {
      const data = await api<TeamDetail>(`/teams/${id}`, { auth: true });
      details.current[id] = data;
      return data;
    } finally {
      loadingTeam.current.delete(id);
      force((x) => x + 1);
    }
  }, []);

  const memoDetails = useMemo(() => details.current, [teams]);

  return {
    teams,
    loading,
    error,
    refresh,
    getTeam,
    details: memoDetails,
    loadingTeam: loadingTeam.current,
  };
}
