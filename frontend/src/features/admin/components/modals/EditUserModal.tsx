import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { User, Briefcase, FileText, X } from "lucide-react";
import type { AdminUser } from "../../types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
  onUpdate: (
    userId: string,
    data: { name?: string; position?: string; bio?: string }
  ) => Promise<void>;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [position, setPosition] = useState(user.position || "");
  const [bio, setBio] = useState(user.bio || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setPosition(user.position || "");
      setBio(user.bio || "");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onUpdate(user.id, {
        name: name.trim(),
        position: position.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-modal-title"
    >
      <div className="bg-white rounded-2xl border border-surface-300 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-300 bg-gradient-to-r from-white to-surface-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  id="edit-user-modal-title"
                  className="text-xl font-semibold text-gray-800 tracking-tight"
                >
                  Editar Pessoa
                </h2>
                <p className="text-xs text-gray-500">
                  Atualize as informações básicas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 w-10 transition-all duration-200 hover:bg-surface-100 focus:ring-2 focus:ring-brand-400 focus:outline-none"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-surface-200 bg-surface-50 text-gray-500 text-sm cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              O email não pode ser alterado
            </p>
          </div>

          {/* Nome */}
          <div>
            <label
              htmlFor="edit-name"
              className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2"
            >
              <User className="w-4 h-4 text-brand-600" />
              Nome completo <span className="text-error-500">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200"
              placeholder="Ex: Maria da Silva"
              required
            />
          </div>

          {/* Cargo */}
          <div>
            <label
              htmlFor="edit-position"
              className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2"
            >
              <Briefcase className="w-4 h-4 text-brand-600" />
              Cargo{" "}
              <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <input
              id="edit-position"
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200"
              placeholder="Ex: Desenvolvedora Frontend"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="edit-bio"
              className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2"
            >
              <FileText className="w-4 h-4 text-brand-600" />
              Biografia{" "}
              <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200 resize-none"
              placeholder="Breve descrição sobre a pessoa..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-300 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 px-4 transition-all duration-200 hover:bg-surface-100 focus:ring-2 focus:ring-brand-400 focus:outline-none"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-6 transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
