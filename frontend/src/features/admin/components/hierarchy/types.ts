/**
 * Hierarchy Components Types
 */

export interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  userPosition?: string;
  allUsers?: Array<{
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;
  }>;
}

export type HierarchyStep = "list" | "add";

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Team {
  id: number;
  name: string;
  description?: string | null;
}

export interface ManagementRule {
  id: number;
  ruleType: "INDIVIDUAL" | "TEAM";
  subordinate?: User;
  team?: Team;
}
