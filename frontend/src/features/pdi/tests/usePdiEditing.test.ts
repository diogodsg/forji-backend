import { describe, it, expect } from "vitest";
import {
  pdiEditingReducer,
  type PdiEditingState,
} from "../hooks/usePdiEditing";
import type { PdiPlan } from "..";

function basePlan(): PdiPlan {
  return {
    userId: "1",
    cycles: [],
    competencies: [],
    milestones: [],
    krs: [],
    records: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe("pdiEditingReducer", () => {
  it("adds milestone and marks pending save", () => {
    const initial: PdiEditingState = {
      working: basePlan(),
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
    const next = pdiEditingReducer(initial, { type: "ADD_MILESTONE" });
    expect(next.working.milestones.length).toBe(1);
    expect(next.meta.pendingSave).toBe(true);
  });
});
