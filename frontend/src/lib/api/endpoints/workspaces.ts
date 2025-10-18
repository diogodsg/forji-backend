import { apiClient } from "../client";

/**
 * Workspaces API Endpoints
 *
 * Endpoints disponíveis:
 * - GET /workspaces - Lista workspaces do usuário
 * - POST /workspaces - Cria novo workspace
 * - GET /workspaces/:id - Detalhes do workspace
 * - PUT /workspaces/:id - Atualiza workspace
 * - DELETE /workspaces/:id - Arquiva workspace
 * - GET /workspaces/:id/members - Lista membros
 * - POST /workspaces/:id/members - Convida membro
 * - DELETE /workspaces/:id/members/:userId - Remove membro
 * - POST /workspaces/:id/leave - Sai do workspace
 */

// ==================== Types ====================

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isArchived: boolean;
  role?: "OWNER" | "ADMIN" | "MEMBER"; // Papel do usuário atual
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    position?: string;
  };
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
}

export interface InviteToWorkspaceDto {
  email: string;
  role?: "ADMIN" | "MEMBER";
}

// ==================== API Calls ====================

export const workspacesApi = {
  /**
   * GET /workspaces - Lista todos workspaces do usuário autenticado
   */
  async getUserWorkspaces(): Promise<Workspace[]> {
    const { data } = await apiClient.get<Workspace[]>("/workspaces");
    return data;
  },

  /**
   * POST /workspaces - Cria novo workspace
   */
  async createWorkspace(dto: CreateWorkspaceDto): Promise<Workspace> {
    const { data } = await apiClient.post<Workspace>("/workspaces", dto);
    return data;
  },

  /**
   * GET /workspaces/:id - Obtém detalhes de um workspace específico
   */
  async getWorkspace(workspaceId: string): Promise<Workspace> {
    const { data } = await apiClient.get<Workspace>(
      `/workspaces/${workspaceId}`
    );
    return data;
  },

  /**
   * PUT /workspaces/:id - Atualiza workspace (apenas OWNER/ADMIN)
   */
  async updateWorkspace(
    workspaceId: string,
    dto: UpdateWorkspaceDto
  ): Promise<Workspace> {
    const { data } = await apiClient.put<Workspace>(
      `/workspaces/${workspaceId}`,
      dto
    );
    return data;
  },

  /**
   * DELETE /workspaces/:id - Arquiva workspace (apenas OWNER)
   */
  async deleteWorkspace(workspaceId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/workspaces/${workspaceId}`
    );
    return data;
  },

  /**
   * GET /workspaces/:id/members - Lista membros do workspace
   */
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data } = await apiClient.get<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`
    );
    return data;
  },

  /**
   * POST /workspaces/:id/members - Convida usuário para workspace
   */
  async inviteToWorkspace(
    workspaceId: string,
    dto: InviteToWorkspaceDto
  ): Promise<WorkspaceMember> {
    const { data } = await apiClient.post<WorkspaceMember>(
      `/workspaces/${workspaceId}/members`,
      dto
    );
    return data;
  },

  /**
   * DELETE /workspaces/:id/members/:userId - Remove membro do workspace
   */
  async removeMember(
    workspaceId: string,
    userId: string
  ): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/workspaces/${workspaceId}/members/${userId}`
    );
    return data;
  },

  /**
   * POST /workspaces/:id/leave - Sai do workspace
   */
  async leaveWorkspace(workspaceId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      `/workspaces/${workspaceId}/leave`
    );
    return data;
  },
};
