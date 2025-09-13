import { useEffect } from "react";
import type { PdiPlan } from "../types/pdi";

/**
 * Ensures a PDI plan exists: when loading finishes and no plan/error present, invokes upsert with empty skeleton.
 * Accepts string userId ("me" or explicit) for consistency with existing usage.
 */
export function useEnsurePdi({
  plan,
  loading,
  error,
  upsert,
  userId = "me",
  autoCreate = true,
}: {
  plan: PdiPlan | null | undefined;
  loading: boolean;
  error: string | null | undefined;
  upsert: (p: Omit<PdiPlan, "createdAt" | "updatedAt">) => void | Promise<any>;
  userId?: string | number;
  autoCreate?: boolean;
}) {
  useEffect(() => {
    if (!autoCreate) return;
    if (!loading && !plan && !error) {
      upsert({
        userId: String(userId),
        competencies: [],
        milestones: [],
        krs: [],
        records: [],
      } as any);
    }
  }, [autoCreate, loading, plan, error, upsert, userId]);
}
