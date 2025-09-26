import { useState } from "react";
import { useChangePassword } from "../hooks/useChangePassword";

export function AccountSection() {
  const { changePassword, loading, error, success, resetState } =
    useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await changePassword(formData);
    if (success) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error || success) {
      resetState();
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Conta</h3>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie suas configurações de segurança e acesso.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium mb-4">Alterar Senha</h4>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-800">
              Senha alterada com sucesso!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Senha atual
            </label>
            <div className="mt-1 relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showPasswords.current ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Nova senha
            </label>
            <div className="mt-1 relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showPasswords.new ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar nova senha
            </label>
            <div className="mt-1 relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                {showPasswords.confirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Alterando..." : "Alterar Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
