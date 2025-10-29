import { useState } from "react";
import { createPortal } from "react-dom";
import type { CompetenceData, CompetenceRecorderProps } from "./types";
import { isFormValid, calculateBonuses } from "./utils";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2Details } from "./Step2Details";

const INITIAL_DATA: CompetenceData = {
  name: "",
  category: "",
  initialLevel: 1,
  targetLevel: 2,
  description: "",
  evidences: [],
};

/**
 * CompetenceRecorder - 2-Step Wizard
 *
 * **Step 1**: Informações Básicas (name, category, level, date, source)
 * **Step 2**: Detalhes (description, evidences, relatedSkills)
 * **Layout**: 2 colunas (Form + XP Breakdown)
 * **XP System**: Base 100 + bonuses (max 265 XP)
 */
export function CompetenceRecorder({
  isOpen,
  onClose,
  onSave,
  prefillData,
}: CompetenceRecorderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<CompetenceData>({
    ...INITIAL_DATA,
    ...prefillData,
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof CompetenceData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid(data) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving competence:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation per step
  const canProceedStep1 = Boolean(
    (data.name?.trim() ?? "") !== "" && data.initialLevel && data.targetLevel
  );
  const canProceedStep2 = isFormValid(data);

  const canProceed = currentStep === 1 ? canProceedStep1 : canProceedStep2;

  // Calculate total XP
  const bonuses = calculateBonuses(data);
  const totalXP = 100 + bonuses.reduce((sum, b) => sum + b.value, 0);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "1100px", height: "680px" }}
      >
        <WizardHeader
          currentStep={currentStep}
          totalSteps={2}
          onClose={onClose}
        />

        <div className="flex-1 overflow-hidden px-6 py-4">
          {currentStep === 1 && (
            <Step1BasicInfo data={data} onChange={handleChange} />
          )}
          {currentStep === 2 && (
            <Step2Details data={data} onChange={handleChange} />
          )}
        </div>

        <WizardFooter
          currentStep={currentStep}
          totalSteps={2}
          isStepValid={canProceed}
          totalXP={totalXP}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>,
    document.body
  );
}
