export interface TeamSummary {
  id: string; // UUID do backend
  name: string;
  description?: string | null;
  managers: number; // count
  members: number; // total memberships
  leaderName?: string | null; // name of the leader
  createdAt?: string; // ISO date (added from backend list)
}

export interface TeamMember {
  userId: string; // UUID do backend
  id: string; // membership id
  name: string;
  email: string;
  avatarId?: string;
  role: "MEMBER" | "MANAGER";
}

export interface TeamDetail {
  id: string; // UUID do backend
  name: string;
  description?: string | null;
  memberships: Array<{
    user: { id: string; name: string; email: string; avatarId?: string }; // UUID do backend
    role: "MEMBER" | "MANAGER";
  }>;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
}

export interface AddTeamMemberInput {
  teamId: string; // UUID
  userId: string; // UUID
  role?: "MEMBER" | "MANAGER";
}

export interface UpdateTeamMemberRoleInput {
  teamId: string; // UUID
  userId: string; // UUID
  role: "MEMBER" | "MANAGER";
}

// Aggregated metrics returned by /teams/metrics
export interface TeamMetrics {
  totalTeams: number;
  totalManagers: number;
  totalMembers: number;
  usersWithoutTeam: number;
  lastTeamCreatedAt: string | null;
}
