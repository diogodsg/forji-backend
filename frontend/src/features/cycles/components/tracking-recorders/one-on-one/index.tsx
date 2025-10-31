import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import type { OneOnOneData, OneOnOneRecorderProps } from "./types";
import { isFormValid } from "./utils";
import WizardHeader from "./WizardHeader";
import WizardFooter from "./WizardFooter";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Outcomes from "./Step2Outcomes";
import { useWorkspaceUsers } from "@/features/admin/hooks/useWorkspaceUsers";
import { useLastOneOnOne } from "./useLastOneOnOne";

const INITIAL_DATA: OneOnOneData = {
  participantId: "",
  participant: "",
  date: new Date().toISOString().split("T")[0],
  workingOn: [],
  generalNotes: "",
  positivePoints: [],
  improvementPoints: [],
  nextSteps: [],
};

/**
 * OneOnOneRecorder - 2-Step Wizard
 *
 * **Step 1**: Informações Básicas (participant*, date*, workingOn, generalNotes*)
 * **Step 2**: Resultados & Próximos Passos (positivePoints, improvementPoints, nextSteps)
 * **Layout**: 2 colunas (Form + XP Breakdown)
 * **XP System**: Preview dinâmico com bonuses
 *
 * Campos obrigatórios (*):
 * - participant: Nome do participante
 * - date: Data da reunião
 * - generalNotes: Anotações gerais (mínimo 1 caractere)
 *
 * Campos opcionais (bonificam XP):
 * - workingOn: Itens de trabalho
 * - positivePoints: Pontos positivos
 * - improvementPoints: Pontos de melhoria
 * - nextSteps: Próximos passos
 */
export function OneOnOneRecorder({
  isOpen,
  onClose,
  onSave,
  prefillData,
  cycleId,
}: OneOnOneRecorderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OneOnOneData>({
    ...INITIAL_DATA,
    ...prefillData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all workspace users to find subordinateId by name
  const { users = [] } = useWorkspaceUsers();

  // Find the subordinate ID based on the selected participant name
  const subordinateId = useMemo(() => {
    if (!data.participant) return undefined;
    const user = users.find((u) => u.name === data.participant);
    return user?.id;
  }, [data.participant, users]);

  // Check if subordinate has a recent 1:1 (last 7 days)
  const xpStatus = useLastOneOnOne(subordinateId, cycleId);

  // Update participantId when participant name changes
  useEffect(() => {
    if (subordinateId && subordinateId !== data.participantId) {
      setData((prev) => ({ ...prev, participantId: subordinateId }));
    }
  }, [subordinateId, data.participantId]);

  if (!isOpen) return null;

  const handleChange = (updates: Partial<OneOnOneData>) => {
    setData((prev) => ({ ...prev, ...updates }));
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
    if (!isFormValid(data)) return;

    setIsSubmitting(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving 1:1:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation per step
  // Apenas participante, data e anotações gerais são obrigatórios
  const canProceedStep1 =
    (data.participant?.trim() ?? "") !== "" &&
    data.date !== "" &&
    (data.generalNotes?.trim() ?? "") !== "";
  const canProceedStep2 = isFormValid(data); // Mesma validação

  const canProceed = currentStep === 1 ? canProceedStep1 : canProceedStep2;

  // Calculate total XP
  const baseXP = 300;
  const bonusXP =
    (data.workingOn.length > 0 ? 50 : 0) +
    (data.positivePoints.length > 0 ? 50 : 0) +
    (data.improvementPoints.length > 0 ? 50 : 0) +
    (data.nextSteps.length > 0 ? 50 : 0) +
    (data.generalNotes.length > 50 ? 50 : 0);
  const totalXP = baseXP + bonusXP;

  // Edit mode is true only if we have data from an existing activity
  // (arrays with content, or specific fields like date with other content)
  const isEditMode = Boolean(
    prefillData &&
      (prefillData.workingOn?.length ||
        prefillData.positivePoints?.length ||
        prefillData.improvementPoints?.length ||
        prefillData.nextSteps?.length ||
        (prefillData.generalNotes && prefillData.generalNotes.length > 0))
  );

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "1100px", height: "685px" }}
      >
        <WizardHeader
          currentStep={currentStep}
          totalXP={totalXP}
          onClose={onClose}
          isEditMode={isEditMode}
          hasRecentOneOnOne={xpStatus.hasRecentOneOnOne}
          nextEligibleDate={xpStatus.nextEligibleDate}
          daysUntilEligible={xpStatus.daysUntilEligible}
        />

        <div className="flex-1 px-6 py-6  overflow-hidden">
          {currentStep === 1 && (
            <Step1BasicInfo
              data={data}
              onChange={handleChange}
              hasRecentOneOnOne={xpStatus.hasRecentOneOnOne}
              nextEligibleDate={xpStatus.nextEligibleDate}
              daysUntilEligible={xpStatus.daysUntilEligible}
            />
          )}
          {currentStep === 2 && (
            <Step2Outcomes
              data={data}
              onChange={handleChange}
              hasRecentOneOnOne={xpStatus.hasRecentOneOnOne}
              nextEligibleDate={xpStatus.nextEligibleDate}
              daysUntilEligible={xpStatus.daysUntilEligible}
            />
          )}
        </div>

        <WizardFooter
          currentStep={currentStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canProceed={canProceed}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </div>
    </div>,
    document.body
  );
}
