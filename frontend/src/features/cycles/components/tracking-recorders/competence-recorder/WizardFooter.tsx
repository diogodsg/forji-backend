import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  totalXP: number;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function WizardFooter({
  currentStep,
  totalSteps,
  isStepValid,
  totalXP,
  isSubmitting = false,
  onPrevious,
  onNext,
  onSubmit,
}: WizardFooterProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 bg-surface-50 rounded-b-2xl">
      <div className="text-sm text-gray-600">
        {isLastStep ? (
          <span className="font-medium text-brand-600">
            Pronto para registrar sua competência!
          </span>
        ) : (
          <span>
            Passo {currentStep} de {totalSteps}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isFirstStep && (
          <button
            onClick={onPrevious}
            className="px-4 py-2 text-gray-700 hover:bg-surface-100 rounded-lg transition-colors duration-200 flex items-center gap-2 border border-surface-300"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
        )}

        {!isLastStep ? (
          <button
            onClick={onNext}
            disabled={!isStepValid}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              isStepValid
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90"
                : "bg-surface-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!isStepValid || isSubmitting}
            className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
              isStepValid && !isSubmitting
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90"
                : "bg-surface-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>Concluir Competência (+{totalXP} XP)</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
