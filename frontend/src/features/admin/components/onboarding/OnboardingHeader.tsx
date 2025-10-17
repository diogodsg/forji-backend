import { Settings, X } from "lucide-react";

interface OnboardingHeaderProps {
  isCreatingNewUser: boolean;
  userCount: number;
  onClose: () => void;
}

export function OnboardingHeader({
  isCreatingNewUser,
  userCount,
  onClose,
}: OnboardingHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-surface-300 bg-gradient-to-r from-white to-surface-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2
              id="onboarding-modal-title"
              className="text-2xl font-semibold text-gray-800 tracking-tight"
            >
              {isCreatingNewUser
                ? "Adicionar Nova Pessoa"
                : "Onboarding Guiado"}
            </h2>
            <p className="text-xs text-gray-500">
              {isCreatingNewUser
                ? "Configure dados e posição na organização"
                : `Organize ${userCount} pessoa${
                    userCount > 1 ? "s" : ""
                  } na estrutura`}
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
  );
}
