import type { AdminUser } from "../../types";

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUser[]; // Se vazio, é criação de nova pessoa
  allUsers: AdminUser[]; // Todos os usuários do sistema (para selecionar gerentes)
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  iconName: "User" | "Users" | "Building2" | "CheckCircle";
  completed: boolean;
}

export interface NewUserData {
  name: string;
  email: string;
  isAdmin: boolean;
  position?: string;
}

export interface Assignments {
  [key: string]: {
    // UUID key
    manager?: string; // Manager name (display only)
    managerId?: string; // UUID do gerente
    team?: string; // Nome da equipe (display only)
    teamId?: string; // UUID da equipe
  };
}
