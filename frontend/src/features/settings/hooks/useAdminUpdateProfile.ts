import { useState } from "react";
import { api } from "@/lib/apiClient";
import type { UpdateProfileDto, UserProfile } from "../types/settings";

export function useAdminUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (
    userId: string,
    data: UpdateProfileDto
  ): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<UserProfile>(`/users/${userId}`, {
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

  return { updateUserProfile, loading, error };
}
