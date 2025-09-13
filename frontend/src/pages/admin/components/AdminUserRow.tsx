import { useEffect, useState } from "react";
import type { UserRow } from "../../../features/admin";
import { RowMenu } from "./RowMenu";

interface Props {
  user: UserRow;
  allUsers: UserRow[];
  onToggleAdmin: (id: number, next: boolean) => void;
  onUpdateGithub: (id: number, gh: string | null) => void;
  onOpenManagers: (id: number) => void;
  onRemove: (id: number) => void;
}

export function AdminUserRow({
  user,
  allUsers,
  onToggleAdmin,
  onUpdateGithub,
  onOpenManagers,
  onRemove,
}: Props) {
  const [editingGh, setEditingGh] = useState(false);
  const [ghValue, setGhValue] = useState(user.githubId || "");
  useEffect(() => setGhValue(user.githubId || ""), [user.githubId]);

  const managerNames = user.managers
    .map((m) => allUsers.find((x) => x.id === m.id)?.name || `#${m.id}`)
    .slice(0, 2);
  const extra = user.managers.length - managerNames.length;

  return (
    <tr className="group bg-white/60 hover:bg-surface-50/80">
      <td className="py-2.5 px-3 align-top">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-xs font-semibold flex items-center justify-center">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-gray-800 truncate">
              {user.name} <span className="text-gray-400">#{user.id}</span>
            </div>
            <div className="text-[12px] text-gray-500 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3 align-top">
        <button
          onClick={() => onToggleAdmin(user.id, !user.isAdmin)}
          className={`px-2 py-1 rounded text-[11px] font-medium border transition ${
            user.isAdmin
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-surface-100 text-gray-600 border-surface-300"
          }`}
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
            className="flex flex-col gap-1"
          >
            <input
              value={ghValue}
              onChange={(e) => setGhValue(e.target.value)}
              placeholder="login"
              className="w-32 rounded-md border border-surface-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex gap-1">
              <button className="px-2 py-0.5 text-[11px] rounded bg-indigo-600 text-white">
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditingGh(false)}
                className="px-2 py-0.5 text-[11px] rounded border border-surface-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-700">
              {user.githubId ? `@${user.githubId}` : "—"}
            </span>
            <button
              onClick={() => setEditingGh(true)}
              className="opacity-0 group-hover:opacity-100 text-xs text-indigo-600"
            >
              {user.githubId ? "Editar" : "Definir"}
            </button>
            {user.githubId && (
              <button
                onClick={() => onUpdateGithub(user.id, null)}
                className="opacity-0 group-hover:opacity-100 text-xs text-rose-600"
              >
                Limpar
              </button>
            )}
          </div>
        )}
      </td>
      <td className="py-2.5 px-3 align-top">
        <div className="flex items-center gap-1 flex-wrap">
          {managerNames.map((n) => (
            <span
              key={n}
              className="px-2 py-0.5 rounded-full bg-surface-200 border border-surface-300 text-[11px] text-gray-700"
            >
              {n}
            </span>
          ))}
          {extra > 0 && (
            <button
              onClick={() => onOpenManagers(user.id)}
              className="text-[11px] text-indigo-600"
            >
              +{extra}
            </button>
          )}
          <button
            onClick={() => onOpenManagers(user.id)}
            className="text-[11px] text-gray-500 hover:text-indigo-600"
          >
            Gerenciar
          </button>
        </div>
      </td>
      <td className="py-2.5 px-3 align-top text-right">
        <RowMenu
          onEditGithub={() => setEditingGh(true)}
          onOpenManagers={() => onOpenManagers(user.id)}
          onToggleAdmin={() => onToggleAdmin(user.id, !user.isAdmin)}
          isAdmin={!!user.isAdmin}
          onRemove={() => onRemove(user.id)}
        />
      </td>
    </tr>
  );
}
