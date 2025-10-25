import { X, Target } from "lucide-react";

interface WizardHeaderProps {
  currentStep: number;
  onClose: () => void;
  isEditing?: boolean;
}

export default function WizardHeader({
  currentStep,
  onClose,
  isEditing = false,
}: WizardHeaderProps) {
  const stepLabels = ["Informações Básicas", "Tipo e Planejamento"];
  const title = isEditing ? "Editar Meta" : "Criar Nova Meta";

  return (
    <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-3.5">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Target className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-brand-100 text-xs">
              {stepLabels[currentStep - 1]}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-lg p-1.5 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Compact Pills Progress */}
      <div className="flex items-center gap-2">
        {[1, 2].map((step) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-xs
                  transition-all duration-300 flex-1
                  ${
                    isCompleted
                      ? "bg-white text-brand-600"
                      : isActive
                      ? "bg-white/90 text-brand-600"
                      : "bg-white/20 text-white/70"
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                    ${
                      isCompleted
                        ? "bg-brand-100"
                        : isActive
                        ? "bg-brand-100"
                        : "bg-white/10"
                    }
                  `}
                >
                  {isCompleted ? "✓" : step}
                </span>
                <span className="truncate">{stepLabels[step - 1]}</span>
              </div>

              {step < 2 && (
                <div
                  className={`
                    text-lg mx-1 transition-colors duration-300
                    ${isCompleted ? "text-white" : "text-white/40"}
                  `}
                >
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
