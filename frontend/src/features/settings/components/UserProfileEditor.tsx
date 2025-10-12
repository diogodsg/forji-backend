import { useState, useEffect } from "react";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useAdminUpdateProfile } from "../hooks/useAdminUpdateProfile";
import { useAuth } from "@/features/auth";
import { GamificationFeedbackPanel } from "@/features/gamification/components/GamificationFeedbackPanel";
import type { UpdateProfileDto, UserProfile } from "../types/settings";

interface Props {
  user: UserProfile;
  isAdminMode?: boolean;
  onSuccess?: (updatedUser: UserProfile) => void;
  onClose?: () => void;
}

export function UserProfileEditor({
  user,
  isAdminMode = false,
  onSuccess,
  onClose,
}: Props) {
  const { user: currentUser } = useAuth();
  const {
    updateProfile,
    loading: selfLoading,
    error: selfError,
  } = useUpdateProfile();
  const {
    updateUserProfile,
    loading: adminLoading,
    error: adminError,
  } = useAdminUpdateProfile();

  const loading = isAdminMode ? adminLoading : selfLoading;
  const error = isAdminMode ? adminError : selfError;

  const [formData, setFormData] = useState({
    name: user.name || "",
    position: user.position || "",
    bio: user.bio || "",
    githubId: user.githubId || "",
  });

  const [isEditing, setIsEditing] = useState(isAdminMode); // Admin mode starts in editing mode
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

  // Show feedback panel only in admin mode and for different users
  const canGiveFeedback =
    isAdminMode && currentUser && currentUser.id !== user.id;

  useEffect(() => {
    setFormData({
      name: user.name || "",
      position: user.position || "",
      bio: user.bio || "",
      githubId: user.githubId || "",
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: UpdateProfileDto = {};
    if (formData.name !== user.name) updateData.name = formData.name;
    if (formData.position !== user.position)
      updateData.position = formData.position;
    if (formData.bio !== user.bio) updateData.bio = formData.bio;
    if (formData.githubId !== user.githubId)
      updateData.githubId = formData.githubId;

    if (Object.keys(updateData).length === 0) {
      if (!isAdminMode) setIsEditing(false);
      if (isAdminMode && onClose) onClose();
      return;
    }

    let updatedUser: UserProfile | null = null;

    if (isAdminMode) {
      updatedUser = await updateUserProfile(user.id, updateData);
    } else {
      updatedUser = await updateProfile(updateData);
    }

    if (updatedUser) {
      setSaveSuccess(true);
      if (!isAdminMode) setIsEditing(false);
      if (onSuccess) onSuccess(updatedUser);
      if (isAdminMode && onClose) onClose();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      position: user.position || "",
      bio: user.bio || "",
      githubId: user.githubId || "",
    });
    if (!isAdminMode) {
      setIsEditing(false);
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {isAdminMode ? `Perfil de ${user.name}` : "Perfil Pessoal"}
        </h3>
        {!isEditing && !isAdminMode && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Editar
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">
            Perfil atualizado com sucesso!
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email || ""}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            O email não pode ser alterado
          </p>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome completo
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700"
          >
            Cargo/Posição
          </label>
          <input
            type="text"
            id="position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Ex: Desenvolvedor Full Stack"
          />
        </div>

        <div>
          <label
            htmlFor="githubId"
            className="block text-sm font-medium text-gray-700"
          >
            GitHub Username
          </label>
          <input
            type="text"
            id="githubId"
            value={formData.githubId}
            onChange={(e) =>
              setFormData({ ...formData, githubId: e.target.value })
            }
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Ex: johndoe"
          />
          <p className="mt-1 text-xs text-gray-500">
            Usado para vincular automaticamente os PRs
          </p>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio/Descrição
          </label>
          <textarea
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Conte um pouco sobre esta pessoa..."
          />
        </div>

        {isEditing && (
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>

      {/* Gamification Feedback Panel - Only for admins viewing other users */}
      {canGiveFeedback && (
        <div className="border-t border-gray-200 pt-6">
          {!showFeedbackPanel ? (
            <button
              onClick={() => setShowFeedbackPanel(true)}
              className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4 text-left hover:from-indigo-100 hover:to-blue-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-indigo-900">
                    Registrar Ação de Desenvolvimento
                  </div>
                  <div className="text-sm text-indigo-700">
                    Registre feedback, mentoria ou outras ações para {user.name}
                  </div>
                </div>
                <div className="text-indigo-600">→</div>
              </div>
            </button>
          ) : (
            <GamificationFeedbackPanel
              targetUserId={user.id}
              targetUserName={user.name}
              onClose={() => setShowFeedbackPanel(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
