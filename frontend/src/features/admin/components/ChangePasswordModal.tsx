import { useState } from "react";
import { FiX, FiEye, FiEyeOff, FiCopy, FiCheck } from "react-icons/fi";
import type { AdminUser } from "../types";

interface Props {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (
    userId: number,
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

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Alterar Senha</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Alterando senha para:</p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          {result?.generatedPassword ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">
                  Nova senha gerada com sucesso!
                </h3>
                <div className="bg-white border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-900">
                      {result.generatedPassword}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="ml-2 p-1.5 hover:bg-green-100 rounded transition-colors"
                      title="Copiar senha"
                    >
                      {copied ? (
                        <FiCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <FiCopy className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  Certifique-se de copiar esta senha antes de fechar.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setMode("generate");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Gerar Nova
                </button>
              </div>
            </div>
          ) : result?.success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <FiCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-800">
                  Senha alterada com sucesso!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de senha
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      value="generate"
                      checked={mode === "generate"}
                      onChange={(e) => setMode(e.target.value as "generate")}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Gerar senha automática (recomendado)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      value="custom"
                      checked={mode === "custom"}
                      onChange={(e) => setMode(e.target.value as "custom")}
                      className="mr-2"
                    />
                    <span className="text-sm">Definir senha personalizada</span>
                  </label>
                </div>
              </div>

              {mode === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || (mode === "custom" && customPassword.length < 6)
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading
                    ? "Alterando..."
                    : mode === "generate"
                    ? "Gerar Senha"
                    : "Alterar Senha"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
