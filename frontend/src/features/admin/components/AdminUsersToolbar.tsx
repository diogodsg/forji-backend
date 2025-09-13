// Toolbar for filtering and creating users

interface Props {
  query: string;
  setQuery: (v: string) => void;
  onNew: () => void;
}

export function AdminUsersToolbar({ query, setQuery, onNew }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <h2 className="text-base font-semibold">Users</h2>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="w-72 max-w-full rounded-md border border-surface-300 pl-3 pr-8 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ⌘K
          </span>
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 shadow-sm"
          title="Create new user"
        >
          New user
        </button>
      </div>
    </div>
  );
}
