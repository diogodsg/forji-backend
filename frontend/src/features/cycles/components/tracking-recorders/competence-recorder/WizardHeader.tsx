import { Award, X } from "lucide-react";

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
}

export function WizardHeader({
  currentStep,
  totalSteps,
  onClose,
}: WizardHeaderProps) {
  const stepTitles = ["Informações Básicas", "Detalhes e Evidências"];

  return (
    <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-4 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Registrar Competência</h2>
            <p className="text-sm text-brand-100">
              {stepTitles[currentStep - 1]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i + 1 === currentStep
                    ? "w-8 bg-white"
                    : i + 1 < currentStep
                    ? "w-2 bg-white"
                    : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
