import { createPortal } from "react-dom";
import { useEffect, useCallback } from "react";
import type { OnboardingModalProps } from "./types";
import { useOnboardingState } from "./useOnboardingState";
import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressSteps } from "./ProgressSteps";
import { UserFormStep } from "./UserFormStep";
import { UserSelectionStep } from "./UserSelectionStep";
import { StructureAssignmentStep } from "./StructureAssignmentStep";
import { ReviewStep } from "./ReviewStep";
import { OnboardingFooter } from "./OnboardingFooter";

export function OnboardingModal({
  isOpen,
  onClose,
  users,
}: OnboardingModalProps) {
  const {
    currentStep,
    selectedUsers,
    assignments,
    newUserData,
    isCreatingNewUser,
    steps,
    allManagers,
    handleUserToggle,
    handleAssignment,
    updateNewUserData,
    nextStep,
    prevStep,
  } = useOnboardingState(users);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleConfirm = useCallback(() => {
    console.log("Onboarding completed:", {
      selectedUsers,
      assignments,
      newUserData: isCreatingNewUser ? newUserData : undefined,
    });
    onClose();
    // TODO: Chamar API para aplicar as mudanças
  }, [selectedUsers, assignments, newUserData, isCreatingNewUser, onClose]);

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return isCreatingNewUser ? (
          <UserFormStep userData={newUserData} onUpdate={updateNewUserData} />
        ) : (
          <UserSelectionStep
            users={users}
            selectedUsers={selectedUsers}
            onToggleUser={handleUserToggle}
          />
        );

      case 1:
        return (
          <StructureAssignmentStep
            isCreatingNewUser={isCreatingNewUser}
            newUserData={newUserData}
            selectedUsers={selectedUsers}
            users={users}
            allManagers={allManagers}
            assignments={assignments}
            onAssignment={handleAssignment}
          />
        );

      case 2:
        return (
          <ReviewStep
            isCreatingNewUser={isCreatingNewUser}
            newUserData={newUserData}
            selectedUsers={selectedUsers}
            users={users}
            allManagers={allManagers}
            assignments={assignments}
          />
        );

      default:
        return null;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="bg-white rounded-2xl border border-surface-300 shadow-xl w-[56rem] h-[600px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <OnboardingHeader
          isCreatingNewUser={isCreatingNewUser}
          userCount={users.length}
          onClose={onClose}
        />

        <div className="px-6 border-b border-surface-200">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>

        <div className="p-6 overflow-y-auto flex-1">{renderStepContent()}</div>

        <OnboardingFooter
          currentStep={currentStep}
          steps={steps}
          isCreatingNewUser={isCreatingNewUser}
          onBack={prevStep}
          onNext={nextStep}
          onConfirm={handleConfirm}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
}
