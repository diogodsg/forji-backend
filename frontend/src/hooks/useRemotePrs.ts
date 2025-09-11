import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/apiClient";
import type { PullRequest } from "../types/pr";

// Map backend PullRequest (snake case & different numeric fields) to frontend shape
function mapPr(raw: any): PullRequest {
  return {
    id: String(raw.id),
    author: raw.user || "unknown",
    repo: raw.repo || "unknown",
    title: raw.title || "(sem título)",
    created_at: raw.createdAt || raw.created_at || new Date().toISOString(),
    merged_at: raw.mergedAt || raw.merged_at || undefined,
    state: (raw.state || "open") as PullRequest["state"],
    lines_added: raw.totalAdditions ?? 0,
    lines_deleted: raw.totalDeletions ?? 0,
    files_changed: raw.totalChanges ?? 0,
    ai_review_summary: raw.reviewText || "",
    review_comments_highlight: [],
  };
}

export function useRemotePrs(
  filters: {
    repo?: string;
    state?: string;
    ownerUserId?: number;
  },
  opts?: { skip?: boolean }
) {
  const [data, setData] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (opts?.skip) {
      setLoading(false);
      return () => {
        active = false;
      };
    }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const qs = filters.ownerUserId
          ? `?ownerUserId=${filters.ownerUserId}`
          : "";
        const res = await api<any[]>(`/prs${qs}`, { auth: true });
        if (!active) return;
        setData(res.map(mapPr));
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Erro ao carregar PRs");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [filters.repo, filters.state, filters.ownerUserId, opts?.skip]);

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (filters.repo && p.repo !== filters.repo) return false;
      if (filters.state && p.state !== filters.state) return false;
      return true;
    });
  }, [data, filters.repo, filters.state]);

  return { prs: filtered, loading, error, all: data };
}
