import { createPortal } from "react-dom";
import { useState } from "react";
import { X, Eye, EyeOff, Copy, Check, Key, Sparkles } from "lucide-react";
import type { AdminUser } from "@/features/admin/types";

interface Props {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (
    userId: string,
    newPassword?: string
  ) => Promise<{ success: boolean; generatedPassword?: string }>;
}

export function ChangePasswordModal({
  user,
  isOpen,
  onClose,
  onChangePassword,
}: Props) {
  const [mode, setMode] = useState<"generate" | "custom">("generate");
  const [customPassword, setCustomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    generatedPassword?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await onChangePassword(
        user.id,
        mode === "custom" ? customPassword : undefined
      );
      setResult(response);

      if (mode === "custom") {
        // Para senha customizada, limpa o formulário
        setCustomPassword("");
        setMode("generate");
        setTimeout(() => {
          onClose();
          setResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.generatedPassword) {
      await navigator.clipboard.writeText(result.generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setMode("generate");
    setCustomPassword("");
    setShowPassword(false);
    setResult(null);
    setCopied(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !user) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      <div className="bg-white rounded-2xl border border-surface-300 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-300 bg-gradient-to-r from-white to-surface-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  id="change-password-modal-title"
                  className="text-xl font-semibold text-gray-800 tracking-tight"
                >
                  Alterar Senha
                </h2>
                <p className="text-xs text-gray-500">Reset de senha de admin</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 w-10 transition-all duration-200 hover:bg-surface-100 focus:ring-2 focus:ring-brand-400 focus:outline-none"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-gradient-to-br from-white to-surface-50">
          {/* Informação do usuário */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Alterando senha para:
            </p>
            <div className="bg-surface-50 rounded-lg p-3 border border-surface-200">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Resultado - Senha Gerada */}
          {result?.generatedPassword ? (
            <div className="space-y-4">
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-success-600" />
                  <h3 className="font-semibold text-success-800">
                    Nova senha gerada!
                  </h3>
                </div>
                <div className="bg-white border border-success-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-gray-900 break-all flex-1">
                      {result.generatedPassword}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="flex-shrink-0 p-2 hover:bg-success-100 rounded-lg transition-colors"
                      title="Copiar senha"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-success-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-success-600" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-success-700 mt-2">
                  ⚠️ Copie esta senha antes de fechar. Ela não será exibida
                  novamente.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setMode("generate");
                  }}
                  className="px-4 py-2.5 border border-surface-300 bg-white text-gray-700 rounded-lg hover:bg-surface-100 transition-all duration-200 font-medium"
                >
                  Gerar Nova
                </button>
              </div>
            </div>
          ) : result?.success ? (
            <div className="space-y-4">
              <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-center">
                <Check className="w-8 h-8 text-success-600 mx-auto mb-2" />
                <p className="font-medium text-success-800">
                  Senha alterada com sucesso!
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Modo de senha */}
              <div className="bg-surface-100 rounded-lg p-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="generate"
                    checked={mode === "generate"}
                    onChange={() => setMode("generate")}
                    className="text-brand-600 focus:ring-brand-400"
                  />
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Gerar senha aleatória (recomendado)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="custom"
                    checked={mode === "custom"}
                    onChange={() => setMode("custom")}
                    className="text-brand-600 focus:ring-brand-400"
                  />
                  <Key className="w-4 h-4 text-brand-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Definir senha customizada
                  </span>
                </label>
              </div>

              {/* Campo de senha customizada */}
              {mode === "custom" && (
                <div>
                  <label
                    htmlFor="custom-password"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    Nova senha <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="custom-password"
                      type={showPassword ? "text" : "password"}
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-surface-100 rounded transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 border border-surface-300 bg-white text-gray-700 rounded-lg hover:bg-surface-100 transition-all duration-200 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || (mode === "custom" && customPassword.length < 6)
                  }
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Alterando...
                    </span>
                  ) : mode === "generate" ? (
                    "Gerar Senha"
                  ) : (
                    "Alterar Senha"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
