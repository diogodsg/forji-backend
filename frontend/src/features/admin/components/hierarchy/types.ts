/**
 * Hierarchy Components Types
 */

export interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // UUID
  userName: string;
  userPosition?: string;
  allUsers?: Array<{
    id: string; // UUID
    name: string;
    email: string;
    isAdmin?: boolean;
  }>;
}

export type HierarchyStep = "list" | "add";

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Team {
  id: string; // UUID
  name: string;
  description?: string | null;
}

export interface ManagementRule {
  id: string; // UUID
  ruleType: "INDIVIDUAL" | "TEAM";
  subordinate?: User;
  team?: Team;
}
