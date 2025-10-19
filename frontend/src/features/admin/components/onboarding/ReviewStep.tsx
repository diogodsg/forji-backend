import { Check, User, Users, Building2, Briefcase, Shield } from "lucide-react";
import type { AdminUser } from "../../types";
import type { Assignments, NewUserData } from "./types";

interface ReviewStepProps {
  isCreatingNewUser: boolean;
  newUserData?: NewUserData;
  selectedUsers: string[]; // UUID[]
  users: AdminUser[];
  allManagers: AdminUser[];
  assignments: Assignments;
}

export function ReviewStep({
  isCreatingNewUser,
  newUserData,
  selectedUsers,
  users,
  allManagers,
  assignments,
}: ReviewStepProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Revisão das configurações
      </h3>
      <div className="space-y-3">
        {isCreatingNewUser && newUserData ? (
          <ReviewCard
            name={newUserData.name}
            email={newUserData.email}
            position={newUserData.position}
            isAdmin={newUserData.isAdmin}
            managerName={
              allManagers.find((m) => m.id === assignments["new"]?.managerId)
                ?.name
            }
            team={assignments["new"]?.team}
            isNew
          />
        ) : (
          selectedUsers.map((userId) => {
            const user = users.find((u) => u.id === userId)!;
            const assignment = assignments[userId];
            const manager = allManagers.find(
              (m) => m.id === assignment?.managerId
            );

            return (
              <ReviewCard
                key={userId}
                name={user.name}
                email={user.email}
                managerName={manager?.name}
                team={assignment?.team}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface ReviewCardProps {
  name: string;
  email: string;
  position?: string;
  isAdmin?: boolean;
  managerName?: string;
  team?: string;
  isNew?: boolean;
}

function ReviewCard({
  name,
  email,
  position,
  isAdmin,
  managerName,
  team,
  isNew,
}: ReviewCardProps) {
  return (
    <div className="p-5 bg-gradient-to-br from-white to-surface-50 rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        {/* Avatar e Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>

        {/* Badge de Status */}
        <span className="inline-flex items-center gap-1.5 bg-success-50 text-success-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-success-200 shadow-sm">
          <Check className="w-3.5 h-3.5" />
          {isNew ? "Nova pessoa" : "Pronto"}
        </span>
      </div>

      {/* Detalhes em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-surface-200">
        {position && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Cargo</p>
              <p className="text-gray-800 font-medium">{position}</p>
            </div>
          </div>
        )}

        {typeof isAdmin !== "undefined" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tipo</p>
              <p className="text-gray-800 font-medium">
                {isAdmin ? "Administrador" : "Usuário"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Gerente</p>
            <p className="text-gray-800 font-medium">
              {managerName || (
                <span className="text-gray-400">Não definido</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Equipe</p>
            <p className="text-gray-800 font-medium">
              {team || <span className="text-gray-400">Não definida</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
