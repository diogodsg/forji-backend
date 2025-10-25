import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, AuthContextValue } from "../types/auth";
import { mockLogin, mockRegister, mockGetUserByToken } from "../data/mockAuth";
import { authApi, extractErrorMessage } from "@/lib/api";
import { useToast } from "@/components/Toast";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Local storage keys para auth mock
 */
const STORAGE_TOKEN_KEY = "auth:token";

/**
 * Transforma o user do backend (com currentWorkspaceRole) para o formato esperado pelo frontend (com isAdmin/isManager)
 */
function transformBackendUser(backendUser: any): AuthUser {
  const workspaceRole = (backendUser.currentWorkspaceRole ||
    backendUser.workspaceRole) as "OWNER" | "ADMIN" | "MEMBER";

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    position: backendUser.position,
    bio: backendUser.bio,
    avatarId: backendUser.avatarId,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
    workspaceId: backendUser.currentWorkspaceId || backendUser.workspaceId, // Adiciona workspaceId
    // OWNER e ADMIN tem permissões de admin
    isAdmin: workspaceRole === "OWNER" || workspaceRole === "ADMIN",
    // Por enquanto, OWNER e ADMIN também são managers (pode ajustar depois)
    isManager: workspaceRole === "OWNER" || workspaceRole === "ADMIN",
  };
}

