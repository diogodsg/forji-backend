// MOVED from src/hooks/useAutoSave.ts
import { mergeServerPlan } from "../lib/pdi";
import type { PdiPlan } from "..";
import { api } from "../../../lib/apiClient";
import { useDebounceEffect } from "../../../shared/hooks/useDebounceEffect";

// Tornar dispatch genérico para aceitar Action específico do reducer externo
type SaveAction =
  | { type: "SAVE_STARTED" }
  | { type: "SAVE_SUCCESS"; server: PdiPlan }
  | { type: "SAVE_FAIL"; error?: string };

interface UseAutoSaveArgs {
  plan: PdiPlan | null;
  working: PdiPlan | null;
  pending: boolean;
  saving: boolean;
  lastSavedAt: string | null;
  saveForUserId?: string | null;
  // editing context to protect in-progress fields from stale server merges
  editingMilestones: Set<string>;
  editingSections: {
    competencies: boolean;
    krs: boolean;
    results: boolean;
  };
  dispatch: (action: SaveAction) => void;
}

// useDebounceEffect agora fornecido em shared/hooks

export function useAutoSave({
  plan,
  working,
  pending,
  saving,
  lastSavedAt,
  saveForUserId,
  editingMilestones,
  editingSections,
  dispatch,
}: UseAutoSaveArgs) {
  useDebounceEffect(
    () => {
      if (!pending || saving || !working) return;
      
      // Evitar auto-save se há milestones sendo editados ativamente
      // para prevenir race conditions durante digitação
      if (editingMilestones.size > 0) {
        console.log("Auto-save pausado: milestones em edição");
        return;
      }
      
      const abort = new AbortController();
      (async () => {
        dispatch({ type: "SAVE_STARTED" });
        try {
          const endpoint = saveForUserId ? `/pdi/${saveForUserId}` : "/pdi/me";
          const method = saveForUserId ? "PUT" : "PATCH";
          // Sanitize outgoing records: remove any client-only metadata (e.g., lastEditedAt)
          const sanitizedRecords = (working.records || []).map((r: any) => {
            const { lastEditedAt, ...rest } = r; // strip local-only field
            return rest;
          });
          const server = await api<PdiPlan>(endpoint, {
            method,
            auth: true,
            body: JSON.stringify({
              competencies: working.competencies,
              milestones: working.milestones,
              krs: working.krs || [],
              records: sanitizedRecords,
            }),
            signal: abort.signal,
          });
          const merged = mergeServerPlan(plan || server, server, {
            editingMilestones,
            editingSections,
          });
          dispatch({ type: "SAVE_SUCCESS", server: merged });
        } catch (err: any) {
          if (err?.name === "AbortError") return; // navegação/unmount
          console.error("Auto-save error", err);
          dispatch({ type: "SAVE_FAIL", error: err?.message });
        }
      })();
      // cleanup separado
      return () => abort.abort();
    },
    800,
    [pending, saving, working, saveForUserId, lastSavedAt]
  );
}
