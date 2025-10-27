import { apiClient } from "../client";
import type {
  CycleResponseDto,
  GoalResponseDto,
  CompetencyResponseDto,
  ActivityTimelineDto,
} from "../../../../shared-types/cycles.types";

/**
 * Management Rule Types
 */
export type ManagementRuleType = "INDIVIDUAL" | "TEAM";

/**
 * Manager information for a user
 */
export interface ManagerInfo {
  managerId: string;
  name: string;
  email: string;
  position?: string | null;
  ruleId: string;
  ruleType: "INDIVIDUAL" | "TEAM";
  teamId?: string;
  teamName?: string;
  assignedAt: string;
}

/**
 * Subordinate information for a manager
 */
export interface SubordinateInfo {
  userId: string;
  name: string;
  email: string;
  ruleId: string;
  ruleType: "INDIVIDUAL" | "TEAM";
  teamId?: string;
  teamName?: string;
  assignedAt: string;
}

/**
 * Response from getUserManagers endpoint
 */
export interface GetManagersResponse {
  total: number;
  directManagers: number;
  teamManagers: number;
  managers: ManagerInfo[];
}

/**
 * Response from getSubordinates endpoint
 */
export interface GetSubordinatesResponse {
  total: number;
  directSubordinates: number;
  teamMembers: number;
  subordinates: SubordinateInfo[];
}

/**
 * Management Rule
 */
export interface ManagementRule {
  id: string;
  ruleType: ManagementRuleType;
  managerId: string;
  subordinateId?: string | null;
  teamId?: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    name: string;
    email: string;
  };
  subordinate?: {
    id: string;
    name: string;
    email: string;
  } | null;
  team?: {
    id: string;
    name: string;
    description?: string | null;
    status: string;
  } | null;
}

/**
 * Create Management Rule DTO
 */
export interface CreateRuleDto {
  ruleType: ManagementRuleType;
  managerId: string;
  subordinateId?: string;
  teamId?: string;
}

/**
 * Management API endpoints
 */
export const managementApi = {
  /**
   * GET /management/managers/:userId
   * Get all managers for a specific user
   */
  getUserManagers: async (userId: string): Promise<GetManagersResponse> => {
    const { data } = await apiClient.get(`/management/managers/${userId}`);
    return data;
  },

  /**
   * GET /management/subordinates/:userId
   * Get all subordinates for a specific user
   */
  getUserSubordinates: async (
    userId: string,
    includeTeamMembers = false
  ): Promise<GetSubordinatesResponse> => {
    const { data } = await apiClient.get(`/management/subordinates/${userId}`, {
      params: { includeTeamMembers },
    });
    return data;
  },

  /**
   * GET /management/subordinates
   * Get all subordinates for the current user
   */
  getMySubordinates: async (
    includeTeamMembers = false
  ): Promise<GetSubordinatesResponse> => {
    const { data } = await apiClient.get("/management/subordinates", {
      params: { includeTeamMembers },
    });
    return data;
  },

  /**
   * GET /management/teams
   * Get all teams managed by the current user
   */
  getMyTeams: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/management/teams");
    return data;
  },

  /**
   * GET /management/rules
   * Get all management rules (admin only)
   */
  getAllRules: async (
    managerId?: string,
    type?: ManagementRuleType
  ): Promise<ManagementRule[]> => {
    const { data } = await apiClient.get("/management/rules", {
      params: { managerId, type },
    });
    return data;
  },

  /**
   * POST /management/rules
   * Create a new management rule
   */
  createRule: async (dto: CreateRuleDto): Promise<ManagementRule> => {
    const { data } = await apiClient.post("/management/rules", dto);
    return data;
  },

  /**
   * DELETE /management/rules/:id
   * Delete a management rule
   */
  deleteRule: async (ruleId: string): Promise<void> => {
    await apiClient.delete(`/management/rules/${ruleId}`);
  },

  /**
   * GET /management/check/:userId
   * Check if a user is managed by the current user
   */
  checkIfManaged: async (userId: string): Promise<{ isManaged: boolean }> => {
    const { data } = await apiClient.get(`/management/check/${userId}`);
    return data;
  },

  /**
   * GET /management/subordinates/:subordinateId/cycles/current
   * Get current cycle of a subordinate
   */
  getSubordinateCycle: async (
    subordinateId: string
  ): Promise<CycleResponseDto | null> => {
    const { data } = await apiClient.get(
      `/management/subordinates/${subordinateId}/cycles/current`
    );
    return data;
  },

  /**
   * GET /management/subordinates/:subordinateId/goals
   * Get goals of a subordinate
   */
  getSubordinateGoals: async (
    subordinateId: string,
    cycleId?: string
  ): Promise<GoalResponseDto[]> => {
    const { data } = await apiClient.get(
      `/management/subordinates/${subordinateId}/goals`,
      {
        params: { cycleId },
      }
    );
    return data;
  },

  /**
   * GET /management/subordinates/:subordinateId/competencies
   * Get competencies of a subordinate
   */
  getSubordinateCompetencies: async (
    subordinateId: string,
    cycleId?: string
  ): Promise<CompetencyResponseDto[]> => {
    const { data } = await apiClient.get(
      `/management/subordinates/${subordinateId}/competencies`,
      {
        params: { cycleId },
      }
    );
    return data;
  },

  /**
   * GET /management/subordinates/:subordinateId/activities
   * Get activities timeline of a subordinate
   */
  getSubordinateActivities: async (
    subordinateId: string,
    cycleId?: string,
    page?: number,
    pageSize?: number
  ): Promise<ActivityTimelineDto[]> => {
    const { data } = await apiClient.get(
      `/management/subordinates/${subordinateId}/activities`,
      {
        params: { cycleId, page, pageSize },
      }
    );
    return data.activities || data; // Support both paginated and simple array response
  },
};
