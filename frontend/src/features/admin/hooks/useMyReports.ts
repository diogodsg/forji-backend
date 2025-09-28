import { useEffect, useState } from "react";
import { api } from "../../../lib/apiClient";

export interface ReportUser {
  id: number;
  name: string;
  email: string;
}

/**
 * Feature-scoped hook: fetches the list of users who report to the current (manager/admin) user.
 */
export function useMyReports() {
  const [reports, setReports] = useState<ReportUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api<ReportUser[]>("/management/subordinates", {
          auth: true,
        });
        if (!active) return;
        setReports(res || []);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Erro ao carregar subordinados");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { reports, loading, error };
}
