import { X, MessageSquare } from "lucide-react";

interface WizardHeaderProps {
  currentStep: number;
  totalXP: number;
  onClose: () => void;
}

export default function WizardHeader({
  currentStep,
  totalXP,
  onClose,
}: WizardHeaderProps) {
  const stepLabels = ["Informações Básicas", "Resultados & Próximos Passos"];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Registrar 1:1</h2>
            <p className="text-blue-100 text-sm">
              {stepLabels[currentStep - 1]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
            <div className="text-xs text-blue-100 mb-1">XP a ganhar</div>
            <div className="text-2xl font-bold text-white">+{totalXP} XP</div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Progress Pills */}
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
                      ? "bg-white text-blue-600"
                      : isActive
                      ? "bg-white/90 text-blue-600"
                      : "bg-white/20 text-white/70"
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                    ${
                      isCompleted
                        ? "bg-blue-100"
                        : isActive
                        ? "bg-blue-100"
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
