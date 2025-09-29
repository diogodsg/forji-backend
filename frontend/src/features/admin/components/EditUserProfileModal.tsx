import { useRef, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { UserProfileEditor } from "@/features/settings/components/UserProfileEditor";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useAdminUsers } from "../hooks/useAdminUsers";
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { changePassword } = useAdminUsers();

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
          
          {/* Seção de Alteração de Senha */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">
                  Alterar Senha
                </h4>
                <p className="text-sm text-gray-600">
                  Defina uma nova senha para este usuário
                </p>
              </div>
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      <ChangePasswordModal
        user={{
          ...user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          managers: [],
          reports: []
        }}
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onChangePassword={async (userId: number, newPassword?: string) => {
          try {
            const result = await changePassword(userId, newPassword);
            return result;
          } catch (error) {
            return { success: false };
          }
        }}
      />
    </div>
  );
}
