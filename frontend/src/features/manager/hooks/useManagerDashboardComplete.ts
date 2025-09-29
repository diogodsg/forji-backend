import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import type { ManagerDashboardCompleteData } from "../types/manager";

interface Options {
  skip?: boolean;
}

/**
 * Hook consolidado que busca dashboard + teams em uma única requisição
 * Substitui useManagerDashboard + useAllTeamsWithDetails
 */
export function useManagerDashboardComplete(options: Options = {}) {
  const { skip } = options;
  const [data, setData] = useState<ManagerDashboardCompleteData | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api<ManagerDashboardCompleteData>(
          "/management/dashboard/complete",
          {
            auth: true,
          }
        );
        if (!cancelled) setData(res);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Erro ao carregar dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [skip]);

  return { data, loading, error };
}
