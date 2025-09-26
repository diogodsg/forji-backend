import { useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { UserProfileEditor } from "@/features/settings/components/UserProfileEditor";
import type { UserProfile } from "@/features/settings/types/settings";

interface Props {
  open: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
}

export function EditUserProfileModal({
  open,
  user,
  onClose,
  onSuccess,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Focus management
      modalRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center !m-0">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative z-10 w-[min(96vw,680px)] max-h-[90vh] bg-white rounded-xl shadow-xl border border-surface-300/70 overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Editar Perfil do Usuário
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Atualize as informações de {user.name}
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Fechar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <UserProfileEditor
            user={user}
            isAdminMode={true}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
