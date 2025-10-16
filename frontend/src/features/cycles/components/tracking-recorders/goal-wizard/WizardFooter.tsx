import { ChevronRight, ChevronLeft } from "lucide-react";

interface WizardFooterProps {
  currentStep: number;
  isStep1Valid: boolean;
  isStep2Valid: boolean;
  xpTotal: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function WizardFooter({
  currentStep,
  isStep1Valid,
  isStep2Valid,
  xpTotal,
  onBack,
  onNext,
  onCancel,
}: WizardFooterProps) {
  return (
    <div className="flex gap-3 px-8 py-4">
      {currentStep === 1 && (
        <>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!isStep1Valid}
            className="flex-1 px-5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 text-sm"
          >
            Próximo: Tipo e Critérios
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {currentStep === 2 && (
        <>
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
          <button
            type="submit"
            disabled={!isStep2Valid}
            className="flex-1 px-5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 text-sm"
          >
            Criar Meta (+{xpTotal} XP)
          </button>
        </>
      )}
    </div>
  );
}
