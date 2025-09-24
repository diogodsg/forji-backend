import { useState } from "react";
import { FiMoreHorizontal, FiEdit2 } from "react-icons/fi";
import type { TeamSummary } from "../types";

interface Props {
  filtered: TeamSummary[];
  loading: boolean;
  error: string | null;
  onSelect: (id: number) => void;
  selectedId: number | null;
  onRemove: (id: number) => Promise<void> | void;
  onRename?: (id: number, name: string) => Promise<void> | void;
}

export function AdminTeamsTable({
  filtered,
  loading,
  error,
  onSelect,
  selectedId,
  onRemove,
  onRename,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempName, setTempName] = useState("");

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  if (error)
    return (
      <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
        {error}
      </div>
    );

  function startEdit(t: TeamSummary) {
    setEditingId(t.id);
    setTempName(t.name);
  }
  async function commitEdit(id: number) {
    if (!tempName.trim()) return;
    await onRename?.(id, tempName.trim());
    setEditingId(null);
  }
  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-surface-300/70">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-100/70 text-gray-600">
          <tr className="text-left">
            <th className="py-2.5 px-3 w-[40%]">Equipe</th>
            <th className="py-2.5 px-3 w-[10%]">Managers</th>
            <th className="py-2.5 px-3 w-[10%]">Membros</th>
            <th className="py-2.5 px-3 w-[15%]">Criada</th>
            <th className="py-2.5 px-3 w-[25%] text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200/70">
          {filtered.map((t) => {
            const selected = selectedId === t.id;
            const editing = editingId === t.id;
            const initials = t.name
              .split(/\s+/)
              .slice(0, 2)
              .map((p) => p[0]?.toUpperCase())
              .join("");
            return (
              <tr
                key={t.id}
                className={`hover:bg-surface-50/80 ${
                  selected ? "bg-indigo-50/60" : ""
                }`}
                onClick={() => !editing && onSelect(t.id)}
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">
                      {initials || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editing ? (
                        <input
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit(t.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className="w-full rounded border border-indigo-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                        />
                      ) : (
                        <div className="font-medium text-gray-800 truncate flex items-center gap-2">
                          <span>{t.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(t);
                            }}
                            className="text-[10px] text-gray-400 hover:text-indigo-600 inline-flex items-center"
                            title="Renomear"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      {t.description && !editing && (
                        <div className="text-[11px] text-gray-500 line-clamp-1">
                          {t.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 tabular-nums">{t.managers}</td>
                <td className="py-2.5 px-3 tabular-nums">{t.members}</td>
                <td className="py-2.5 px-3 text-xs text-gray-500">
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="py-2.5 px-3 text-right">
                  {editing ? (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          commitEdit(t.id);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEdit();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <RowActions
                      id={t.id}
                      onSelect={onSelect}
                      onRemove={onRemove}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RowActions({
  id,
  onSelect,
  onRemove,
}: {
  id: number;
  onSelect: (id: number) => void;
  onRemove: (id: number) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mr-2"
      >
        Ver detalhes
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
          setConfirm(false);
        }}
        className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-surface-300 text-gray-500 hover:text-gray-700 hover:bg-white/70"
        title="Mais ações"
      >
        <FiMoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-40 rounded-md border border-surface-300 bg-white shadow-xl p-1 z-10 text-[11px]"
        >
          {!confirm && (
            <button
              onClick={() => setConfirm(true)}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-50 text-rose-600 font-medium"
            >
              Remover equipe
            </button>
          )}
          {confirm && (
            <div className="space-y-1">
              <p className="px-2 pt-1 text-[10px] text-gray-600 leading-snug">
                Confirmar remoção?
              </p>
              <div className="flex gap-1 px-1 pb-1">
                <button
                  onClick={async () => {
                    await onRemove(id);
                    setOpen(false);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded px-2 py-1"
                >
                  Remover
                </button>
                <button
                  onClick={() => {
                    setConfirm(false);
                    setOpen(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded px-2 py-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
