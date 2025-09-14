import { useCallback, useEffect, useState } from "react";

export interface UseFiltersPaginationOptions<F extends Record<string, any>> {
  initial?: F;
  initialPageSize?: number;
  resetKeys?: (keyof F)[]; // keys that trigger page reset when changed
}

export interface UseFiltersPaginationReturn<F extends Record<string, any>> {
  filters: F;
  setFilters: React.Dispatch<React.SetStateAction<F>>;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  updateFilter: (patch: Partial<F>) => void;
  reset: () => void;
}

export function useFiltersPagination<F extends Record<string, any>>(
  opts: UseFiltersPaginationOptions<F> = {}
): UseFiltersPaginationReturn<F> {
  const { initial, initialPageSize = 20, resetKeys } = opts;
  const [filters, setFilters] = useState<F>((initial || {}) as F);
  const [page, _setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(initialPageSize);

  const watchedKeys = (
    resetKeys && resetKeys.length
      ? resetKeys
      : (Object.keys(initial || {}) as (keyof F)[])
  ) as (keyof F)[];

  const depValues = watchedKeys.map((k) => (filters as any)[k]);
  useEffect(() => {
    if (watchedKeys.length) _setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depValues);

  const setPage = useCallback((p: number) => _setPage(p), []);
  const setPageSize = useCallback((s: number) => {
    _setPageSize(s);
    _setPage(1);
  }, []);

  const updateFilter = useCallback((patch: Partial<F>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setFilters((initial || {}) as F);
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
