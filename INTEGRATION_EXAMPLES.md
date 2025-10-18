# 🔧 Exemplos Práticos de Integração

Código completo e funcional para implementar a integração backend-frontend.

**Data:** 17 de outubro de 2025  
**Complementa:** `INTEGRATION_PLAN.md`

---

## 📁 1. API Client Base

### `/frontend/src/lib/api/client.ts`

```typescript
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API === "true";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth:token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(
        `🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Limpar sessão
      localStorage.removeItem("auth:token");

      // Redirecionar para login (se não estiver na página de login)
      if (!window.location.pathname.includes("/login")) {
        console.warn(
          "🚨 Token inválido ou expirado. Redirecionando para login..."
        );
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("🚫 Acesso negado. Você não tem permissão para esta ação.");
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("🔍 Recurso não encontrado.");
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("💥 Erro interno do servidor.");
    }

    // Log error em desenvolvimento
    if (import.meta.env.DEV) {
      console.error("❌ API Error:", {
        method: error.config?.method,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// ==========================================
// HELPER: Extract Error Message
// ==========================================
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Backend retorna { message: string } ou { message: string[], error: string, statusCode: number }
    const backendMessage = error.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.join(", ");
    }

    if (typeof backendMessage === "string") {
      return backendMessage;
    }

    // Fallback para mensagens HTTP padrão
    switch (error.response?.status) {
      case 400:
        return "Dados inválidos. Verifique os campos.";
      case 401:
        return "Credenciais inválidas. Faça login novamente.";
      case 403:
        return "Você não tem permissão para esta ação.";
      case 404:
        return "Recurso não encontrado.";
      case 409:
        return "Conflito. Este recurso já existe.";
      case 500:
        return "Erro interno do servidor. Tente novamente mais tarde.";
      default:
        return "Erro ao processar requisição.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido.";
}

// ==========================================
// HELPER: Check if Mock Mode
// ==========================================
export function isMockMode(): boolean {
  return ENABLE_MOCK;
}
```

---

## 🔐 2. Auth Service Complete

### `/frontend/src/lib/api/endpoints/auth.ts`

```typescript
import { apiClient, extractErrorMessage } from "../client";
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  MeResponse,
  SwitchWorkspaceDto,
} from "@/shared-types";

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
```

---

## 👤 3. Refactored useAuth Hook

### `/frontend/src/features/auth/hooks/useAuth.tsx`

```typescript
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authApi } from "@/lib/api";
import { mockLogin, mockRegister, mockGetUserByToken } from "../data/mockAuth";
import type { AuthUser } from "@/shared-types";

const STORAGE_TOKEN_KEY = "auth:token";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  workspaceName: string;
  position?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // VALIDATE TOKEN ON MOUNT
  // ==========================================
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Tentar validar com backend
        const response = await authApi.me();
        setUser(response.user);
        console.log("✅ Usuário autenticado:", response.user.name);
      } catch (err) {
        // Fallback para mock se API falhar
        if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
          console.warn("⚠️ API falhou na validação, usando mock data");
          const mockUser = mockGetUserByToken(token);
          if (mockUser) {
            setUser(mockUser);
            console.log("✅ Usuário autenticado (mock):", mockUser.name);
          } else {
            localStorage.removeItem(STORAGE_TOKEN_KEY);
          }
        } else {
          // Token inválido - limpar
          console.warn("❌ Token inválido, limpando sessão");
          localStorage.removeItem(STORAGE_TOKEN_KEY);
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Tentar login com backend
      const response = await authApi.login({ email, password });

      // Salvar token
      localStorage.setItem(STORAGE_TOKEN_KEY, response.access_token);

      // Atualizar estado
      setUser(response.user);

      console.log("✅ Login bem-sucedido:", response.user.name);
    } catch (err: any) {
      // Fallback para mock se API falhar
      if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
        console.warn("⚠️ API falhou no login, usando mock data");
        try {
          const mockResponse = await mockLogin(email, password);
          localStorage.setItem(STORAGE_TOKEN_KEY, mockResponse.token);
          setUser(mockResponse.user);
          console.log("✅ Login mock bem-sucedido:", mockResponse.user.name);
        } catch (mockErr: any) {
          setError(mockErr.message);
          throw mockErr;
        }
      } else {
        // Erro real da API
        setError(err.message);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // REGISTER
  // ==========================================
  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      // Tentar registro com backend
      const response = await authApi.register(data);

      // Salvar token
      localStorage.setItem(STORAGE_TOKEN_KEY, response.access_token);

      // Atualizar estado
      setUser(response.user);

      console.log("✅ Registro bem-sucedido:", response.user.name);
    } catch (err: any) {
      // Fallback para mock se API falhar
      if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
        console.warn("⚠️ API falhou no registro, usando mock data");
        try {
          const mockResponse = await mockRegister(data);
          localStorage.setItem(STORAGE_TOKEN_KEY, mockResponse.token);
          setUser(mockResponse.user);
          console.log("✅ Registro mock bem-sucedido:", mockResponse.user.name);
        } catch (mockErr: any) {
          setError(mockErr.message);
          throw mockErr;
        }
      } else {
        // Erro real da API
        setError(err.message);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    console.log("👋 Logout realizado");
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
```

---

## 👥 4. Users Service Complete

### `/frontend/src/lib/api/endpoints/users.ts`

```typescript
import { apiClient, extractErrorMessage } from "../client";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  PaginatedResponse,
} from "@/shared-types";

