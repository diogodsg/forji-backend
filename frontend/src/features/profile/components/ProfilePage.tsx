import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabNavigation } from "./ProfileTabNavigation";
import { GamificationTab } from "./GamificationTab";
import { useProfile } from "../hooks/useProfile";
import { usePlayerProfile } from "@/features/gamification";
import { CurrentCyclePageOptimized } from "@/features/cycles";
import type { ProfileTab } from "../types/profile";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<ProfileTab>("gamification");

  // Fetch profile data
  const {
    profileData,
    loading: profileLoading,
    error: profileError,
    isCurrentUser,
    canEdit,
    updateAvatar,
  } = useProfile(userId);

  // Fetch gamification data
  const { profile: gamificationProfile, loading: gamificationLoading } =
    usePlayerProfile();

  const handleEditProfile = () => {
    // TODO: Open edit profile modal or navigate to edit page
    console.log("Edit profile clicked");
  };

  console.log("ProfilePage Debug:", {
    userId,
    profileData,
    profileLoading,
    profileError,
    isCurrentUser,
    canEdit,
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-surface-200 rounded-xl h-64 mb-8 animate-pulse" />

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-t-xl h-16 mb-0 animate-pulse" />

          {/* Content Skeleton */}
          <div className="bg-white rounded-b-xl p-6 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-surface-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2 tracking-tight">
            Perfil não encontrado
          </h2>
          <p className="text-surface-600 mb-4 font-medium">
            {profileError || "Não foi possível carregar os dados do perfil."}
          </p>

          {/* Debug Info */}
          <div className="bg-surface-100 rounded-lg p-3 text-left text-xs text-surface-700 mt-4">
            <strong>Debug Info:</strong>
            <br />
            UserId from URL: {userId || "undefined"}
            <br />
            Profile Data: {profileData ? "✅ Loaded" : "❌ Not loaded"}
            <br />
            Loading: {profileLoading ? "Yes" : "No"}
            <br />
            Error: {profileError || "None"}
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats } = profileData;
  const isPublic = !isCurrentUser && !canEdit;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader
            profile={profile}
            stats={stats}
            canEdit={canEdit}
            onEditProfile={handleEditProfile}
            onUpdateAvatar={updateAvatar}
          />
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-surface-0 rounded-xl shadow-soft border border-surface-200 overflow-hidden">
          {/* Tab Navigation */}
          <ProfileTabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCurrentUser={isCurrentUser}
          />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "gamification" && (
              <GamificationTab
                stats={stats}
                badges={gamificationProfile?.badges || []}
                isPublic={isPublic}
                loading={gamificationLoading}
              />
            )}

            {activeTab === "pdi" && <CurrentCyclePageOptimized />}
          </div>
        </div>
      </div>
    </div>
  );
}
