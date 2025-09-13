import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/apiClient";
import type { PullRequest } from "../types/pr";
import { mockPrs } from "../mocks/prs";

// Map backend PullRequest (snake case & different numeric fields) to frontend shape
function mapPr(raw: any): PullRequest {
  return {
    id: String(raw.id),
    author: raw.user || "unknown",
    user: raw.user || null,
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
    author?: string;
    page?: number;
    pageSize?: number;
  },
  opts?: { skip?: boolean; fallbackMocks?: boolean }
) {
  const [data, setData] = useState<PullRequest[]>([]);
  const [total, setTotal] = useState(0);
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
        const params = new URLSearchParams();
        if (filters.ownerUserId)
          params.set("ownerUserId", String(filters.ownerUserId));
        if (filters.page) params.set("page", String(filters.page));
        if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
        const qs = params.toString() ? `?${params.toString()}` : "";
        const res = await api<{
          items: any[];
          total: number;
          page: number;
          pageSize: number;
        }>(`/prs${qs}`, { auth: true });
        if (!active) return;
        setData(res.items.map(mapPr));
        setTotal(res.total || 0);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Erro ao carregar PRs");
        if (opts?.fallbackMocks) {
          // Provide mocks if remote fails and fallback enabled
          setData(mockPrs as PullRequest[]);
          setTotal(mockPrs.length);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [
    filters.repo,
    filters.state,
    filters.ownerUserId,
    filters.author,
    filters.page,
    filters.pageSize,
    opts?.skip,
    opts?.fallbackMocks,
  ]);

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (filters.repo && p.repo !== filters.repo) return false;
      if (filters.state && p.state !== filters.state) return false;
      if (
        filters.author &&
        p.user !== filters.author &&
        p.author !== filters.author
      )
        return false;
      return true;
    });
  }, [data, filters.repo, filters.state, filters.author]);

  return { prs: filtered, loading, error, all: data, total };
}
