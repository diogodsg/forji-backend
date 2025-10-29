import { useState, useMemo, useCallback } from "react";
import type { AdminUser } from "../../types";
import type { OnboardingStep, NewUserData, Assignments } from "./types";

export function useOnboardingState(users: AdminUser[], allUsers: AdminUser[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // UUID[]
  const [assignments, setAssignments] = useState<Assignments>({});
  const [newUserData, setNewUserData] = useState<NewUserData>({
    name: "",
    email: "",
    isAdmin: false,
    position: "",
  });

  const isCreatingNewUser = users.length === 0;

  // Todos os usuários do sistema podem ser gerentes
  // (não precisa já ter subordinados para ser gerente)
  const allManagers = useMemo(() => allUsers, [allUsers]);

  // 🚀 CORREÇÃO: Evitando loop infinito usando valores computados em vez de objetos como dependência
  const hasNewUserData =
    newUserData.name.trim() !== "" && newUserData.email.trim() !== "";
  const hasSelectedUsers = selectedUsers.length > 0;
  const allUsersHaveManagers =
    selectedUsers.length === 0 ||
    selectedUsers.every((userId) => assignments[userId]?.manager);
  const newUserHasAssignment = !!(
    assignments["new"]?.manager || assignments["new"]?.team
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
              completed: hasNewUserData,
            },
            {
              id: "assign-structure",
              title: "Definir Estrutura",
              description: "Atribua gerente e equipe",
              iconName: "Building2",
              // Completo se não há gerentes OU se há pelo menos um campo preenchido
              completed: allManagers.length === 0 || newUserHasAssignment,
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
              completed: hasSelectedUsers,
            },
            {
              id: "assign-structure",
              title: "Definir Estrutura",
              description: "Atribua gerentes e equipes",
              iconName: "Building2",
              // Completo se não há gerentes OU se todos têm gerente atribuído
              completed: allManagers.length === 0 || allUsersHaveManagers,
            },
            {
              id: "review-confirm",
              title: "Revisar & Confirmar",
              description: "Verificar as configurações",
              iconName: "CheckCircle",
              completed: false,
            },
          ],
    [
      isCreatingNewUser,
      hasNewUserData,
      hasSelectedUsers,
      allUsersHaveManagers,
      newUserHasAssignment,
      allManagers.length,
    ]
  );

  const handleUserToggle = useCallback((userId: string) => {
    // UUID
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleAssignment = useCallback(
    (
      userId: string, // UUID
      field: "manager" | "team",
      value: string // UUID
    ) => {
      setAssignments((prev) => {
        const updated = { ...prev[userId] };

        if (field === "manager") {
          // value is manager ID (UUID)
          updated.managerId = value;
          // Find manager name from users list for display
          const manager = users.find((u) => u.id === value);
          updated.manager = manager?.name;
        } else if (field === "team") {
          // value is team ID (UUID)
          updated.teamId = value;
          updated.team = value; // Or we could look up the team name
        }

        return {
          ...prev,
          [userId]: updated,
        };
      });
    },
    [users]
  );

  const updateNewUserData = useCallback((data: Partial<NewUserData>) => {
    setNewUserData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setSelectedUsers([]);
    setAssignments({});
    setNewUserData({
      name: "",
      email: "",
      isAdmin: false,
      position: "",
    });
  }, []);

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
    reset,
  };
}
