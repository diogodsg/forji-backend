/**
 * Generic pagination footer: page navigation + page size selector + total items.
 * Stateless: caller owns page/pageSize/total values.
 */

export interface PaginationFooterProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange?: (p: number) => void;
  onPageSizeChange?: (s: number) => void;
  className?: string;
  labels?: {
    prev?: string;
    next?: string;
    page?: string; // e.g. "Página"
    of?: string; // e.g. "de"
    itemsPerPage?: string; // e.g. "Itens por página"
    total?: string; // e.g. "Total"
  };
}

const defaultLabels = {
  prev: "Prev",
  next: "Next",
  page: "Página",
  of: "de",
  itemsPerPage: "Itens por página",
  total: "Total",
};

/**
 * Renders navigation and sizing controls; guards invalid page changes internally.
 */
export function PaginationFooter({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className = "",
  labels = defaultLabels,
}: PaginationFooterProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600 bg-white/60 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 order-2 sm:order-1">
        <button
          onClick={() => page > 1 && onPageChange?.(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 rounded border border-surface-300 disabled:opacity-40 bg-white hover:bg-surface-100"
        >
          {labels.prev}
        </button>
        <span className="px-2">
          {labels.page} <strong>{page}</strong> {labels.of}{" "}
          <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => page < totalPages && onPageChange?.(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 rounded border border-surface-300 disabled:opacity-40 bg-white hover:bg-surface-100"
        >
          {labels.next}
        </button>
      </div>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <span className="uppercase tracking-wide text-[10px] text-gray-500">
          {labels.itemsPerPage}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
          className="border border-surface-300 rounded-md bg-white/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-gray-400 hidden md:inline">•</span>
        <span className="text-gray-500">
          {labels.total} <strong>{totalItems}</strong>
        </span>
      </div>
    </div>
  );
}
