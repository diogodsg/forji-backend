import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser, AuthContextValue } from "../types/auth";
import { authApi, extractErrorMessage } from "@/lib/api";
import { useToast } from "@/components/Toast";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Local storage key para auth token
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
 * - Token JWT armazenado no localStorage
 * - Sem fallbacks para mock - sempre usa API real
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

  // Navigation hook
  const navigate = useNavigate();

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
    } catch (error) {
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
   * Login com API real
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

        toast.success(
          `Bem-vindo de volta, ${response.user.name}!`,
          "Login realizado"
        );

        // Redirecionar para a página inicial
        navigate("/");
      } catch (error) {
        // Sempre mostrar erro
        toast.error(
          "Email ou senha incorretos. Verifique suas credenciais.",
          "Erro no login"
        );
        throw error;
      }
    },
    [toast, navigate]
  );

  /**
   * Registro com API real
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

        // Redirecionar para a página inicial
        navigate("/");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        console.error("❌ Erro no registro via API:", errorMsg);

        // Sempre mostrar erro, sem fallback para mock
        toast.error(errorMsg, "Erro no registro");
        throw error;
      }
    },
    [toast, navigate]
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
      // Em caso de erro, manter dados atuais sem fazer logout
    }
  }, [token]);

  /**
   * Login with OAuth token (Google, etc)
   */
  const loginWithToken = useCallback(
    async (accessToken: string) => {
      try {
        // Store token
        localStorage.setItem(STORAGE_TOKEN_KEY, accessToken);
        setToken(accessToken);

        // Validate and get user
        const response = await authApi.me();
        const transformedUser = transformBackendUser(response.user);
        setUser(transformedUser);

        toast.success(`Bem-vindo, ${response.user.name}!`, "Login realizado");

        // Redirect to home
        navigate("/");
      } catch (error) {
        console.error("OAuth token validation failed:", error);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setToken(null);
        setUser(null);
        toast.error(
          "Falha ao validar credenciais. Tente novamente.",
          "Erro no login"
        );
        // Don't navigate here - let the caller handle it
        throw error;
      }
    },
    [toast, navigate]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        loginWithToken,
      }}
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
