import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import type { ManagerDashboardData } from "../types/manager";

interface Options {
  skip?: boolean;
}

export function useManagerDashboard(options: Options = {}) {
  const { skip } = options;
  const [data, setData] = useState<ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip) return; // consumer controla fetch condicional
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api<ManagerDashboardData>("/management/dashboard", {
          auth: true,
        });
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
