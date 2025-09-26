import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, storeToken, clearToken } from "@/lib/apiClient";
import type { AuthUser, AuthContextValue } from "../types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("auth:token") : null
  );

  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api<AuthUser>("/auth/me", { auth: true });
      setUser(me);
    } catch (e) {
      clearToken();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    storeToken(res.access_token);
    setToken(res.access_token);
    setLoading(true);
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      const res = await api<{ access_token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      storeToken(res.access_token);
      setToken(res.access_token);
      setLoading(true);
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (token) {
      try {
        const me = await api<AuthUser>("/auth/me", { auth: true });
        setUser(me);
      } catch (e) {
        // Se falhar, não fazemos logout automático para não interromper a sessão
        console.error("Erro ao atualizar dados do usuário:", e);
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider ausente");
  return ctx;
}
