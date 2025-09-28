import { Skeleton } from "../../../shared";

export function PdiPageSkeleton() {
  return (
    <div className="space-y-10" aria-hidden="true">
      {/* Stat Grid Placeholder */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 animate-pulse" />
              <Skeleton className="h-3 w-24" tone="light" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-2 w-12" tone="light" />
          </div>
        ))}
      </div>

      {/* Section Cards */}
      <div className="space-y-8">
        {["Key Results", "Competências e Resultados"].map((title) => (
          <div
            key={title}
            className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-100 animate-pulse" />
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {title}
                  </div>
                  <Skeleton className="h-2 w-28 mt-2" tone="light" />
                </div>
              </div>
              <Skeleton className="h-7 w-16" />
            </div>
            {/* Fake content rows */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, r) => (
                <div
                  key={r}
                  className="rounded-md border border-surface-200 bg-surface-50 px-4 py-3 flex items-center gap-4"
                >
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-24" tone="light" />
                  <Skeleton className="h-4 w-14" tone="light" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
