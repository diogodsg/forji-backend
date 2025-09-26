import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import { UserProfileEditor } from "@/features/settings/components/UserProfileEditor";
import { useAdminUsers } from "@/features/admin";
import type { UserProfile } from "@/features/settings/types/settings";

export function AdminUserEditPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, loading } = useAdminUsers();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && users.length > 0 && userId) {
      // Compare as string since API returns IDs as strings
      const user = users.find((u) => String(u.id) === userId);
      if (user) {
        const profile: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          position: (user as any).position || "",
          bio: (user as any).bio || "",
          githubId: user.githubId || undefined,
        };
        setUserProfile(profile);
        console.log("User found and profile set:", profile);
      } else {
        console.error(
          "User not found with ID:",
          userId,
          "Available users:",
          users.map((u) => ({ id: u.id, name: u.name }))
        );
      }
    }
  }, [users, userId, loading]);

  const handleSuccess = () => {
    // Navegar de volta para a página admin
    navigate("/admin");
  };

  const handleBack = () => {
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Usuário não encontrado</div>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="w-4 h-4" />
            Voltar para Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header com botão voltar */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Voltar para Admin
        </button>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-semibold flex items-center justify-center text-lg shadow-inner">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiUser className="w-6 h-6" />
              Editar Usuário
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie as informações de {userProfile.name}
            </p>
          </div>
        </div>
      </div>

      {/* Card principal */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <UserProfileEditor
            user={userProfile}
            isAdminMode={true}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
