import { apiClient, extractErrorMessage } from "../client";

// Tipos temporários - mover para shared-types depois
interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
  name: string;
  workspaceName: string;
  position?: string;
  bio?: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  avatarUrl?: string;
  workspaceId: string;
  workspaceRole: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
  workspaces?: any[]; // Backend também retorna workspaces
}

interface MeResponse {
  user: AuthUser;
}

interface SwitchWorkspaceDto {
  workspaceId: string;
}

export const authApi = {
  /**
   * POST /auth/login
   * @throws Error com mensagem do backend
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /auth/register
   * @throws Error com mensagem do backend
   */
  async register(userData: RegisterDto): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/register",
        userData
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /auth/me
   * @throws Error se token inválido
   */
  async me(): Promise<MeResponse> {
    try {
      const { data } = await apiClient.get<MeResponse>("/auth/me");
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /auth/switch-workspace
   * @throws Error se workspace não encontrado
   */
  async switchWorkspace(dto: SwitchWorkspaceDto): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/switch-workspace",
        dto
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

// Export types para uso em outros arquivos
export type {
  LoginDto,
  RegisterDto,
  AuthUser,
  LoginResponse,
  MeResponse,
  SwitchWorkspaceDto,
};
