import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { UserRow } from "../types/user";
import { useAdminUsers } from "./admin/hooks/useAdminUsers";
import { AdminUserRow } from "./admin/components/AdminUserRow";
import { ManagerDrawer } from "./admin/components/ManagerDrawer";
import { CreateUserModal } from "./admin/components/CreateUserModal";

export default function AdminAccessPage() {
  const { user } = useAuth();
  const {
    users,
    loading,
    error,
    create,
    setGithub: setGithubId,
    toggleAdmin,
    removeUser: deleteUser,
    addManager: setManager,
    removeManager,
    busy,
  } = useAdminUsers();
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [managerDrawerUser, setManagerDrawerUser] = useState<UserRow | null>(
    null
  );

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function handleCreateUser(data: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    githubId?: string;
  }) {
    setCreateError(null);
    try {
      await create(data as any);
    } catch (err: any) {
      const msg = String(err?.message || "");
      let display: string;
      if (/Email já está em uso/i.test(msg)) display = "Email já está em uso";
      else if (/githubId.+uso|github/i.test(msg))
        display = "githubId já está em uso";
      else display = "Falha ao criar usuário";
      setCreateError(display);
      throw new Error(display);
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur border border-rose-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-rose-700">Acesso negado</h2>
          <p className="text-sm text-rose-600 mt-1">
            Esta página é restrita a administradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
          Administração
        </h1>
        <p className="text-sm text-gray-500">
          Gerencie contas, permissões e relações de gestão.
        </p>
      </header>

      <section className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold">Usuários</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou email…"
                className="w-72 max-w-full rounded-md border border-surface-300 pl-3 pr-8 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ⌘K
              </span>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700 shadow-sm"
              title="Criar novo usuário"
            >
              Novo usuário
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-sm text-gray-500">Carregando…</div>
        ) : error ? (
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
            {error}
          </div>
        ) : (
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
                {filteredUsers.map((u) => (
                  <AdminUserRow
                    key={u.id}
                    user={u}
                    allUsers={users}
                    onToggleAdmin={toggleAdmin}
                    onUpdateGithub={setGithubId}
                    onOpenManagers={(id) =>
                      setManagerDrawerUser(
                        users.find((x) => x.id === id) || null
                      )
                    }
                    onRemove={deleteUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateUser}
        creating={busy.creating}
        error={createError}
      />
      {managerDrawerUser && (
        <ManagerDrawer
          target={managerDrawerUser}
          allUsers={users}
          onClose={() => setManagerDrawerUser(null)}
          onAdd={setManager}
          onRemove={removeManager}
        />
      )}
    </div>
  );
}
