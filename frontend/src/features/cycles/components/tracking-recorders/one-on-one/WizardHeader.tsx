import { X, MessageSquare, Calendar, Clock } from "lucide-react";

interface WizardHeaderProps {
  currentStep: number;
  totalXP: number;
  onClose: () => void;
  isEditMode?: boolean;
  hasRecentOneOnOne?: boolean;
  nextEligibleDate?: Date | null;
  daysUntilEligible?: number;
}

export default function WizardHeader({
  currentStep,
  totalXP,
  onClose,
  isEditMode = false,
  hasRecentOneOnOne = false,
  nextEligibleDate = null,
  daysUntilEligible = 0,
}: WizardHeaderProps) {
  const stepLabels = ["Informações Básicas", "Resultados & Próximos Passos"];

  // Format next eligible date
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditMode ? "Editar 1:1" : "Registrar 1:1"}
            </h2>
            <p className="text-blue-100 text-sm">
              {stepLabels[currentStep - 1]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isEditMode && (
            <>
              {hasRecentOneOnOne ? (
                <div className="bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-300/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-200" />
                    <div className="text-xs text-amber-100">Próximo XP em</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white" />
                    <div className="text-lg font-bold text-white">
                      {formatDate(nextEligibleDate)}
                    </div>
                    <div className="text-xs text-amber-100">
                      ({daysUntilEligible}d)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                  <div className="text-xs text-blue-100 mb-1">XP a ganhar</div>
                  <div className="text-2xl font-bold text-white">
                    +{totalXP} XP
                  </div>
                </div>
              )}
            </>
          )}
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
