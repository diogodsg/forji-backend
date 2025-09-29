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
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((t) => {
        const selected = selectedId === t.id;
        const editing = editingId === t.id;
        const initials = t.name
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("");

        return (
          <div
            key={t.id}
            className={`bg-white/80 backdrop-blur border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md group ${
              selected
                ? "border-indigo-300 bg-indigo-50/60 shadow-md"
                : "border-surface-300/70 hover:border-surface-400/80"
            }`}
            onClick={() => !editing && onSelect(t.id)}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-semibold shrink-0">
                {initials || "?"}
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(t.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      className="w-full rounded border border-indigo-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    />
                    <div className="flex gap-2">
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
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-gray-800 truncate flex items-center gap-2">
                      <span className="text-sm">{t.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(t);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 inline-flex items-center transition-opacity"
                        title="Renomear"
                      >
                        <FiEdit2 className="w-3 h-3" />
                      </button>
                    </div>
                    {t.description && (
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {t.description}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!editing && (
                <RowActions id={t.id} onSelect={onSelect} onRemove={onRemove} />
              )}
            </div>

            {!editing && (
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex gap-4">
                  <span>
                    {t.managers} manager{t.managers !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {t.members} membro{t.members !== 1 ? "s" : ""}
                  </span>
                </div>
                <span>
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            )}
          </div>
        );
      })}
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