/**
 * AuthProvider - Context API para autenticação
 *
 * Arquitetura:
 * - Usa React Context API (não Zustand) pois auth é:
 *   1. Estado global essencial (compartilhado em toda app)
 *   2. Necessário antes da árvore de componentes renderizar
 *   3. Tem lógica de ciclo de vida (useEffect para token validation)
 *   4. Beneficia de composição via Provider pattern
 *
 * - API Integration: Chamadas reais ao backend NestJS
 * - Fallback to Mock: Se VITE_ENABLE_MOCK_API=true, usa mock em caso de erro
 * - Token JWT armazenado no localStorage
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_TOKEN_KEY)
      : null
  );

  // Toast notifications
  const toast = useToast();

  /**
   * Valida token e carrega usuário ao montar ou quando token muda
   */
  const validateToken = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Tenta validar com API real
      const response = await authApi.me();
      const transformedUser = transformBackendUser(response.user);
      setUser(transformedUser);
      console.log("✅ Usuário autenticado via API:", transformedUser.name);
      console.log("🔐 Permissões:", {
        isAdmin: transformedUser.isAdmin,
        isManager: transformedUser.isManager,
      });
    } catch (error) {
      console.error(
        "❌ Erro ao validar token na API:",
        extractErrorMessage(error)
      );

      // Fallback para mock se habilitado
      if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
        try {
          const userData = mockGetUserByToken(token);
          if (userData) {
            setUser(userData);
            console.log("⚠️ Fallback para mock - Usuário:", userData.name);
            console.log("🔍 Debug user:", {
              isAdmin: userData.isAdmin,
              isManager: userData.isManager,
            });
            setLoading(false);
            return;
          }
        } catch (mockError) {
          console.error("❌ Erro no fallback mock:", mockError);
        }
      }

      // Token inválido ou erro sem fallback
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  /**
   * Login com API real + fallback para mock
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        // Tenta login via API real
        const response = await authApi.login({ email, password });

        // Transformar user do backend para formato frontend
        const transformedUser = transformBackendUser(response.user);

        // Armazenar token JWT
        localStorage.setItem(STORAGE_TOKEN_KEY, response.accessToken);
        setToken(response.accessToken);
        setUser(transformedUser);

        console.log(
          "🔑 Token salvo:",
          response.accessToken.substring(0, 20) + "..."
        );
        console.log("👤 User setado:", transformedUser);
        console.log("🔐 Permissões:", {
          isAdmin: transformedUser.isAdmin,
          isManager: transformedUser.isManager,
        });

        toast.success(
          `Bem-vindo de volta, ${response.user.name}!`,
          "Login realizado"
        );
        console.log("✅ Login bem-sucedido via API:", response.user.name);
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        console.error("❌ Erro no login via API:", errorMsg);

        // Fallback para mock se habilitado
        if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
          try {
            const { user: userData, token: authToken } = await mockLogin(
              email,
              password
            );

            localStorage.setItem(STORAGE_TOKEN_KEY, authToken);
            setToken(authToken);
            setUser(userData);

            console.log(
              "🔑 Mock token salvo:",
              authToken.substring(0, 30) + "..."
            );
            console.log("👤 Mock user setado:", userData);

            toast.warning(
              "Usando dados mockados (modo desenvolvimento)",
              "Fallback ativo"
            );
            console.log("⚠️ Login com fallback mock:", userData.name);
            return;
          } catch (mockError) {
            // Propagar erro do mock para o usuário
            const mockErrorMsg = extractErrorMessage(mockError);
            console.error("❌ Erro no fallback mock:", mockErrorMsg);
            toast.error(mockErrorMsg, "Erro no login");
            throw new Error(mockErrorMsg);
          }
        }

        // Se chegou aqui, erro sem fallback
        toast.error(errorMsg, "Erro no login");
        throw error;
      }
    },
    [toast]
  );

  /**
   * Registro com API real + fallback para mock
   */
  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      workspaceName?: string;
    }) => {
      try {
        // Backend exige workspaceName, usa valor padrão se não fornecido
        const workspaceName =
          data.workspaceName || `${data.name.split(" ")[0]}'s Workspace`;

        // Tenta registro via API real
        const response = await authApi.register({
          name: data.name,
          email: data.email,
          password: data.password,
          workspaceName,
        });

        // Transformar user do backend para formato frontend
        const transformedUser = transformBackendUser(response.user);

        // Armazenar token JWT
        localStorage.setItem(STORAGE_TOKEN_KEY, response.accessToken);
        setToken(response.accessToken);
        setUser(transformedUser);

        toast.success(
          `Conta criada com sucesso! Bem-vindo, ${response.user.name}!`,
          "Registro completo"
        );
        console.log("✅ Registro bem-sucedido via API:", response.user.name);
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        console.error("❌ Erro no registro via API:", errorMsg);

        // Fallback para mock se habilitado
        if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
          try {
            const { user: userData, token: authToken } = await mockRegister({
              name: data.name,
              email: data.email,
              password: data.password,
            });

            localStorage.setItem(STORAGE_TOKEN_KEY, authToken);
            setToken(authToken);
            setUser(userData);

            toast.warning(
              "Usando dados mockados (modo desenvolvimento)",
              "Fallback ativo"
            );
            console.log("⚠️ Registro com fallback mock:", userData.name);
            return;
          } catch (mockError) {
            // Propagar erro do mock para o usuário
            const mockErrorMsg = extractErrorMessage(mockError);
            console.error("❌ Erro no fallback mock:", mockErrorMsg);
            toast.error(mockErrorMsg, "Erro no registro");
            throw new Error(mockErrorMsg);
          }
        }

        // Se chegou aqui, erro sem fallback
        toast.error(errorMsg, "Erro no registro");
        throw error;
      }
    },
    [toast]
  );

  /**
   * Logout limpa sessão
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    setToken(null);

    toast.info("Até logo! Sessão encerrada.", "Logout");
    console.log("👋 Logout realizado");
  }, [toast]);

  /**
   * Refresh user data via API real
   */
  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await authApi.me();
      setUser(response.user);
      console.log("🔄 Dados do usuário atualizados via API");
    } catch (error) {
      console.error("❌ Erro ao atualizar dados:", extractErrorMessage(error));

      // Fallback para mock se habilitado
      if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
        try {
          const userData = mockGetUserByToken(token);
          if (userData) {
            setUser(userData);
            console.log("🔄 Dados atualizados com fallback mock");
          }
        } catch (mockError) {
          console.error("❌ Erro no fallback mock:", mockError);
        }
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar contexto de autenticação
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
