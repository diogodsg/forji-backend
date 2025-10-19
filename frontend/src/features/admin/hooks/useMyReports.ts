import { useEffect, useState } from "react";
import { api } from "../../../lib/apiClient";

export interface ReportUser {
  id: string;
  name: string;
  email: string;
}

interface SubordinateResponse {
  id: string;
  subordinate: {
    id: string;
    name: string;
    email: string;
  };
  team: {
    id: string;
    name: string;
  } | null;
  ruleType: string;
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
        const res = await api<SubordinateResponse[]>(
          "/management/subordinates",
          {
            auth: true,
          }
        );

        if (!active) return;

        // Extract subordinate data from the response
        const extractedReports = (res || [])
          .filter((item) => item.subordinate) // Only INDIVIDUAL rules have subordinate
          .map((item) => ({
            id: item.subordinate.id,
            name: item.subordinate.name,
            email: item.subordinate.email,
          }));

        setReports(extractedReports);
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
