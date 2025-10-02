// MOVED & ADAPTED from src/hooks/useRemotePdiForUser.ts
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../lib/apiClient";
import type { PdiPlan } from "..";

export function useRemotePdiForUser(userId?: number) {
  const [plan, setPlan] = useState<PdiPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api<any>(`/pdi/${userId}`, { auth: true });
      if (data) {
        const planData: PdiPlan = {
          userId: String(data.userId),
          cycles: (data.cycles || []).map((c: any) => ({
            id: String(c.id),
            title: c.title,
            description: c.description ?? undefined,
            startDate: c.startDate,
            endDate: c.endDate,
            status: (c.status || "").toLowerCase(),
            pdi: {
              competencies: c.competencies || [],
              milestones: c.milestones || [],
              krs: c.krs || [],
              records: c.records || [],
            },
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          })),
          competencies: data.competencies || [],
          milestones: data.milestones || [],
          krs: data.krs || [],
          records: data.records || [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
        setPlan(planData);
      } else {
        setPlan(null);
      }
    } catch (e: any) {
      if (/404/.test(e.message)) {
        setPlan(null);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = useCallback(
    async (incoming: Omit<PdiPlan, "createdAt" | "updatedAt">) => {
      if (!userId) return;
      const res = await api<any>(`/pdi/${userId}`, {
        method: "PUT",
        auth: true,
        body: JSON.stringify({
          competencies: incoming.competencies,
          milestones: incoming.milestones,
          krs: incoming.krs || [],
          records: incoming.records,
        }),
      });
      setPlan({
        userId: String(res.userId),
        cycles: (res.cycles || []).map((c: any) => ({
          id: String(c.id),
          title: c.title,
          description: c.description ?? undefined,
          startDate: c.startDate,
          endDate: c.endDate,
          status: (c.status || "").toLowerCase(),
          pdi: {
            competencies: c.competencies || [],
            milestones: c.milestones || [],
            krs: c.krs || [],
            records: c.records || [],
          },
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
        competencies: res.competencies,
        milestones: res.milestones,
        krs: res.krs || [],
        records: res.records,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      });
    },
    [userId]
  );

  return { plan, loading, error, refresh: load, upsert };
}
