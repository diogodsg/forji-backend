// No need to import React explicitly (React 19 JSX runtime)

/** Full-screen centered loading spinner (auth / app bootstrap). */
export function ScreenLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-50">
      <div className="flex flex-col items-center gap-3 text-gray-600 text-sm">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

/** Section / route level loading placeholder (non-blocking layout). */
export function PageLoading({ label = "Loading page..." }: { label?: string }) {
  return (
    <div
      className="p-10 text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );
}

/** Lightweight login specific loading state. */
export function LoginLoading({
  label = "Loading login...",
}: {
  label?: string;
}) {
  return (
    <div
      className="p-10 text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );
}
