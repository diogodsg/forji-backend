import { useCallback, useEffect, useState } from "react";

export interface PrsFilterState {
  repo?: string;
  state?: string;
  ownerUserId?: number;
  author?: string;
}

export interface UsePrsFiltersPaginationOptions {
  initial?: PrsFilterState;
  initialPageSize?: number;
}

interface UsePrsFiltersPaginationReturn {
  filters: PrsFilterState;
  setFilters: React.Dispatch<React.SetStateAction<PrsFilterState>>;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  updateFilter: (patch: Partial<PrsFilterState>) => void;
  reset: () => void;
}

/**
 * Encapsulates PR list filters + pagination with automatic page reset when
 * a filter (other than page/pageSize) changes.
 */
// TODO(generalize): Este hook pode ser movido para `shared/hooks` como `useFiltersPagination`
// recebendo um shape genérico de filtros quando outro domínio (ex: usuários, PDI granular)
// precisar da mesma semântica de reset de página.
export function usePrsFiltersPagination(
  opts: UsePrsFiltersPaginationOptions = {}
): UsePrsFiltersPaginationReturn {
  const { initial, initialPageSize = 20 } = opts;
  const [filters, setFilters] = useState<PrsFilterState>(initial || {});
  const [page, _setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(initialPageSize);

  // Reset page when relevant filters change
  useEffect(() => {
    _setPage(1);
  }, [filters.repo, filters.state, filters.ownerUserId, filters.author]);

  const setPage = useCallback((p: number) => _setPage(p), []);
  const setPageSize = useCallback((s: number) => {
    _setPageSize(s);
    _setPage(1);
  }, []);

  const updateFilter = useCallback((patch: Partial<PrsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setFilters(initial || {});
    _setPage(1);
    _setPageSize(initialPageSize);
  }, [initial, initialPageSize]);

  return {
    filters,
    setFilters,
    page,
    pageSize,
    setPage,
    setPageSize,
    updateFilter,
    reset,
  };
}
