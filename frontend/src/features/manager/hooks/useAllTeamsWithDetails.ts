import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import type { TeamDetail } from "@/features/admin/types/team";

interface UseAllTeamsWithDetailsResult {
  teams: TeamDetail[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook otimizado para buscar TODOS os times com detalhes em uma única requisição
 * Substitui o useAllTeams que fazia múltiplas requisições
 */
export function useAllTeamsWithDetails(): UseAllTeamsWithDetailsResult {
  const [teams, setTeams] = useState<TeamDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar todos os times com detalhes em uma única requisição
      const data = await api<TeamDetail[]>("/teams?details=true", {
        auth: true,
      });
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

  return {
    teams,
    loading,
    error,
    refresh,
  };
}
