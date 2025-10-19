export type ManagementRuleType = "TEAM" | "INDIVIDUAL";

export interface ManagementRule {
  id: string; // UUID
  ruleType: ManagementRuleType;
  createdAt: string;
  updatedAt: string;
  managerId: string; // UUID
  teamId?: string; // UUID
  subordinateId?: string; // UUID
  team?: {
    id: string; // UUID
    name: string;
    description?: string;
  };
  subordinate?: {
    id: string; // UUID
    name: string;
    email: string;
  };
}

export interface SubordinateInfo {
  id: string; // UUID
  name: string;
  email: string;
  source: "individual" | "team";
  teamName?: string;
}

export interface CreateManagementRuleDto {
  ruleType: ManagementRuleType;
  managerId: string; // UUID - obrigatório no backend
  teamId?: string; // UUID
  subordinateId?: string; // UUID
}
