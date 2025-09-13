import { describe, it, expect } from "vitest";
import {
  makeMilestone,
  makeKeyResult,
  sortMilestonesDesc,
  todayISO,
} from "./pdi";

describe("pdi utils", () => {
  it("makeMilestone provides defaults", () => {
    const m = makeMilestone();
    expect(m.id).toBeDefined();
    expect(m.date).toBe(todayISO());
    expect(m.title).toContain("Encontro");
  });

  it("sortMilestonesDesc orders newest first", () => {
    const a = makeMilestone({ date: "2024-01-01" });
    const b = makeMilestone({ date: "2024-02-01" });
    const sorted = sortMilestonesDesc([a, b]);
    expect(sorted[0].id).toBe(b.id);
  });

  it("makeKeyResult sets default fields", () => {
    const kr = makeKeyResult();
    expect(kr.description).toBeDefined();
    expect(kr.successCriteria).toBeDefined();
  });
});
