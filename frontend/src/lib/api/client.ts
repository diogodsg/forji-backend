import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.forji.me/api";
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
        `🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        token ? `🔑 Token: ${token.substring(0, 20)}...` : "⚠️ No token"
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

      // Verificar se é o endpoint /auth/me (validação de token)
      const isAuthMeEndpoint = originalRequest.url?.includes("/auth/me");

      // Se for o endpoint de validação de token OU se não houver token, fazer logout
      const hasToken = !!localStorage.getItem("auth:token");

      if (isAuthMeEndpoint || !hasToken) {
        // Limpar sessão
        localStorage.removeItem("auth:token");

        // Redirecionar para login (se não estiver na página de login)
        if (!window.location.pathname.includes("/login")) {
          console.warn(
            "🚨 Token inválido ou expirado. Redirecionando para login..."
          );
          window.location.href = "/login";
        }
      } else {
        // Para outros endpoints, apenas logar o erro mas não fazer logout
        console.error(
          "⚠️ Requisição não autorizada em:",
          originalRequest.url,
          "- Verifique as permissões"
        );
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
