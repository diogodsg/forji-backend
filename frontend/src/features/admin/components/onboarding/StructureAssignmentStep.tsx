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
  const [managerSearch, setManagerSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const selectedManager = allManagers.find(
    (m) =>
      m.id === (assignments[userId]?.managerId || assignments[userId]?.manager)
  );
  const selectedTeam = teams.find(
    (t) => t.id === (assignments[userId]?.teamId || assignments[userId]?.team)
  );

  const filteredManagers = allManagers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(managerSearch.toLowerCase()) ||
      manager.email.toLowerCase().includes(managerSearch.toLowerCase())
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  return (
    <div className="p-4 border border-surface-200 rounded-xl bg-gradient-to-br from-white to-surface-50 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header com Avatar - Mais compacto */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-surface-200">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">{name}</p>
          <p className="text-xs text-gray-600">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Manager Select */}
        <div className="relative">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-800 mb-1.5">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            Gerente{" "}
            <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          {allManagers.length > 0 ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar gerente..."
                value={
                  selectedManager
                    ? `${selectedManager.name} (${selectedManager.email})`
                    : managerSearch
                }
                onChange={(e) => {
                  setManagerSearch(e.target.value);
                  setShowManagerDropdown(true);
                  if (!e.target.value && selectedManager) {
                    onAssignment(userId, "manager", "");
                  }
                }}
                onFocus={() => setShowManagerDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowManagerDropdown(false), 200)
                }
                className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200 hover:border-brand-300"
              />
              {showManagerDropdown && filteredManagers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-surface-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {filteredManagers.map((manager) => (
                    <button
                      key={manager.id}
                      type="button"
                      onClick={() => {
                        onAssignment(userId, "manager", manager.id);
                        setManagerSearch("");
                        setShowManagerDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-brand-50 transition-colors text-sm border-b border-surface-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">
                        {manager.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {manager.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full px-3 py-2.5 rounded-lg border border-warning-200 bg-warning-50 text-sm text-warning-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Nenhum gerente disponível no sistema</span>
            </div>
          )}
        </div>

        {/* Team Select */}
        <div className="relative">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Equipe <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          {loadingTeams ? (
            <div className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-surface-50 text-sm text-gray-500">
              Carregando equipes...
            </div>
          ) : teams.length > 0 ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar equipe..."
                value={selectedTeam ? selectedTeam.name : teamSearch}
                onChange={(e) => {
                  setTeamSearch(e.target.value);
                  setShowTeamDropdown(true);
                  if (!e.target.value && selectedTeam) {
                    onAssignment(userId, "team", "");
                  }
                }}
                onFocus={() => setShowTeamDropdown(true)}
                onBlur={() => setTimeout(() => setShowTeamDropdown(false), 200)}
                className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200 hover:border-brand-300"
              />
              {showTeamDropdown && filteredTeams.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-surface-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => {
                        onAssignment(userId, "team", team.id);
                        setTeamSearch("");
                        setShowTeamDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-brand-50 transition-colors text-sm border-b border-surface-100 last:border-b-0"
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
