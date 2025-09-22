import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminUser } from "../types";

interface ManagerPickerPopoverProps {
  target: AdminUser; // user whose managers we're editing
  allUsers: AdminUser[];
  onAdd: (userId: number, managerId: number) => void | Promise<void>;
  onRemove: (userId: number, managerId: number) => void | Promise<void>;
  onClose: () => void;
  align?: "left" | "right";
}

// Lightweight popover inspired by GitHub style assignee picker.
// Contains:
// - Search input filtering by name/email (case-insensitive)
// - Section of already selected managers (click to remove)
// - Section of remaining eligible users (click to add)
// - Keyboard: Esc closes, ArrowDown focuses first list item
// Simplicity over full accessibility framework for now (follow-up could add roving tabindex + aria roles)
export function ManagerPickerPopover({
  target,
  allUsers,
  onAdd,
  onRemove,
  onClose,
  align = "left",
}: ManagerPickerPopoverProps) {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentIds = useMemo(
    () => new Set(target.managers.map((m) => m.id)),
    [target.managers]
  );

  const eligible = useMemo(
    () =>
      allUsers
        .filter((u) => u.id !== target.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allUsers, target.id]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eligible;
    return eligible.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [eligible, query]);

  // Split lists
  const selectedList = filtered.filter((u) => currentIds.has(u.id));
  const unselectedList = filtered.filter((u) => !currentIds.has(u.id));

  // Close on outside click
  useEffect(() => {
    function handle(ev: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(ev.target as Node)
      ) {
        onClose();
      }
    }
    function handleKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const section = (title: string, users: AdminUser[], emptyLabel?: string) => (
    <div>
      <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </div>
      {users.length === 0 ? (
        <div className="px-2 py-1 text-[12px] text-gray-500">
          {emptyLabel || "Nenhum"}
        </div>
      ) : (
        <ul className="max-h-40 overflow-auto">
          {users.map((u) => {
            const isSelected = currentIds.has(u.id);
            return (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() =>
                    isSelected
                      ? onRemove(target.id, u.id)
                      : onAdd(target.id, u.id)
                  }
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-[13px] hover:bg-surface-100 transition ${
                    isSelected ? "text-indigo-600" : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-[11px] font-semibold">
                    {u.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="truncate">{u.name}</span>
                  <span className="ml-auto text-[11px] text-gray-400 truncate">
                    {isSelected ? "Remover" : "Adicionar"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`absolute z-40 w-72 rounded-md border border-surface-300 bg-white shadow-xl overflow-hidden ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      <div className="p-2 border-b border-surface-200">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar nome ou email…"
          className="w-full rounded-md border border-surface-300 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
        />
      </div>
      <div className="divide-y divide-surface-200 max-h-96 overflow-auto">
        {section("Gerentes", selectedList, "Nenhum gerente definido")}
        {section("Pessoas", unselectedList, "Nenhum resultado")}
      </div>
      <div className="p-1 border-t border-surface-200 text-right">
        <button
          onClick={onClose}
          className="text-[11px] px-2 py-1 rounded border border-surface-300 hover:bg-surface-100 text-gray-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
