import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

interface UserRow {
  id: number;
  email: string;
  name: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
  managers: { id: number }[];
  reports: { id: number }[];
}

export default function AdminAccessPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<UserRow[]>("/auth/users", { auth: true });
      setUsers(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // no-op memo removed to avoid unused var
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      isAdmin: !!fd.get("isAdmin"),
    };
    setCreateError(null);
    try {
      await api("/auth/admin/create-user", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      });
      (e.currentTarget as HTMLFormElement).reset();
      await refresh();
      setShowCreate(false);
    } catch (err: any) {
      const msg = String(err?.message || "Erro ao criar usuário");
      // server sends message string; fallback for raw HTML/JSON
      if (/Email já está em uso/i.test(msg))
        setCreateError("Email já está em uso");
      else if (/P2002|unique/i.test(msg))
        setCreateError("Email já está em uso");
      else setCreateError("Falha ao criar usuário");
    }
  }

  async function setManager(userId: number, managerId: number) {
    if (!userId || !managerId) return;
    await api("/auth/admin/set-manager", {
      method: "POST",
      body: JSON.stringify({ userId, managerId }),
      auth: true,
    });
    await refresh();
  }

  async function removeManager(userId: number, managerId: number) {
    await api("/auth/admin/remove-manager", {
      method: "POST",
      body: JSON.stringify({ userId, managerId }),
      auth: true,
    });
    await refresh();
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
            <table className="min-w-full table-fixed text-sm">
              <thead className="bg-surface-100/70 text-gray-600 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="py-2.5 px-3 w-[44%]">Usuário</th>
                  <th className="py-2.5 px-3 w-[16%]">Permissões</th>
                  <th className="py-2.5 px-3 w-[40%]">Gerentes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200/70">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="bg-white/60 hover:bg-surface-50/80">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-xs font-semibold flex items-center justify-center">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {u.name}{" "}
                            <span className="text-gray-400">#{u.id}</span>
                          </div>
                          <div className="text-[12px] text-gray-500 truncate">
                            {u.email}
                            <span className="ml-2 text-[11px] text-gray-400">
                              · criado em{" "}
                              {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        {u.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-surface-100 border border-surface-300 rounded px-2 py-0.5">
                            Padrão
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {u.managers.map((m) => {
                          const mu = users.find((x) => x.id === m.id);
                          return (
                            <span
                              key={m.id}
                              className="inline-flex items-center text-[11px] bg-surface-200 border border-surface-300 rounded-full px-2 py-0.5"
                              title={mu ? `${mu.name} (#${mu.id})` : `#${m.id}`}
                            >
                              <span className="text-gray-700 max-w-[140px] sm:max-w-[180px] truncate">
                                {mu ? mu.name : `#${m.id}`}
                              </span>
                              <button
                                className="ml-1 text-rose-600 hover:text-rose-700"
                                onClick={() => removeManager(u.id, m.id)}
                                title="Remover"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                        <div className="shrink-0 basis-full sm:basis-auto sm:ml-auto">
                          <ManagerSetter
                            allUsers={users}
                            targetUserId={u.id}
                            onSet={setManager}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative z-10 w-[min(96vw,580px)] bg-white rounded-xl shadow-xl border border-surface-300/70 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold">Novo usuário</h3>
                <p className="text-xs text-gray-500">
                  Crie uma conta e, se necessário, conceda acesso de
                  administrador.
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowCreate(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            {createError && (
              <div className="mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                {createError}
              </div>
            )}
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end"
              onSubmit={createUser}
            >
              <FormField label="Nome" className="sm:col-span-2">
                <input
                  name="name"
                  required
                  placeholder="Ex.: Maria Silva"
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
                />
              </FormField>
              <FormField label="Email">
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="maria@empresa.com"
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
                />
              </FormField>
              <FormField label="Senha">
                <input
                  name="password"
                  required
                  type="password"
                  placeholder="••••••"
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
                />
              </FormField>
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  className="accent-indigo-600 h-4 w-4"
                />
                <label htmlFor="isAdmin" className="text-gray-700 select-none">
                  Admin
                </label>
              </div>
              <div className="sm:col-span-2 flex sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm border border-surface-300 hover:bg-surface-200"
                >
                  Cancelar
                </button>
                <button className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 shadow-sm">
                  Criar usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ManagerSetter({
  allUsers,
  targetUserId,
  onSet,
}: {
  allUsers: UserRow[];
  targetUserId: number;
  onSet: (userId: number, managerId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const target = allUsers.find((u) => u.id === targetUserId);
  const currentIds = new Set((target?.managers || []).map((m) => m.id));
  const options = allUsers.filter(
    (u) => u.id !== targetUserId && !currentIds.has(u.id)
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 h-9 px-3 rounded-md border border-surface-300 bg-white/80 text-sm text-gray-700 hover:bg-surface-100"
      >
        + Adicionar gerente
        <svg
          className={`w-3.5 h-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 max-h-60 overflow-auto rounded-md border border-surface-300 bg-white shadow-lg z-20">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">Sem opções</div>
          ) : (
            <ul className="py-1">
              {options.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSet(targetUserId, u.id);
                      setOpen(false);
                    }}
                    title={`#${u.id} · ${u.name}`}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-surface-100 text-gray-700"
                  >
                    <span className="inline-block max-w-[220px] truncate align-middle">
                      #{u.id} · {u.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`text-sm ${className || ""}`}>
      <span className="block text-[11px] uppercase tracking-wide text-gray-500 mb-1 font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}
