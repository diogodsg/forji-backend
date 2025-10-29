import { useState } from "react";
import { api } from "@/lib/apiClient";
import type { ChangePasswordDto } from "../types/settings";
import { useAuth } from "@/features/auth";

export function useChangePassword() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (data: ChangePasswordDto): Promise<boolean> => {
    if (!user?.id) {
      setError("Usuário não autenticado");
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validação local
    if (data.newPassword !== data.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return false;
    }

    if (data.newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return false;
    }

    try {
      await api(`/users/${user.id}/password`, {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        auth: true,
      });
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao alterar senha");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return { changePassword, loading, error, success, resetState };
}
