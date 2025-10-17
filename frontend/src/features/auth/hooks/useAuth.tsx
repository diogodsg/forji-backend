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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Local storage keys para auth mock
 */
const STORAGE_TOKEN_KEY = "auth:token";

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
 * - Mock Data Only: Sem chamadas API reais
 * - Sem Persistência: Dados resetam a cada reload (exceto token no localStorage)
 * - Token mock armazenado para simular sessão entre reloads
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_TOKEN_KEY)
      : null
  );

  /**
   * Valida token e carrega usuário ao montar ou quando token muda
   */
  const validateToken = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Simular delay de validação
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const userData = mockGetUserByToken(token);

      if (!userData) {
        // Token inválido
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setUser(null);
        setToken(null);
        console.log("⚠️ Token mock inválido, sessão limpa");
      } else {
        setUser(userData);
        console.log("✅ Usuário autenticado (mock):", userData.name);
      }
    } catch (e) {
      console.error("❌ Erro ao validar token:", e);
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
   * Login com mock data
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user: userData, token: authToken } = await mockLogin(
        email,
        password
      );

      // Armazenar token
      localStorage.setItem(STORAGE_TOKEN_KEY, authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  }, []);

  /**
   * Registro com mock data
   */
  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      try {
        const { user: userData, token: authToken } = await mockRegister(data);

        // Armazenar token
        localStorage.setItem(STORAGE_TOKEN_KEY, authToken);
        setToken(authToken);
        setUser(userData);
      } catch (error) {
        console.error("❌ Erro no registro:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Logout limpa sessão
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    setToken(null);
    console.log("👋 Logout realizado");
  }, []);

  /**
   * Refresh user data (no mock, apenas revalida o token)
   */
  const refreshUser = useCallback(async () => {
    if (token) {
      try {
        const userData = mockGetUserByToken(token);
        if (userData) {
          setUser(userData);
          console.log("🔄 Dados do usuário atualizados");
        }
      } catch (e) {
        console.error("❌ Erro ao atualizar dados do usuário:", e);
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
