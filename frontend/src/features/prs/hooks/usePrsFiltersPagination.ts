import { useFiltersPagination } from "@/shared/hooks/useFiltersPagination";

export interface PrsFilterState {
  repo?: string;
  state?: string;
  ownerUserId?: number;
  author?: string;
  q?: string; // search (title or author)
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
 * Wrapper sobre o hook genérico `useFiltersPagination` definindo:
 *  - Tipagem específica do domínio de PRs
 *  - Lista explícita de chaves que disparam reset de página
 * Mantido como camada fina para permitir evolução futura (ex: persistência em query params
 * ou side-effects de analytics) sem impactar outras features que usem o genérico.
 */
/**
 * Domain wrapper returning pagination + filter state for PR lists.
 */
export function usePrsFiltersPagination(
  opts: UsePrsFiltersPaginationOptions = {}
): UsePrsFiltersPaginationReturn {
  const { initial, initialPageSize = 20 } = opts;
  return useFiltersPagination<PrsFilterState>({
    initial: initial || {},
    initialPageSize,
    resetKeys: ["repo", "state", "ownerUserId", "author", "q"],
  });
}
