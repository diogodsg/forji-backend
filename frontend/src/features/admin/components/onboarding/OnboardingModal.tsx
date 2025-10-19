import { createPortal } from "react-dom";
import { useEffect, useCallback, useState } from "react";
import type { OnboardingModalProps } from "./types";
import { useOnboardingState } from "./useOnboardingState";
import { usersApi } from "@/lib/api/endpoints/users";
import { useToast } from "@/components/Toast";
import { extractErrorMessage } from "@/lib/api";
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
  allUsers,
}: OnboardingModalProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    reset,
  } = useOnboardingState(users, allUsers);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setIsSubmitting(false);
    }
  }, [isOpen, reset]);

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

  const handleConfirm = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isCreatingNewUser) {
        // Obter dados do assignment para o novo usuário (se houver)
        const userId = "new"; // Deve corresponder ao usado no StructureAssignmentStep
        const assignment = assignments[userId];

        console.log("📝 Enviando dados de onboarding:", {
          name: newUserData.name,
          email: newUserData.email,
          position: newUserData.position,
          workspaceRole: newUserData.isAdmin ? "ADMIN" : "MEMBER",
          managerId: assignment?.managerId,
          teamId: assignment?.teamId,
        });

        // Criar novo usuário via API de onboarding
        const result = await usersApi.createWithOnboarding({
          name: newUserData.name,
          email: newUserData.email,
          position: newUserData.position,
          workspaceRole: newUserData.isAdmin ? "ADMIN" : "MEMBER",
          managerId: assignment?.managerId || undefined,
          teamId: assignment?.teamId || undefined,
        });

        console.log("✅ Usuário criado:", result);

        // Mostrar senha gerada se houver
        if (result.generatedPassword) {
          toast.success(
            `Usuário criado! Senha gerada: ${result.generatedPassword}`,
            "Guarde esta senha",
            10000 // 10 segundos
          );
        } else {
          toast.success(
            `Usuário "${result.name}" criado com sucesso!`,
            "Onboarding concluído"
          );
        }
      } else {
        // Aplicar assignments para usuários selecionados
        console.log("Assignments a aplicar:", {
          selectedUsers,
          assignments,
        });

        toast.info(
          "Funcionalidade de bulk assignments em desenvolvimento",
          "Aguarde"
        );

        // TODO: Implementar bulk assignments via API
      }

      onClose();
    } catch (err) {
      console.error("Erro no onboarding:", err);
      const message = extractErrorMessage(err);
      toast.error(message, "Erro ao criar usuário");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isCreatingNewUser,
    newUserData,
    selectedUsers,
    assignments,
    toast,
    onClose,
  ]);

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
      <div className="bg-white rounded-2xl border border-surface-300 shadow-2xl w-[56rem] h-[600px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <OnboardingHeader
          isCreatingNewUser={isCreatingNewUser}
          userCount={users.length}
          onClose={onClose}
        />

        <div className="px-6 border-b border-surface-200 bg-surface-50">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-br from-white to-surface-50">
          {renderStepContent()}
        </div>

        <OnboardingFooter
          currentStep={currentStep}
          steps={steps}
          isCreatingNewUser={isCreatingNewUser}
          isSubmitting={isSubmitting}
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
