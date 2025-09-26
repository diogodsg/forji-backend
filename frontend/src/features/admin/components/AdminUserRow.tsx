import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/features/auth";
import type { AdminUser } from "../types";
import { ManagerPickerPopover } from "./ManagerPickerPopover";
import { FiTrash2 } from "react-icons/fi";

interface Props {
  user: AdminUser;
  allUsers: AdminUser[];
  onToggleAdmin: (id: number, next: boolean) => void;
  onUpdateGithub: (id: number, gh: string | null) => void;
  onAddManager: (userId: number, managerId: number) => void;
  onRemoveManager: (userId: number, managerId: number) => void;
  onRemove: (id: number) => void;
}

export function AdminUserRow({
  user,
  allUsers,
  onToggleAdmin,
  onUpdateGithub,
  onAddManager,
  onRemoveManager,
  onRemove,
}: Props) {
  const { user: me } = useAuth();
  const isSelf = me?.id === user.id;
  const [editingGh, setEditingGh] = useState(false);
  const [ghValue, setGhValue] = useState(user.githubId || "");
  useEffect(() => setGhValue(user.githubId || ""), [user.githubId]);

  // Filtrar self e mapear managers
  const managersData = useMemo(
    () =>
      user.managers
        .filter((m) => m.id !== user.id)
        .map((m) => {
          const ref = allUsers.find((x) => x.id === m.id);
          return {
            id: m.id,
            name: ref?.name || `#${m.id}`,
            initial: (ref?.name?.[0] || "?").toUpperCase(),
          };
        }),
    [user.managers, allUsers, user.id]
  );
  const totalManagers = managersData.length;
  const visible = managersData.slice(0, 3);
  const extra = totalManagers - visible.length;

  const [openManagers, setOpenManagers] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const mgrAnchorRef = useRef<HTMLDivElement | null>(null);
  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (openManagers && mgrAnchorRef.current) {
      const rect = mgrAnchorRef.current.getBoundingClientRect();
      // Position below and left-aligned to anchor, within viewport
      const top = Math.min(
        window.innerHeight - 8,
        rect.bottom + window.scrollY + 4
      );
      const left = Math.max(
        8,
        Math.min(rect.left + window.scrollX, window.innerWidth - 320)
      );
      setPopoverPos({ top, left });
    }
  }, [openManagers]);
  return (
    <tr className="group bg-white/60 hover:bg-surface-100/80 transition-colors relative">
      <td className="py-2.5 px-3 align-top">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-xs font-semibold flex items-center justify-center">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-800 truncate">
              {user.name}{" "}
              <span className="text-gray-300 text-[11px] align-middle">
                #{user.id}
              </span>
            </div>
            <div className="text-[12px] text-gray-500 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 align-top">
        <button
          onClick={() => {
            // Evita remover o próprio acesso admin
            if (isSelf && user.isAdmin) return;
            onToggleAdmin(user.id, !user.isAdmin);
          }}
          disabled={isSelf && user.isAdmin}
          className={`px-2 py-1 rounded text-[11px] font-medium border transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
            user.isAdmin
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-surface-100 text-gray-600 border-surface-300 hover:bg-surface-200"
          } ${
            isSelf && user.isAdmin
              ? "opacity-60 cursor-not-allowed hover:bg-emerald-50"
              : ""
          }`}
          title={
            isSelf && user.isAdmin
              ? "Você não pode remover seu próprio acesso admin"
              : user.isAdmin
              ? "Clique para remover acesso admin"
              : "Clique para tornar admin"
          }
        >
          {user.isAdmin ? "Admin" : "Padrão"}
        </button>
      </td>
      <td className="py-2.5 px-3 align-top">
        {editingGh ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateGithub(user.id, ghValue.trim() || null);
              setEditingGh(false);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={ghValue}
              autoFocus
              onChange={(e) => setGhValue(e.target.value)}
              placeholder="login"
              className="w-32 rounded-md border border-surface-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              className="px-2 py-1 text-[11px] rounded bg-indigo-600 text-white hover:bg-indigo-500"
              title="Salvar GitHub"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingGh(false);
                setGhValue(user.githubId || "");
              }}
              className="px-2 py-1 text-[11px] rounded border border-surface-300 hover:bg-surface-100"
            >
              Cancelar
            </button>
            {user.githubId && (
              <button
                type="button"
                onClick={() => {
                  onUpdateGithub(user.id, null);
                  setGhValue("");
                  setEditingGh(false);
                }}
                className="px-2 py-1 text-[11px] rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                title="Limpar GitHub"
              >
                Limpar
              </button>
            )}
          </form>
        ) : (
          <button
            onClick={() => setEditingGh(true)}
            className="text-[13px] text-gray-700 hover:text-indigo-600 underline decoration-dotted"
            title={user.githubId ? "Editar GitHub" : "Definir GitHub"}
          >
            {user.githubId ? `@${user.githubId}` : "Definir"}
          </button>
        )}
      </td>
      <td className="py-2.5 px-3 align-top">
        <div className="flex items-center gap-2" ref={mgrAnchorRef}>
          {totalManagers === 0 ? (
            <button
              onClick={() => setOpenManagers((v) => !v)}
              className="text-[11px] text-gray-500 hover:text-indigo-600"
            >
              Definir
            </button>
          ) : (
            <div className="flex items-center">
              <AvatarStack
                avatars={visible}
                extra={extra}
                onClick={() => setOpenManagers((v) => !v)}
              />
              <button
                onClick={() => setOpenManagers((v) => !v)}
                className="ml-2 text-[11px] text-gray-500 hover:text-indigo-600"
              >
                Gerenciar
              </button>
            </div>
          )}
          {openManagers &&
            popoverPos &&
            createPortal(
              <div
                style={{
                  position: "absolute",
                  top: popoverPos.top,
                  left: popoverPos.left,
                  zIndex: 1000,
                }}
              >
                <ManagerPickerPopover
                  target={user}
                  allUsers={allUsers}
                  onAdd={onAddManager}
                  onRemove={onRemoveManager}
                  onClose={() => setOpenManagers(false)}
                />
              </div>,
              document.body
            )}
        </div>
      </td>
      <td className="py-2.5 px-3 align-top text-right">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-2 py-1 rounded border border-surface-300 bg-white text-rose-600 text-xs hover:bg-rose-50 inline-flex items-center justify-center"
            title="Remover usuário"
            aria-label="Remover usuário"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => onRemove(user.id)}
              className="px-2 py-1 rounded bg-rose-600 text-white text-xs hover:bg-rose-500"
            >
              Confirmar
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 rounded border border-surface-300 text-xs text-gray-600 hover:bg-surface-100"
            >
              Cancelar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

interface AvatarStackItem {
  id: number;
  name: string;
  initial: string;
}
function AvatarStack({
  avatars,
  extra,
  onClick,
}: {
  avatars: AvatarStackItem[];
  extra: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex -space-x-2 items-center group"
      title={
        avatars.map((a) => a.name).join(", ") +
        (extra > 0 ? ` (+${extra})` : "")
      }
    >
      {avatars.map((a) => (
        <span
          key={a.id}
          className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-white shadow-sm bg-gradient-to-br from-indigo-500 to-sky-500 text-[11px] font-semibold text-white ring-1 ring-surface-300"
        >
          {a.initial}
        </span>
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-surface-200 border border-surface-300 text-[11px] font-medium text-gray-600 ring-1 ring-surface-300">
          +{extra}
        </span>
      )}
    </button>
  );
}
