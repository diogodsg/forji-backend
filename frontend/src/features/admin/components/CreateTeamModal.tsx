import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description?: string }) => Promise<void>;
  creating: boolean;
  error: string | null;
}

export function CreateTeamModal({
  open,
  onClose,
  onCreate,
  creating,
  error,
}: Props) {
  const [localError, setLocalError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const prevCreating = useRef(false);
  useEffect(() => {
    if (prevCreating.current && !creating && open && !error && !localError) {
      formRef.current?.reset();
      onClose();
    }
    prevCreating.current = creating;
  }, [creating, open, error, localError, onClose]);
  if (!open) return null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      description: (String(fd.get("description") || "").trim() || undefined) as
        | string
        | undefined,
    };
    setLocalError(null);
    try {
      await onCreate(payload);
    } catch (err: any) {
      setLocalError(err?.message || "Erro ao criar equipe");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center !m-0">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-[min(96vw,520px)] bg-white rounded-xl shadow-xl border border-surface-300/70 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Nova equipe</h3>
            <p className="text-xs text-gray-500">
              Crie uma nova equipe para organizar membros e managers.
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
        <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Nome</label>
            <input
              name="name"
              required
              placeholder="Ex.: Plataforma"
              className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Opcional"
              className="w-full resize-none rounded-md border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 bg-white/80"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
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
              {creating ? "Criando..." : "Criar equipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
