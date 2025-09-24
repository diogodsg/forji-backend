export interface TeamSummary {
  id: number;
  name: string;
  description?: string | null;
  managers: number; // count
  members: number; // total memberships
  createdAt?: string; // ISO date (added from backend list)
}

export interface TeamMember {
  userId: number;
  id: number; // membership id not returned yet (placeholder)
  name: string;
  email: string;
  role: "MEMBER" | "MANAGER";
}

export interface TeamDetail {
  id: number;
  name: string;
  description?: string | null;
  memberships: Array<{
    user: { id: number; name: string; email: string };
    role: "MEMBER" | "MANAGER";
  }>;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
}

export interface AddTeamMemberInput {
  teamId: number;
  userId: number;
  role?: "MEMBER" | "MANAGER";
}

export interface UpdateTeamMemberRoleInput {
  teamId: number;
  userId: number;
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
