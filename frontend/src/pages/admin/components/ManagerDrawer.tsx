import { useState, useMemo } from "react";
import type { UserRow } from "../../../types/user";

interface Props {
  target: UserRow;
  allUsers: UserRow[];
  onClose: () => void;
  onAdd: (userId: number, managerId: number) => void;
  onRemove: (userId: number, managerId: number) => void;
}

export function ManagerDrawer({
  target,
  allUsers,
  onClose,
  onAdd,
  onRemove,
}: Props) {
  const [search, setSearch] = useState("");
  const current = useMemo(
    () => new Set(target.managers.map((m) => m.id)),
    [target.managers]
  );
  const filtered = useMemo(
    () =>
      allUsers.filter((u) =>
        [u.name, u.email].some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [allUsers, search]
  );
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[360px] max-w-full bg-white h-full shadow-xl border-l border-surface-300 flex flex-col">
        <div className="p-4 border-b border-surface-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Gerentes de {target.name}</h3>
            <p className="text-[11px] text-gray-500">
              Adicionar ou remover relações
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="p-3 border-b border-surface-200">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-md border border-surface-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          />
        </div>
        <div className="flex-1 overflow-auto">
          <ul className="divide-y divide-surface-200">
            {filtered.map((u) => {
              if (u.id === target.id) return null;
              const isCurrent = current.has(u.id);
              return (
                <li
                  key={u.id}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate text-gray-800">{u.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {u.email}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      isCurrent
                        ? onRemove(target.id, u.id)
                        : onAdd(target.id, u.id)
                    }
                    className={`px-2 py-1 rounded text-[11px] border ${
                      isCurrent
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-indigo-50 text-indigo-600 border-indigo-200"
                    }`}
                  >
                    {isCurrent ? "Remover" : "Adicionar"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-3 border-t border-surface-200 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded border border-surface-300 hover:bg-surface-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
