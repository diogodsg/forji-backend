import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Users, X } from "lucide-react";
import { useAdminTeams } from "@/features/admin/hooks/useAdminTeams";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreated,
}: CreateTeamModalProps) {
  const { create, creating } = useAdminTeams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating || !name.trim()) return;

    try {
      // Aguardar criação + refresh antes de fechar
      await create({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // Callback para garantir refresh no componente pai
      if (onCreated) {
        await onCreated();
      }

      // Fechar modal após criação bem-sucedida
      onClose();
    } catch (err) {
      // Erro já tratado pelo hook com toast
      console.error("Erro ao criar team:", err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !creating) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !creating) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-team-modal-title"
    >
      <div className="bg-white rounded-2xl border border-surface-300 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-300 bg-gradient-to-r from-brand-500 to-brand-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  id="create-team-modal-title"
                  className="text-lg font-semibold text-white"
                >
                  Nova Equipe
                </h2>
                <p className="text-sm text-brand-100">
                  Crie uma nova equipe para organizar membros
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={creating}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Nome da Equipe */}
            <div>
              <label
                htmlFor="team-name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nome da Equipe *
              </label>
              <input
                id="team-name"
                type="text"
                placeholder="Ex: Frontend, Backend, DevOps..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={creating}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Escolha um nome claro e descritivo para a equipe
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label
                htmlFor="team-description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Descrição
              </label>
              <textarea
                id="team-description"
                placeholder="Descreva o propósito, responsabilidades e objetivos da equipe..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={creating}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Opcional: Ajuda outros membros a entender o papel da equipe
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-brand-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-900 mb-1">
                    Próximos Passos
                  </p>
                  <p className="text-sm text-brand-700">
                    Após criar a equipe, você poderá adicionar membros e
                    designar líderes na tela de edição.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-surface-300 bg-gradient-to-r from-white to-surface-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="px-5 h-11 text-gray-600 hover:bg-surface-100 rounded-lg font-semibold text-sm transition-all duration-200 border border-surface-300 hover:border-surface-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold text-sm h-11 px-5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users className="w-4 h-4" />
              {creating ? "Criando..." : "Criar Equipe"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
