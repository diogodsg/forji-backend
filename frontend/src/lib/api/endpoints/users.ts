import { apiClient } from "../client";

/**
 * Users API Endpoints
 *
 * Endpoints disponíveis:
 * - GET /users - Lista usuários com paginação
 * - GET /users/search - Busca usuários por query
 * - POST /users - Cria novo usuário (admin)
 * - GET /users/:id - Detalhes do usuário
 * - PATCH /users/:id - Atualiza perfil
 * - PATCH /users/:id/password - Atualiza senha
 * - DELETE /users/:id - Remove usuário (soft delete)
 */

// ==================== Types ====================

export interface User {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  avatarId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isAdmin?: boolean;
  isManager?: boolean;
  managers?: { id: string }[]; // Gerentes deste usuário
  reports?: { id: string }[]; // Subordinados deste usuário
  managedTeams?: { id: string; name: string }[]; // Times gerenciados por este usuário
}

export interface PaginatedUsers {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  position?: string;
  bio?: string;
  isAdmin?: boolean;
  isManager?: boolean;
}

export interface CreateUserOnboardingDto {
  name: string;
  email: string;
  password?: string; // Optional - backend will generate if not provided
  position?: string;
  bio?: string;
  workspaceRole?: "OWNER" | "ADMIN" | "MEMBER";
  managerId?: string; // UUID do gerente
  teamId?: string; // UUID da equipe
}

export interface CreateUserOnboardingResponse {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  generatedPassword?: string; // Returned only if password was generated
  workspaceRole: "OWNER" | "ADMIN" | "MEMBER";
}

export interface UpdateUserDto {
  name?: string;
  position?: string;
  bio?: string;
  avatarId?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface SearchUsersParams {
  q: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ==================== API Calls ====================

export const usersApi = {
  /**
   * GET /users - Lista usuários com paginação
   */
  async findAll(params: ListUsersParams = {}): Promise<PaginatedUsers> {
    const { page = 1, limit = 20, search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const { data } = await apiClient.get<PaginatedUsers>(
      `/users?${queryParams}`
    );
    return data;
  },

  /**
   * GET /users/search - Busca usuários por query (nome ou email)
   */
  async search(query: string): Promise<User[]> {
    const { data } = await apiClient.get<User[]>("/users/search", {
      params: { q: query },
    });
    return data;
  },

  /**
   * POST /users - Cria novo usuário (apenas admin)
   */
  async create(dto: CreateUserDto): Promise<User> {
    const { data } = await apiClient.post<User>("/users", dto);
    return data;
  },

  /**
   * POST /users/onboarding - Cria novo usuário com setup completo de onboarding
   * Permite definir gerente, equipe e papel no workspace em uma única requisição
   */
  async createWithOnboarding(
    dto: CreateUserOnboardingDto
  ): Promise<CreateUserOnboardingResponse> {
    const { data } = await apiClient.post<CreateUserOnboardingResponse>(
      "/users/onboarding",
      dto
    );
    return data;
  },

  /**
   * GET /users/:id - Obtém detalhes de um usuário
   */
  async findOne(userId: string): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${userId}`);
    return data;
  },

  /**
   * PATCH /users/:id - Atualiza perfil do usuário
   */
  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${userId}`, dto);
    return data;
  },

  /**
   * PATCH /users/:id/password - Atualiza senha do usuário
   */
  async updatePassword(
    userId: string,
    dto: UpdatePasswordDto
  ): Promise<{ message: string }> {
    const { data } = await apiClient.patch<{ message: string }>(
      `/users/${userId}/password`,
      dto
    );
    return data;
  },

  /**
   * POST /users/:id/reset-password - Admin reseta senha do usuário
   * Permite que admins resetem senha sem conhecer a senha atual
   */
  async adminResetPassword(
    userId: string,
    newPassword?: string
  ): Promise<{
    success: boolean;
    message: string;
    generatedPassword?: string;
  }> {
    const { data } = await apiClient.post<{
      success: boolean;
      message: string;
      generatedPassword?: string;
    }>(`/users/${userId}/reset-password`, {
      newPassword,
    });
    return data;
  },

  /**
   * DELETE /users/:id - Remove usuário (soft delete)
   */
  async remove(userId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/users/${userId}`
    );
    return data;
  },
};
