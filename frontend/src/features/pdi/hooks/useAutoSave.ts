// MOVED from src/hooks/useAutoSave.ts
import { useEffect, useRef } from "react";
import { mergeServerPlan } from "../lib/pdi";
import type { PdiPlan } from "..";

interface UseAutoSaveArgs {
  plan: PdiPlan | null;
  working: PdiPlan | null;
  pending: boolean;
  saving: boolean;
  lastSavedAt: string | null;
  saveForUserId?: string | null;
  dispatch: (action: any) => void;
}

const useDebouncedCallback = (cb: () => void, delay: number, deps: any[]) => {
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(cb, delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export function useAutoSave({
  plan,
  working,
  pending,
  saving,
  lastSavedAt,
  saveForUserId,
  dispatch,
}: UseAutoSaveArgs) {
  useDebouncedCallback(
    () => {
      if (!pending || saving || !working) return;
      dispatch({ type: "SAVE_STARTED" });
      const body: any = { ...working };
      const controller = new AbortController();
      const target = saveForUserId
        ? `/api/pdi/${saveForUserId}`
        : "/api/pdi/me";
      fetch(target, {
        method: saveForUserId ? "PUT" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
        .then(async (r) => {
          if (!r.ok) throw new Error("Failed");
          const server = (await r.json()) as PdiPlan;
          const merged = mergeServerPlan(plan || server, server, {
            editingMilestones: new Set<string>(),
            editingSections: {
              competencies: false,
              krs: false,
              results: false,
            },
          });
          dispatch({ type: "SAVE_SUCCESS", server: merged });
        })
        .catch((err) => {
          console.error("Auto-save error", err);
          dispatch({ type: "SAVE_FAIL" });
        });
      return () => controller.abort();
    },
    800,
    [pending, saving, working, saveForUserId, lastSavedAt]
  );
}
