import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface WizardFooterProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

export default function WizardFooter({
  currentStep,
  onPrevious,
  onNext,
  onSubmit,
  canProceed,
  isSubmitting,
}: WizardFooterProps) {
  return (
    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
            ${
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {currentStep < 2 ? (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all
              ${
                canProceed
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all
              ${
                canProceed && !isSubmitting
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? "Salvando..." : "Concluir 1:1"}
          </button>
        )}
      </div>
    </div>
  );
}
