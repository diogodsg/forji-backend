import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !email.trim() ||
      !password.trim() ||
      (mode === "register" && !name.trim())
    ) {
      setError("Preencha os campos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
      }
    } catch (err: any) {
      setError(err.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-3 py-2 rounded border border-surface-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition text-sm";

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-surface-100 to-surface-200" />
      <div className="pointer-events-none select-none opacity-70 absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#c7d2fe,transparent_60%)]" />
      <div className="pointer-events-none select-none opacity-60 absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,#e0f2fe,transparent_55%)]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Painel de identidade / marketing */}
          <div className="md:col-span-3 space-y-6 hidden md:block">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 bg-clip-text text-transparent">
                forge
              </span>
            </h1>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
              Acompanhe Pull Requests, evolução técnica e objetivos de
              desenvolvimento em um só lugar. Versão MVP com edição local de
              PDI, KRs e milestones.
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Dados mockados locais</li>
              <li>• Persistência leve via localStorage</li>
              <li>• Foco em clareza, fluxo rápido e evolução contínua</li>
            </ul>
            <div className="pt-4 text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              v0.0.1 MVP
            </div>
          </div>

          {/* Card de login */}
          <div className="md:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-indigo-400/50 via-indigo-300/40 to-sky-300/40 opacity-0 group-hover:opacity-100 blur transition" />
              <form
                onSubmit={handleSubmit}
                className="relative bg-white/80 backdrop-blur-sm border border-surface-300 rounded-xl shadow-sm p-8 flex flex-col gap-5"
              >
                <div className="space-y-1 text-center mb-2">
                  <h2 className="text-xl font-semibold">
                    {mode === "login" ? "Entrar" : "Criar conta"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {mode === "login"
                      ? "Entre com suas credenciais"
                      : "Registre para continuar"}
                  </p>
                </div>

                {mode === "register" && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Nome
                    </label>
                    <input
                      type="text"
                      className={inputBase}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      aria-label="Nome"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
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

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
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
                      className="absolute inset-y-0 right-0 px-2 text-xs text-indigo-600 hover:text-indigo-700 focus:outline-none"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="text-red-600 text-[11px] font-medium bg-red-50 border border-red-200 rounded px-2 py-1"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white text-sm font-medium h-10 disabled:opacity-60 disabled:cursor-not-allowed shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

                <div className="pt-2 text-[10px] text-gray-400 text-center space-y-2">
                  <div>
                    {mode === "login"
                      ? "Autenticação via API."
                      : "Registro cria usuário no banco."}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode((m) => (m === "login" ? "register" : "login"));
                      setError("");
                    }}
                    className="text-indigo-600 hover:text-indigo-700 text-[10px] font-medium"
                  >
                    {mode === "login" ? "Criar conta" : "Já tenho conta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
