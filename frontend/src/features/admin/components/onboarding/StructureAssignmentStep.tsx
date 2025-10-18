import { AlertCircle, User, Users, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { teamsApi, type Team } from "@/lib/api/endpoints/teams";
import type { AdminUser } from "../../types";
import type { Assignments, NewUserData } from "./types";

interface StructureAssignmentStepProps {
  isCreatingNewUser: boolean;
  newUserData?: NewUserData;
  selectedUsers: string[]; // UUID[]
  users: AdminUser[];
  allManagers: AdminUser[];
  assignments: Assignments;
  onAssignment: (
    userId: string, // UUID
    field: "manager" | "team",
    value: string // UUID
  ) => void;
}

export function StructureAssignmentStep({
  isCreatingNewUser,
  newUserData,
  selectedUsers,
  users,
  allManagers,
  assignments,
  onAssignment,
}: StructureAssignmentStepProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Carregar equipes do backend
  useEffect(() => {
    async function fetchTeams() {
      try {
        const teamsList = await teamsApi.findAll({ includeMemberCount: false });
        setTeams(teamsList);
      } catch (err) {
        console.error("Erro ao carregar equipes:", err);
      } finally {
        setLoadingTeams(false);
      }
    }
    fetchTeams();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Definir estrutura organizacional
      </h3>
      <div className="space-y-4">
        {isCreatingNewUser && newUserData ? (
          // Nova pessoa
          <AssignmentCard
            name={newUserData.name || "Nova pessoa"}
            email={newUserData.email}
            userId="new"
            allManagers={allManagers}
            teams={teams}
            loadingTeams={loadingTeams}
            assignments={assignments}
            onAssignment={onAssignment}
          />
        ) : (
          // Pessoas existentes
          selectedUsers.map((userId) => {
            const user = users.find((u) => u.id === userId)!;
            return (
              <AssignmentCard
                key={userId}
                name={user.name}
                email={user.email}
                userId={userId}
                allManagers={allManagers.filter((m) => m.id !== userId)}
                teams={teams}
                loadingTeams={loadingTeams}
                assignments={assignments}
                onAssignment={onAssignment}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface AssignmentCardProps {
  name: string;
  email: string;
  userId: string; // UUID
  allManagers: AdminUser[];
  teams: Team[];
  loadingTeams: boolean;
  assignments: Assignments;
  onAssignment: (
    userId: string, // UUID
    field: "manager" | "team",
    value: string // UUID
  ) => void;
}

function AssignmentCard({
  name,
  email,
  userId,
  allManagers,
  teams,
  loadingTeams,
  assignments,
  onAssignment,
}: AssignmentCardProps) {
  const hasManagers = allManagers.length > 0;

  return (
    <div className="p-5 border border-surface-200 rounded-xl bg-gradient-to-br from-white to-surface-50 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header com Avatar */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-surface-200">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
            <Users className="w-4 h-4 text-brand-600" />
            Gerente{" "}
            {!hasManagers && (
              <span className="text-gray-500 font-normal">(opcional)</span>
            )}
          </label>
          {hasManagers ? (
            <select
              value={
                assignments[userId]?.managerId ||
                assignments[userId]?.manager ||
                ""
              }
              onChange={(e) => onAssignment(userId, "manager", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200 hover:border-brand-300"
            >
              <option value="">Selecionar gerente...</option>
              {allManagers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full px-3 py-2.5 rounded-lg border border-warning-200 bg-warning-50 text-sm text-warning-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Nenhum gerente disponível no sistema</span>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Equipe <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          {loadingTeams ? (
            <div className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-surface-50 text-sm text-gray-500">
              Carregando equipes...
            </div>
          ) : teams.length > 0 ? (
            <select
              value={
                assignments[userId]?.teamId || assignments[userId]?.team || ""
              }
              onChange={(e) => onAssignment(userId, "team", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200 hover:border-brand-300"
            >
              <option value="">Selecionar equipe...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full px-3 py-2.5 rounded-lg border border-warning-200 bg-warning-50 text-sm text-warning-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Nenhuma equipe disponível no sistema</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
