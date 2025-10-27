import { useState, useMemo } from "react";
import type { AdminUser } from "@/features/admin/types";

interface Props {
  target: AdminUser;
  allUsers: AdminUser[];
  onClose: () => void;
  onAdd: (userId: string, managerId: string) => void;
  onRemove: (userId: string, managerId: string) => void;
}

export function ManagerDrawer({
  target,
  allUsers,
  onClose,
  onAdd,
  onRemove,
}: Props) {
  const currentSet = useMemo(
    () => new Set(target.managers.map((m) => m.id)),
    [target.managers]
  );
  // Elegíveis = todos menos self e já gerentes
  const eligible = useMemo(
    () =>
      allUsers
        .filter((u) => u.id !== target.id && !currentSet.has(u.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allUsers, target.id, currentSet]
  );
  const [selectedId, setSelectedId] = useState<string>("");
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
        <div className="p-3 border-b border-surface-200 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">
              Adicionar novo gerente
            </label>
            <div className="flex gap-2">
              <select
                value={selectedId === "" ? "" : String(selectedId)}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedId(v || "");
                }}
                className="flex-1 rounded-xl border border-surface-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/60"
              >
                <option value="">Selecionar usuário…</option>
                {eligible.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                disabled={selectedId === ""}
                onClick={() => {
                  if (selectedId !== "") {
                    onAdd(target.id, selectedId);
                    setSelectedId("");
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition border ${
                  selectedId === ""
                    ? "bg-surface-100 text-gray-400 border-surface-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-600 to-brand-700 text-white border-brand-600 hover:from-brand-700 hover:to-brand-800"
                }`}
              >
                Adicionar
              </button>
            </div>
            {eligible.length === 0 && (
              <p className="mt-1 text-[11px] text-gray-500">
                Nenhum usuário elegível restante.
              </p>
            )}
          </div>
          <div className="text-[11px] text-gray-500">
            Gerentes atuais ({target.managers.length})
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {target.managers.length === 0 ? (
            <div className="p-4 text-[12px] text-gray-500">
              Nenhum gerente definido.
            </div>
          ) : (
            <ul className="divide-y divide-surface-200">
              {target.managers.map((m) => {
                const ref = allUsers.find((u) => u.id === m.id);
                if (!ref) return null;
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-gray-800">{ref.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {ref.email}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(target.id, m.id)}
                      className="px-2 py-1 rounded text-[11px] border bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                    >
                      Remover
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
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
