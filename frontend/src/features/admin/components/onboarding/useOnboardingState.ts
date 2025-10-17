import { useState, useMemo } from "react";
import type { AdminUser } from "../../types";
import type { OnboardingStep, NewUserData, Assignments } from "./types";

export function useOnboardingState(users: AdminUser[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [newUserData, setNewUserData] = useState<NewUserData>({
    name: "",
    email: "",
    isAdmin: false,
    position: "",
  });

  const isCreatingNewUser = users.length === 0;

  const allManagers = useMemo(
    () => users.filter((user) => user.isAdmin || user.reports?.length),
    [users]
  );

  const steps: OnboardingStep[] = useMemo(
    () =>
      isCreatingNewUser
        ? [
            {
              id: "create-user",
              title: "Dados Pessoais",
              description: "Informações da nova pessoa",
              iconName: "User",
              completed:
                newUserData.name.trim() !== "" &&
                newUserData.email.trim() !== "",
            },
            {
              id: "assign-structure",
              title: "Definir Estrutura",
              description: "Atribua gerente e equipe",
              iconName: "Building2",
              // Completo se não há gerentes OU se há pelo menos um campo preenchido
              completed:
                allManagers.length === 0 ||
                !!(assignments["new"]?.manager || assignments["new"]?.team),
            },
            {
              id: "review-confirm",
              title: "Revisar & Confirmar",
              description: "Verificar as configurações",
              iconName: "CheckCircle",
              completed: false,
            },
          ]
        : [
            {
              id: "select-users",
              title: "Selecionar Pessoas",
              description: "Escolha quem precisa ser organizado",
              iconName: "Users",
              completed: selectedUsers.length > 0,
            },
            {
              id: "assign-structure",
              title: "Definir Estrutura",
              description: "Atribua gerentes e equipes",
              iconName: "Building2",
              // Completo se não há gerentes OU se todos têm gerente atribuído
              completed:
                allManagers.length === 0 ||
                selectedUsers.every((userId) => assignments[userId]?.manager),
            },
            {
              id: "review-confirm",
              title: "Revisar & Confirmar",
              description: "Verificar as configurações",
              iconName: "CheckCircle",
              completed: false,
            },
          ],
    [isCreatingNewUser, newUserData, selectedUsers, assignments, allManagers]
  );

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssignment = (
    userId: number | string,
    field: "manager" | "team",
    value: string | number
  ) => {
    setAssignments((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const updateNewUserData = (data: Partial<NewUserData>) => {
    setNewUserData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
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
  };
}
