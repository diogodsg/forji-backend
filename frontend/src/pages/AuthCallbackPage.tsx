import { useRef, useState } from "react";
import { useAuth } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

// Persistent logging to survive redirects
const persistLog = (msg: string) => {
  const logs = JSON.parse(sessionStorage.getItem("oauth-logs") || "[]");
  logs.push(`${new Date().toISOString()}: ${msg}`);
  sessionStorage.setItem("oauth-logs", JSON.stringify(logs));
  console.log(msg);
};

/**
 * AuthCallbackPage
 * Handles OAuth callback and processes the token from URL
 */
export default function AuthCallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  // Show logs button
  const showLogs = () => {
    const logs = JSON.parse(sessionStorage.getItem("oauth-logs") || "[]");
    alert(logs.join("\n"));
  };

  // Extract params immediately to use in initial state
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const errorParam = params.get("error");

  // Initialize error state from URL params
  const [error, setError] = useState<string | null>(() => {
    if (errorParam) {
      persistLog("❌ Error from URL params: " + decodeURIComponent(errorParam));
      return decodeURIComponent(errorParam);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(!errorParam);

  // Process token ONLY (errors are handled in initial state)
  if (
    !hasProcessed.current &&
    !error &&
    token &&
    auth &&
    typeof auth.loginWithToken === "function"
  ) {
    hasProcessed.current = true;
    persistLog("✅ Processing token...");

    auth.loginWithToken(token).catch((err) => {
      persistLog("❌ Login error: " + err.message);
      setError(err.message || "Erro ao processar autenticação");
      setIsLoading(false);
    });
  }

  persistLog(`🎨 Render state - error: ${error}, isLoading: ${isLoading}`);

  if (error) {
    persistLog("🔴 Showing error screen");

    // Prevent any navigation away from this page
    window.history.pushState(null, "", window.location.href);

    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-error-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Erro na autenticação
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Voltar para o login
            </button>
            <button
              onClick={showLogs}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Ver Logs de Debug
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">
          Processando login com Google...
        </p>
      </div>
    </div>
  );
}
