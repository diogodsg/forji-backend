import type { UserRow } from "../types";
import { AdminUserRow } from "./AdminUserRow";

interface Props {
  users: UserRow[];
  filtered: UserRow[];
  loading: boolean;
  error: string | null;
  onToggleAdmin: (id: number, next: boolean) => Promise<void> | void;
  onUpdateGithub: (id: number, githubId: string | null) => Promise<void> | void;
  onAddManager: (userId: number, managerId: number) => Promise<void> | void;
  onRemoveManager: (userId: number, managerId: number) => Promise<void> | void;
  onRemove: (id: number) => Promise<void> | void;
}

export function AdminUsersTable({
  users,
  filtered,
  loading,
  error,
  onToggleAdmin,
  onUpdateGithub,
  onAddManager,
  onRemoveManager,
  onRemove,
}: Props) {
  if (loading) {
    return <div className="text-sm text-gray-500">Loading…</div>;
  }
  if (error) {
    return (
      <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-surface-300/70">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-100/70 text-gray-600 sticky top-0 z-10">
          <tr className="text-left">
            <th className="py-2.5 px-3 w-[42%]">Usuário</th>
            <th className="py-2.5 px-3 w-[12%]">Função</th>
            <th className="py-2.5 px-3 w-[18%]">GitHub</th>
            <th className="py-2.5 px-3 w-[20%]">Gerentes</th>
            <th className="py-2.5 px-3 w-[8%] text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200/70">
          {filtered.map((u) => (
            <AdminUserRow
              key={u.id}
              user={u}
              allUsers={users}
              onToggleAdmin={onToggleAdmin}
              onUpdateGithub={onUpdateGithub}
              onAddManager={onAddManager}
              onRemoveManager={onRemoveManager}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
