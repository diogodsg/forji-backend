import { useAuth } from "@/features/auth";
import { UserProfileEditor } from "./UserProfileEditor";
import type { UserProfile } from "../types/settings";

export function ProfileSection() {
  const { user, refreshUser } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Converter AuthUser para UserProfile
  const userProfile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    position: user.position,
    bio: user.bio,
    avatarId: user.avatarId,
  };

  const handleSuccess = async () => {
    await refreshUser(); // Atualizar o contexto de auth quando o perfil for atualizado
  };

  return (
    <UserProfileEditor
      user={userProfile}
      isAdminMode={false}
      onSuccess={handleSuccess}
    />
  );
}
