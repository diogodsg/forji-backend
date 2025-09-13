// MOVED & ADAPTED from src/hooks/useRemotePdi.ts preserving original richer API
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../lib/apiClient";
import type { PdiPlan } from "..";

interface RemoteState {
  plan: PdiPlan | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  refresh: () => void;
  upsert: (plan: Omit<PdiPlan, "createdAt" | "updatedAt">) => Promise<void>;
  patch: (partial: Partial<PdiPlan>) => Promise<void>;
}

export function useRemotePdi(): RemoteState {
  const [plan, setPlan] = useState<PdiPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<any>("/pdi/me", { auth: true });
      if (data) {
        const planData: PdiPlan = {
          userId: String(data.userId),
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = useCallback(
    async (incoming: Omit<PdiPlan, "createdAt" | "updatedAt">) => {
      setSaving(true);
      setError(null);
      try {
        const res = await api<any>("/pdi", {
          method: "POST",
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
          competencies: res.competencies,
          milestones: res.milestones,
          krs: res.krs || [],
          records: res.records,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const patch = useCallback(
    async (partial: Partial<PdiPlan>) => {
      if (!plan) return;
      setSaving(true);
      setError(null);
      try {
        const res = await api<any>("/pdi/me", {
          method: "PATCH",
          auth: true,
          body: JSON.stringify({
            competencies: partial.competencies ?? undefined,
            milestones: partial.milestones ?? undefined,
            krs: partial.krs ?? undefined,
            records: partial.records ?? undefined,
          }),
        });
        setPlan({
          userId: String(res.userId),
          competencies: res.competencies,
          milestones: res.milestones,
          krs: res.krs || [],
          records: res.records,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setSaving(false);
      }
    },
    [plan]
  );

  return { plan, loading, saving, error, refresh: load, upsert, patch };
}
