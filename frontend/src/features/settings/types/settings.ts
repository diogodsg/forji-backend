export interface UserProfile {
  id: string; // UUID
  name: string;
  email: string;
  position?: string;
  bio?: string;
  githubId?: string;
}

export interface UpdateProfileDto {
  name?: string;
  position?: string;
  bio?: string;
  githubId?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSession {
  id: string;
  createdAt: string;
  lastActivity: string;
  device?: string;
  location?: string;
  current: boolean;
}

export interface SettingsTab {
  id: "profile" | "account";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
