import { useState } from "react";
import type { FormEvent } from "react";
import { FormField } from "./FormField";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    githubId?: string;
  }) => Promise<void>;
  creating: boolean;
  error: string | null;
}

export function CreateUserModal({
  open,
  onClose,
  onCreate,
  creating,
  error,
}: Props) {
  const [localError, setLocalError] = useState<string | null>(null);
  if (!open) return null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      isAdmin: !!fd.get("isAdmin"),
      githubId: (String(fd.get("githubId") || "").trim() || undefined) as
        | string
        | undefined,
    };
    setLocalError(null);
    try {
      await onCreate(payload);
      (e.currentTarget as HTMLFormElement).reset();
      onClose();
    } catch (err: any) {
      setLocalError(err?.message || "Erro ao criar");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center !m-0">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-[min(96vw,580px)] bg-white rounded-xl shadow-xl border border-surface-300/70 p-6 ">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Novo usuário</h3>
            <p className="text-xs text-gray-500">
              Crie uma conta e, se necessário, conceda acesso de administrador.
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        {(error || localError) && (
          <div className="mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
            {error || localError}
          </div>
        )}
        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end"
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
              type="email"
              required
              placeholder="maria@empresa.com"
              className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
            />
          </FormField>
          <FormField label="Senha">
            <input
              name="password"
              type="password"
              required
              placeholder="••••••"
              className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
            />
          </FormField>
          <FormField label="GitHub ID (login)">
            <input
              name="githubId"
              placeholder="ex.: octocat"
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
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm border border-surface-300 hover:bg-surface-200"
            >
              Cancelar
            </button>
            <button
              disabled={creating}
              className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 shadow-sm disabled:opacity-60"
            >
              {creating ? "Criando..." : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
