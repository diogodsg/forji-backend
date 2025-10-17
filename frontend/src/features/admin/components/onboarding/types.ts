import type { AdminUser } from "../../types";

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUser[]; // Se vazio, é criação de nova pessoa
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
  [key: string | number]: {
    manager?: number;
    team?: string;
  };
}
