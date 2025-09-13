// MOVED from src/hooks/useLocalPdi.ts
import { useCallback, useEffect, useState } from "react";
import type { PdiPlan } from "..";

const STORAGE_KEY = "pdi_plan_me";

export function loadStoredPdi(): PdiPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PdiPlan;
  } catch {
    return null;
  }
}

type Options = { enableStorage?: boolean };

export function useLocalPdi(initial: PdiPlan, opts: Options = {}) {
  const enableStorage = opts.enableStorage ?? true;
  const [plan, setPlan] = useState<PdiPlan>(() =>
    enableStorage ? loadStoredPdi() ?? initial : initial
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (dirty && enableStorage) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...plan, updatedAt: new Date().toISOString() })
        );
      } catch {}
    }
  }, [plan, dirty, enableStorage]);

  const updatePlan = useCallback(
    <K extends keyof PdiPlan>(key: K, value: PdiPlan[K]) => {
      setPlan((p) => ({
        ...p,
        [key]: value,
        updatedAt: new Date().toISOString(),
      }));
      setDirty(true);
    },
    []
  );

  const replacePlan = useCallback((p: PdiPlan) => {
    setPlan(p);
    setDirty(true);
  }, []);

  const reset = useCallback(() => {
    setPlan(initial);
    setDirty(false);
    if (enableStorage) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [initial, enableStorage]);

  return { plan, setPlan: replacePlan, updatePlan, dirty, reset };
}
