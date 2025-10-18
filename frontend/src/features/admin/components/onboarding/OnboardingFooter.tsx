import { Sparkles, Rocket } from "lucide-react";
import type { OnboardingStep } from "./types";

interface OnboardingFooterProps {
  currentStep: number;
  steps: OnboardingStep[];
  isCreatingNewUser: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function OnboardingFooter({
  currentStep,
  steps,
  isCreatingNewUser,
  isSubmitting = false,
  onBack,
  onNext,
  onConfirm,
  onClose,
}: OnboardingFooterProps) {
  const isLastStep = currentStep === steps.length - 1;
  const canContinue = steps[currentStep].completed;

  return (
    <div className="px-6 py-4 border-t border-surface-300 flex justify-between">
      <button
        onClick={currentStep > 0 ? onBack : onClose}
        className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 px-4 transition-all duration-200 hover:bg-surface-100 focus:ring-2 focus:ring-brand-400 focus:outline-none"
      >
        {currentStep > 0 ? "← Voltar" : "Cancelar"}
      </button>

      <div className="flex gap-3">
        {!isLastStep ? (
          <button
            onClick={onNext}
            disabled={!canContinue}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-6 transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        ) : (
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-success-500 to-success-600 text-white font-medium text-sm h-10 px-6 transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-success-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isCreatingNewUser ? "Criando..." : "Aplicando..."}
              </>
            ) : isCreatingNewUser ? (
              <>
                <Sparkles className="w-4 h-4" />
                Criar e Organizar
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Aplicar Onboarding
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
