import { apiClient } from "../client";

/**
 * Teams API Endpoints
 *
 * Endpoints disponíveis:
 * - GET /teams - Lista teams do workspace
 * - GET /teams/search - Busca teams por nome
 * - POST /teams - Cria novo team
 * - GET /teams/:id - Detalhes do team
 * - PATCH /teams/:id - Atualiza team
 * - DELETE /teams/:id - Remove team (soft delete)
 * - GET /teams/:id/members - Lista membros
 * - POST /teams/:id/members - Adiciona membro
 * - PATCH /teams/:id/members/:userId - Atualiza role do membro
 * - DELETE /teams/:id/members/:userId - Remove membro
 */

// ==================== Types ====================

export type TeamStatus = "ACTIVE" | "ARCHIVED" | "INACTIVE";
export type TeamMemberRole = "LEADER" | "MEMBER";

export interface Team {
  id: string;
  name: string;
  description?: string;
  status: TeamStatus;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  members?: TeamMember[];
  memberCount?: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamMemberRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    position?: string;
  };
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  status?: TeamStatus;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  status?: TeamStatus;
}

export interface AddMemberDto {
  userId: string;
  role?: TeamMemberRole;
}

export interface UpdateMemberRoleDto {
  role: TeamMemberRole;
}

export interface ListTeamsParams {
  status?: TeamStatus;
  includeMembers?: boolean;
  includeMemberCount?: boolean;
}

// ==================== API Calls ====================

export const teamsApi = {
  /**
   * GET /teams - Lista todos teams do workspace
   */
  async findAll(params: ListTeamsParams = {}): Promise<Team[]> {
    const queryParams = new URLSearchParams();

    if (params.status) {
      queryParams.append("status", params.status);
    }
    if (params.includeMembers !== undefined) {
      queryParams.append("includeMembers", String(params.includeMembers));
    }
    if (params.includeMemberCount !== undefined) {
      queryParams.append(
        "includeMemberCount",
        String(params.includeMemberCount)
      );
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/teams?${queryString}` : "/teams";

    const { data } = await apiClient.get<Team[]>(url);
    return data;
  },

  /**
   * GET /teams/search - Busca teams por nome
   */
  async search(query: string): Promise<Team[]> {
    const { data } = await apiClient.get<Team[]>("/teams/search", {
      params: { q: query },
    });
    return data;
  },

  /**
   * POST /teams - Cria novo team
   */
  async create(dto: CreateTeamDto): Promise<Team> {
    const { data } = await apiClient.post<Team>("/teams", dto);
    return data;
  },

  /**
   * GET /teams/:id - Obtém detalhes de um team
   */
  async findOne(
    teamId: string,
    includeMembers: boolean = false
  ): Promise<Team> {
    const queryParams = includeMembers ? "?includeMembers=true" : "";
    const { data } = await apiClient.get<Team>(
      `/teams/${teamId}${queryParams}`
    );
    return data;
  },

  /**
   * PATCH /teams/:id - Atualiza team
   */
  async update(teamId: string, dto: UpdateTeamDto): Promise<Team> {
    const { data } = await apiClient.patch<Team>(`/teams/${teamId}`, dto);
    return data;
  },

  /**
   * DELETE /teams/:id - Remove team (soft delete)
   */
  async remove(teamId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/teams/${teamId}`
    );
    return data;
  },

  /**
   * GET /teams/:id/members - Lista membros do team
   */
  async getMembers(teamId: string): Promise<TeamMember[]> {
    const { data } = await apiClient.get<TeamMember[]>(
      `/teams/${teamId}/members`
    );
    return data;
  },

  /**
   * POST /teams/:id/members - Adiciona membro ao team
   */
  async addMember(teamId: string, dto: AddMemberDto): Promise<TeamMember> {
    const { data } = await apiClient.post<TeamMember>(
      `/teams/${teamId}/members`,
      dto
    );
    return data;
  },

  /**
   * PATCH /teams/:id/members/:userId - Atualiza role do membro
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    dto: UpdateMemberRoleDto
  ): Promise<TeamMember> {
    const { data } = await apiClient.patch<TeamMember>(
      `/teams/${teamId}/members/${userId}`,
      dto
    );
    return data;
  },

  /**
   * DELETE /teams/:id/members/:userId - Remove membro do team
   */
  async removeMember(
    teamId: string,
    userId: string
  ): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/teams/${teamId}/members/${userId}`
    );
    return data;
  },
};
