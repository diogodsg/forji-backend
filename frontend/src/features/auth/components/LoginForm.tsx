import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export interface LoginFormProps {
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ className = "" }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputBase =
    "w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all duration-150 text-sm placeholder:text-gray-400";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !email.trim() ||
      !password.trim() ||
      (mode === "register" && !name.trim())
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
        // O redirect acontece automaticamente quando user muda no AuthContext
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
        // O redirect acontece automaticamente quando user muda no AuthContext
      }
    } catch (err: any) {
      // Capturar e exibir mensagem de erro
      const errorMessage =
        err?.message ||
        err?.toString() ||
        "Erro ao autenticar. Verifique suas credenciais.";
      setError(errorMessage);
      console.error("Erro no login/registro:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative bg-white border border-surface-300 rounded-xl shadow-lg p-8 flex flex-col gap-5 ${className}`}
    >
      <div className="space-y-1.5 text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h2>
        <p className="text-sm text-gray-500">
          {mode === "login" ? "Acesse sua conta" : "Comece sua jornada"}
        </p>
      </div>
      {mode === "register" && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Nome
          </label>
          <input
            type="text"
            className={inputBase}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            aria-label="Nome"
          />
        </div>
      )}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          className={inputBase}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          placeholder="voce@exemplo.com"
          aria-label="Email"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Senha
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={inputBase + " pr-10"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-label="Senha"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-brand-600 hover:text-brand-700 focus:outline-none transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>
      {error && (
        <div
          className="text-error-700 text-xs font-medium bg-error-50 border border-error-200 rounded-lg px-3 py-2"
          role="alert"
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 transition-all duration-150 text-white text-sm font-semibold h-11 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
        )}
        {loading
          ? mode === "login"
            ? "Entrando..."
            : "Registrando..."
          : mode === "login"
          ? "Entrar"
          : "Registrar"}
      </button>
      {/* <div className="pt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "login" ? "register" : "login"));
            setError("");
          }}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors hover:underline"
        >
          {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
        </button>
      </div> */}
      <div className="pt-3 text-center"></div>
    </form>
  );
};
