// MOVED from src/hooks/usePdiEditing.ts
import { useReducer, useCallback } from "react";
import type {
  PdiPlan,
  PdiMilestone,
  PdiKeyResult,
  PdiCompetencyRecord,
} from "..";
import { makeMilestone, makeKeyResult } from "../lib/pdi";

export interface PdiEditingState {
  working: PdiPlan;
  editing: {
    sections: { competencies: boolean; krs: boolean; results: boolean };
    milestones: Set<string>;
  };
  meta: {
    pendingSave: boolean;
    saving: boolean;
    milestoneSaving: Set<string>;
    milestoneErrors: Set<string>;
  };
}

type Action =
  | { type: "INIT"; plan: PdiPlan }
  | {
      type: "TOGGLE_SECTION";
      section: keyof PdiEditingState["editing"]["sections"];
    }
  | { type: "TOGGLE_MILESTONE"; id: string }
  | { type: "UPDATE_PLAN"; patch: Partial<PdiPlan> }
  | { type: "UPDATE_MILESTONE"; id: string; patch: Partial<PdiMilestone> }
  | { type: "ADD_MILESTONE"; milestone?: PdiMilestone }
  | { type: "REMOVE_MILESTONE"; id: string }
  | { type: "ADD_COMPETENCY"; value: string }
  | { type: "REMOVE_COMPETENCY"; value: string }
  | { type: "ADD_KR"; kr?: PdiKeyResult }
  | { type: "UPDATE_KR"; id: string; patch: Partial<PdiKeyResult> }
  | { type: "REMOVE_KR"; id: string }
  | { type: "UPDATE_RECORD"; area: string; patch: Partial<PdiCompetencyRecord> }
  | { type: "ADD_RECORD"; record: PdiPlan["records"][number] }
  | { type: "REMOVE_RECORD"; area: string }
  | { type: "MARK_PENDING" }
  | { type: "SAVE_STARTED" }
  | { type: "SAVE_SUCCESS"; server: PdiPlan }
  | { type: "SAVE_FAIL" };

function cloneMilestones(set: Set<string>) {
  return new Set(Array.from(set));
}

export function pdiEditingReducer(
  state: PdiEditingState,
  action: Action
): PdiEditingState {
  switch (action.type) {
    case "INIT":
      return {
        working: action.plan,
        editing: {
          sections: { competencies: false, krs: false, results: false },
          milestones: new Set(),
        },
        meta: {
          pendingSave: false,
          saving: false,
          milestoneSaving: new Set(),
          milestoneErrors: new Set(),
        },
      };
    case "TOGGLE_SECTION":
      return {
        ...state,
        editing: {
          ...state.editing,
          sections: {
            ...state.editing.sections,
            [action.section]: !state.editing.sections[action.section],
          },
        },
      };
    case "TOGGLE_MILESTONE": {
      const next = cloneMilestones(state.editing.milestones);
      next.has(action.id) ? next.delete(action.id) : next.add(action.id);
      return { ...state, editing: { ...state.editing, milestones: next } };
    }
    case "UPDATE_PLAN":
      return {
        ...state,
        working: { ...state.working, ...action.patch },
        meta: { ...state.meta, pendingSave: true },
      };
    case "UPDATE_MILESTONE":
      return {
        ...state,
        working: {
          ...state.working,
          milestones: state.working.milestones.map((m) =>
            m.id === action.id ? { ...m, ...action.patch } : m
          ),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "ADD_MILESTONE": {
      const milestone = action.milestone ?? makeMilestone();
      return {
        ...state,
        working: {
          ...state.working,
          milestones: [milestone, ...state.working.milestones],
        },
        editing: {
          ...state.editing,
          milestones: new Set(state.editing.milestones).add(milestone.id),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    }
    case "REMOVE_MILESTONE":
      return {
        ...state,
        working: {
          ...state.working,
          milestones: state.working.milestones.filter(
            (m) => m.id !== action.id
          ),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "ADD_COMPETENCY":
      if (!action.value || state.working.competencies.includes(action.value))
        return state;
      return {
        ...state,
        working: {
          ...state.working,
          competencies: [...state.working.competencies, action.value],
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "REMOVE_COMPETENCY":
      return {
        ...state,
        working: {
          ...state.working,
          competencies: state.working.competencies.filter(
            (c) => c !== action.value
          ),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "ADD_KR": {
      const kr = action.kr ?? makeKeyResult();
      return {
        ...state,
        working: { ...state.working, krs: [...(state.working.krs || []), kr] },
        meta: { ...state.meta, pendingSave: true },
      };
    }
    case "UPDATE_KR":
      return {
        ...state,
        working: {
          ...state.working,
          krs: (state.working.krs || []).map((k) =>
            k.id === action.id ? { ...k, ...action.patch } : k
          ),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "REMOVE_KR":
      return {
        ...state,
        working: {
          ...state.working,
          krs: (state.working.krs || []).filter((k) => k.id !== action.id),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "UPDATE_RECORD":
      return {
        ...state,
        working: {
          ...state.working,
          records: state.working.records.map((r) =>
            r.area === action.area
              ? {
                  ...r,
                  ...action.patch,
                  lastEditedAt: new Date().toISOString(),
                }
              : r
          ),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "ADD_RECORD":
      if (state.working.records.some((r) => r.area === action.record.area))
        return state;
      return {
        ...state,
        working: {
          ...state.working,
          records: [...state.working.records, action.record],
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "REMOVE_RECORD":
      return {
        ...state,
        working: {
          ...state.working,
          records: state.working.records.filter((r) => r.area !== action.area),
        },
        meta: { ...state.meta, pendingSave: true },
      };
    case "MARK_PENDING":
      return { ...state, meta: { ...state.meta, pendingSave: true } };
    case "SAVE_STARTED":
      return { ...state, meta: { ...state.meta, saving: true } };
    case "SAVE_SUCCESS":
      return {
        ...state,
        working: action.server,
        meta: {
          ...state.meta,
          saving: false,
          pendingSave: false,
          milestoneSaving: new Set(),
          milestoneErrors: new Set(),
        },
      };
    case "SAVE_FAIL":
      return { ...state, meta: { ...state.meta, saving: false } };
    default:
      return state;
  }
}

export function usePdiEditing(initial: PdiPlan) {
  const [state, dispatch] = useReducer(
    pdiEditingReducer,
    undefined as any,
    () => ({
      working: initial,
      editing: {
        sections: { competencies: false, krs: false, results: false },
        milestones: new Set<string>(),
      },
      meta: {
        pendingSave: false,
        saving: false,
        milestoneSaving: new Set<string>(),
        milestoneErrors: new Set<string>(),
      },
    })
  );
  const toggleSection = useCallback(
    (section: keyof PdiEditingState["editing"]["sections"]) =>
      dispatch({ type: "TOGGLE_SECTION", section }),
    []
  );
  const toggleMilestone = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_MILESTONE", id }),
    []
  );
  return { state, dispatch, toggleSection, toggleMilestone };
}
