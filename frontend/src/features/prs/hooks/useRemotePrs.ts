import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import type { PullRequest } from "../types/pr";
import { mockPrs } from "../mocks/prs";

/**
 * Maps backend PR payload (mixed casing & numeric field names) into internal `PullRequest` shape.
 */
function mapPr(raw: any): PullRequest {
  const toNum = (v: any) => {
    if (v === null || v === undefined || v === "") return 0;
    // BigInt serializado como string muito grande: tentar Number, se perder precisão ficará grande mas aceitável para exibição agregada.
    // Se for realmente necessário preservar precisão futura, considerar usar bigint, mas UI só precisa de soma.
    const n = typeof v === "number" ? v : Number(v);
    return isNaN(n) ? 0 : n;
  };
  return {
    id: String(raw.id),
    author: raw.user || "unknown",
    user: raw.user || null,
    repo: raw.repo || "unknown",
    title: raw.title || "(sem título)",
    created_at: raw.createdAt || raw.created_at || new Date().toISOString(),
    merged_at: raw.mergedAt || raw.merged_at || undefined,
    state: (raw.state || "open") as PullRequest["state"],
    lines_added: toNum(raw.totalAdditions ?? raw.lines_added ?? 0),
    lines_deleted: toNum(raw.totalDeletions ?? raw.lines_deleted ?? 0),
    files_changed: toNum(raw.totalChanges ?? raw.files_changed ?? 0),
    ai_review_summary: raw.reviewText || "",
    review_comments_highlight: [],
  };
}

/**
 * Fetches remote PRs with server-side filtering (repo/state/author/q) and pagination.
 * Falls back to mock data if enabled and the request fails.
 */
export function useRemotePrs(
  filters: {
    repo?: string;
    state?: string;
    ownerUserId?: number;
    author?: string;
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  },
  opts?: { skip?: boolean; fallbackMocks?: boolean }
) {
  const [data, setData] = useState<PullRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allRepos, setAllRepos] = useState<string[]>([]);
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [metaLoaded, setMetaLoaded] = useState(false);

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
        if (filters.repo) params.set("repo", filters.repo);
        if (filters.state) params.set("state", filters.state);
        if (filters.author) params.set("author", filters.author);
        if (filters.q) params.set("q", filters.q);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
        if (filters.sort) params.set("sort", filters.sort);
        // Request meta only once or when owner scope changes
        if (!metaLoaded) params.set("meta", "1");
        const qs = params.toString() ? `?${params.toString()}` : "";
        const res = await api<{
          items: any[];
          total: number;
          page: number;
          pageSize: number;
          meta?: { repos: string[]; authors: string[] };
        }>(`/prs${qs}`, { auth: true });
        if (!active) return;
        setData(res.items.map(mapPr));
        setTotal(res.total || 0);
        if (res.meta) {
          setAllRepos(res.meta.repos || []);
          setAllAuthors(res.meta.authors || []);
          setMetaLoaded(true);
        }
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Erro ao carregar PRs");
        if (opts?.fallbackMocks) {
          // Provide mocks if remote fails and fallback enabled
          setData(mockPrs as PullRequest[]);
          setTotal(mockPrs.length);
          if (!metaLoaded) {
            setAllRepos(Array.from(new Set(mockPrs.map((m) => m.repo))));
            setAllAuthors(
              Array.from(new Set(mockPrs.map((m) => m.user || m.author)))
            );
            setMetaLoaded(true);
          }
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
    filters.sort,
    metaLoaded,
  ]);

  // Data already filtered server-side; expose raw list as prs
  return {
    prs: data,
    loading,
    error,
    all: data,
    total,
    allRepos,
    allAuthors,
    metaLoaded,
  };
}
