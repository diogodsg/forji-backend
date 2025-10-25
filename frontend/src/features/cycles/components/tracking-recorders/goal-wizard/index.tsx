import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { GoalData } from "./types";
import { validateStep1, validateStep2, calculateGoalXP } from "./utils";
import WizardHeader from "./WizardHeader";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Planning from "./Step2Planning";
import WizardFooter from "./WizardFooter";

interface GoalCreatorWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GoalData) => void;
  prefillData?: Partial<GoalData>;
  isEditing?: boolean; // Novo prop para indicar modo de edição
}

/**
 * GoalCreatorWizard - 2-Step Wizard for Goal Creation
 *
 * **Step 1**: Informações Básicas (Título, Descrição, Tipo, Data)
 * **Step 2**: Planejamento (Critério de Sucesso baseado no tipo + Marcos)
 * **XP System**: Base 40 XP + bonuses dinâmicos
 *
 * Componentes:
 * - WizardHeader: Header com progresso
 * - Step1BasicInfo: Form de informações básicas
 * - Step2Planning: Critério de sucesso + marcos
 * - WizardFooter: Navegação entre steps
 * - SuccessCriterionForm: Forms específicos por tipo de meta
 * - ListEditor: Editor de listas (marcos)
 * - XPBreakdown: Preview do XP
 */
export default function GoalCreatorWizard({
  isOpen,
  onClose,
  onSave,
  prefillData,
  isEditing = false,
}: GoalCreatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<GoalData>>({
    title: prefillData?.title || "",
    description: prefillData?.description || "",
    type: prefillData?.type || undefined,
    successCriterion: prefillData?.successCriterion || undefined,
  });

  // Atualizar formData quando prefillData mudar (para modo de edição)
  useEffect(() => {
    if (prefillData && isOpen) {
      console.log("🔄 Atualizando formData com prefillData:", prefillData);
      setFormData({
        title: prefillData.title || "",
        description: prefillData.description || "",
        type: prefillData.type || undefined,
        successCriterion: prefillData.successCriterion || undefined,
      });
    }
  }, [prefillData, isOpen]);

  const { total: xpTotal, bonuses: xpBonuses } = calculateGoalXP(formData);
  const isStep1Valid = validateStep1(formData);
  const isStep2Valid = validateStep2(formData);

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep1Valid && isStep2Valid) {
      onSave(formData as GoalData);
      onClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    // Reset formData to initial state
    setFormData({
      title: "",
      description: "",
      type: undefined,
      successCriterion: undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[1100px] h-[680px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <WizardHeader
          currentStep={currentStep}
          onClose={handleClose}
          isEditing={isEditing}
        />

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              setFormData={setFormData}
              xpTotal={xpTotal}
              xpBonuses={xpBonuses}
            />
          )}

          {currentStep === 2 && (
            <Step2Planning
              formData={formData}
              setFormData={setFormData}
              xpTotal={xpTotal}
              xpBonuses={xpBonuses}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t bg-white">
          <WizardFooter
            currentStep={currentStep}
            isStep1Valid={isStep1Valid}
            isStep2Valid={isStep2Valid}
            xpTotal={xpTotal}
            onBack={handleBack}
            onNext={handleNext}
            onCancel={handleClose}
            isEditing={isEditing}
          />
        </form>
      </div>
    </div>,
    document.body
  );
}