export const usersApi = {
  /**
   * GET /users?page=1&limit=10&search=nome
   */
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<User>>("/users", {
        params,
      });
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /users/search?q=nome
   */
  async search(query: string): Promise<User[]> {
    try {
      const { data } = await apiClient.get<User[]>("/users/search", {
        params: { q: query },
      });
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /users/:id
   */
  async getById(id: string): Promise<User> {
    try {
      const { data } = await apiClient.get<User>(`/users/${id}`);
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /users
   */
  async create(user: CreateUserDto): Promise<User> {
    try {
      const { data } = await apiClient.post<User>("/users", user);
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /users/:id
   */
  async update(id: string, user: UpdateUserDto): Promise<User> {
    try {
      const { data } = await apiClient.patch<User>(`/users/${id}`, user);
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /users/:id/password
   */
  async updatePassword(
    id: string,
    passwords: UpdatePasswordDto
  ): Promise<void> {
    try {
      await apiClient.patch(`/users/${id}/password`, passwords);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * DELETE /users/:id (soft delete)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
```

---

## 🏆 5. Teams Service Complete

### `/frontend/src/lib/api/endpoints/teams.ts`

```typescript
import { apiClient, extractErrorMessage } from "../client";
import type {
  Team,
  TeamDetail,
  TeamMember,
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  UpdateMemberRoleDto,
} from "@/shared-types";

export const teamsApi = {
  /**
   * GET /teams
   */
  async list(): Promise<Team[]> {
    try {
      const { data } = await apiClient.get<Team[]>("/teams");
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /teams/search?q=nome
   */
  async search(query: string): Promise<Team[]> {
    try {
      const { data } = await apiClient.get<Team[]>("/teams/search", {
        params: { q: query },
      });
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /teams/:id
   */
  async getById(id: string): Promise<TeamDetail> {
    try {
      const { data } = await apiClient.get<TeamDetail>(`/teams/${id}`);
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /teams
   */
  async create(team: CreateTeamDto): Promise<Team> {
    try {
      const { data } = await apiClient.post<Team>("/teams", team);
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /teams/:id
   */
  async update(id: string, team: UpdateTeamDto): Promise<Team> {
    try {
      const { data } = await apiClient.patch<Team>(`/teams/${id}`, team);
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * DELETE /teams/:id (soft delete)
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /teams/:id/members
   */
  async getMembers(id: string): Promise<TeamMember[]> {
    try {
      const { data } = await apiClient.get<TeamMember[]>(
        `/teams/${id}/members`
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /teams/:id/members
   */
  async addMember(id: string, member: AddMemberDto): Promise<TeamMember> {
    try {
      const { data } = await apiClient.post<TeamMember>(
        `/teams/${id}/members`,
        member
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /teams/:id/members/:userId
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    dto: UpdateMemberRoleDto
  ): Promise<TeamMember> {
    try {
      const { data } = await apiClient.patch<TeamMember>(
        `/teams/${teamId}/members/${userId}`,
        dto
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * DELETE /teams/:id/members/:userId
   */
  async removeMember(teamId: string, userId: string): Promise<void> {
    try {
      await apiClient.delete(`/teams/${teamId}/members/${userId}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
```

---

## 📊 6. Management Service Complete

### `/frontend/src/lib/api/endpoints/management.ts`

```typescript
import { apiClient, extractErrorMessage } from "../client";
import type {
  ManagementRule,
  CreateRuleDto,
  Subordinate,
  ManagedTeam,
  CheckManagesResponse,
} from "@/shared-types";

export const managementApi = {
  /**
   * GET /management/subordinates
   */
  async getSubordinates(): Promise<Subordinate[]> {
    try {
      const { data } = await apiClient.get<Subordinate[]>(
        "/management/subordinates"
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /management/teams
   */
  async getManagedTeams(): Promise<ManagedTeam[]> {
    try {
      const { data } = await apiClient.get<ManagedTeam[]>("/management/teams");
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /management/rules (ADMIN only)
   */
  async getAllRules(): Promise<ManagementRule[]> {
    try {
      const { data } = await apiClient.get<ManagementRule[]>(
        "/management/rules"
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /management/rules
   */
  async createRule(rule: CreateRuleDto): Promise<ManagementRule> {
    try {
      const { data } = await apiClient.post<ManagementRule>(
        "/management/rules",
        rule
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * DELETE /management/rules/:id
   */
  async deleteRule(id: string): Promise<void> {
    try {
      await apiClient.delete(`/management/rules/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /management/check/:userId
   */
  async checkIfManages(userId: string): Promise<CheckManagesResponse> {
    try {
      const { data } = await apiClient.get<CheckManagesResponse>(
        `/management/check/${userId}`
      );
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
```

---

## 📦 7. Barrel Exports

### `/frontend/src/lib/api/index.ts`

```typescript
export { apiClient, extractErrorMessage, isMockMode } from "./client";
export { authApi } from "./endpoints/auth";
export { usersApi } from "./endpoints/users";
export { teamsApi } from "./endpoints/teams";
export { managementApi } from "./endpoints/management";
export { workspacesApi } from "./endpoints/workspaces";
```

---

## 🎨 8. Toast Notification System

### `/frontend/src/components/Toast.tsx`

```typescript
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).substring(7);
      const toast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string) => showToast("success", message),
    [showToast]
  );
  const error = useCallback(
    (message: string) => showToast("error", message),
    [showToast]
  );
  const warning = useCallback(
    (message: string) => showToast("warning", message),
    [showToast]
  );
  const info = useCallback(
    (message: string) => showToast("info", message),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      iconColor: "text-green-500",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      iconColor: "text-red-500",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      iconColor: "text-amber-500",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      iconColor: "text-blue-500",
    },
  };

  const { icon: Icon, bg, border, text, iconColor } = config[toast.type];

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border
        ${bg} ${border} ${text}
        animate-in slide-in-from-right duration-300
        min-w-[320px] max-w-md
      `}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}
```

---

## 🔧 9. Environment Variables

### `/frontend/.env.development`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Mock API Fallback (true = usa mock se API falhar, false = só API real)
VITE_ENABLE_MOCK_API=true

# Feature Flags
VITE_ENABLE_WORKSPACES=true
VITE_ENABLE_TEAMS=true
VITE_ENABLE_MANAGEMENT=true
```

### `/frontend/.env.production`

```env
# API Configuration
VITE_API_BASE_URL=https://api.forge.com/api

# Mock API Fallback (desativado em produção)
VITE_ENABLE_MOCK_API=false

# Feature Flags
VITE_ENABLE_WORKSPACES=true
VITE_ENABLE_TEAMS=true
VITE_ENABLE_MANAGEMENT=true
```

---

## 🧪 10. Testing Example

### `/frontend/src/lib/api/__tests__/auth.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi } from "../endpoints/auth";
import { apiClient } from "../client";

// Mock axios
vi.mock("../client", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  extractErrorMessage: (err: any) => err.message || "Erro desconhecido",
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const mockResponse = {
        data: {
          access_token: "fake-token",
          user: {
            id: "1",
            name: "Test User",
            email: "test@test.com",
            workspaceId: "ws-1",
            workspaceRole: "MEMBER",
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await authApi.login({
        email: "test@test.com",
        password: "password",
      });

      expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@test.com",
        password: "password",
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error on invalid credentials", async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce({
        response: { data: { message: "Invalid credentials" } },
      });

      await expect(
        authApi.login({ email: "wrong@test.com", password: "wrong" })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("me", () => {
    it("should fetch current user", async () => {
      const mockResponse = {
        data: {
          user: {
            id: "1",
            name: "Test User",
            email: "test@test.com",
            workspaceId: "ws-1",
            workspaceRole: "MEMBER",
          },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await authApi.me();

      expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

---

## 📝 11. Usage Examples

### Login Flow

```typescript
import { useAuth } from "@/features/auth";
import { useToast } from "@/components/Toast";

function LoginPage() {
  const { login, loading } = useAuth();
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      success("Login realizado com sucesso!");
      // Navegação automática via redirect
    } catch (err: any) {
      error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
    </form>
  );
}
```

### Create User Flow

```typescript
import { usersApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

function CreateUserModal() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateUserDto) => {
    setLoading(true);
    try {
      const newUser = await usersApi.create(data);
      success(`Usuário ${newUser.name} criado com sucesso!`);
      onClose();
      onRefresh();
    } catch (err: any) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit}>{/* form fields */}</form>
    </Modal>
  );
}
```

### Create Team Flow

```typescript
import { teamsApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

function CreateTeamModal() {
  const { success, error } = useToast();

  const handleCreate = async (data: CreateTeamDto) => {
    try {
      const team = await teamsApi.create(data);
      success(`Time ${team.name} criado!`);

      // Adicionar membros se fornecidos
      if (memberIds.length > 0) {
        for (const userId of memberIds) {
          await teamsApi.addMember(team.id, { userId, role: "MEMBER" });
        }
        success(`${memberIds.length} membros adicionados!`);
      }

      onClose();
    } catch (err: any) {
      error(err.message);
    }
  };

  return <TeamForm onSubmit={handleCreate} />;
}
```

---

**Última Atualização:** 17 de outubro de 2025  
**Status:** ✅ Código pronto para implementação
