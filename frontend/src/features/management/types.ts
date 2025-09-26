export type ManagementRuleType = "TEAM" | "INDIVIDUAL";

export interface ManagementRule {
  id: number;
  ruleType: ManagementRuleType;
  createdAt: string;
  updatedAt: string;
  managerId: number;
  teamId?: number;
  subordinateId?: number;
  team?: {
    id: number;
    name: string;
    description?: string;
  };
  subordinate?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SubordinateInfo {
  id: number;
  name: string;
  email: string;
  source: "individual" | "team";
  teamName?: string;
}

export interface CreateManagementRuleDto {
  ruleType: ManagementRuleType;
  teamId?: number;
  subordinateId?: number;
}
