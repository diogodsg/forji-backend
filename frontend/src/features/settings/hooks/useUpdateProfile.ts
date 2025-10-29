import { useState } from "react";
import { api } from "@/lib/apiClient";
import type { UpdateProfileDto, UserProfile } from "../types/settings";
import { useAuth } from "@/features/auth";

export function useUpdateProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    data: UpdateProfileDto
  ): Promise<UserProfile | null> => {
    if (!user?.id) {
      setError("Usuário não autenticado");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api<UserProfile>(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        auth: true,
      });
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}
