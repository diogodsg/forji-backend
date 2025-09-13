import { useMemo } from "react";
import type { PullRequest } from "../types/pr";

export function usePrCounts(prs: PullRequest[]) {
  return useMemo(() => {
    let open = 0;
    let merged = 0;
    let closed = 0;
    for (const pr of prs) {
      if (pr.state === "open") open++;
      else if (pr.state === "merged") merged++;
      else if (pr.state === "closed") closed++;
    }
    return { open, merged, closed };
  }, [prs]);
}
