import { Users, Crown, UserPlus, X } from "lucide-react";
import type { TeamDetail } from "@/features/admin/types/team";

type TeamMembership = TeamDetail["memberships"][number];

interface TeamMembersListProps {
  managers: TeamMembership[];
  members: TeamMembership[];
  onAddMember: () => void;
  onPromoteMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onChangeRole: (userId: string) => void;
}

export function TeamMembersList({
  managers,
  members,
  onAddMember,
  onPromoteMember,
  onRemoveMember,
  onChangeRole,
}: TeamMembersListProps) {
  // Unificar todos os membros em uma única lista
  const allMembers = [...managers, ...members];
  const totalMembers = allMembers.length;

  return (
    <div className="bg-white rounded-xl border border-surface-300/60 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-surface-200 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Membros da Equipe</h3>
              <p className="text-brand-100 text-sm">
                {totalMembers} {totalMembers === 1 ? "pessoa" : "pessoas"} na
                equipe
              </p>
            </div>
          </div>
          <button
            onClick={onAddMember}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-brand-600 rounded-lg hover:bg-brand-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista unificada */}
      <div className="p-6">
        {totalMembers === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-surface-900 font-semibold text-lg">
              Nenhum membro na equipe
            </p>
            <p className="text-sm text-surface-500 mt-2">
              Adicione pessoas para começar a colaborar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allMembers.map((membership) => {
              const isManager = membership.role === "MANAGER";
              return (
                <div
                  key={membership.user.id}
                  className="border border-surface-200 rounded-lg p-4 hover:border-brand-300 hover:bg-brand-50/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        {membership.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {membership.user.name}
                          </p>
                          {isManager && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-full">
                              <Crown className="w-3 h-3" />
                              Líder
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {membership.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {!isManager && (
                        <button
                          onClick={() => onPromoteMember(membership.user.id)}
                          className="px-3 py-1.5 text-xs bg-surface-100 text-gray-700 font-medium rounded-lg hover:bg-surface-200 transition-all duration-200 border border-surface-300"
                          title="Promover a líder"
                        >
                          Promover
                        </button>
                      )}
                      {isManager && (
                        <button
                          onClick={() => onChangeRole(membership.user.id)}
                          className="px-3 py-1.5 text-xs bg-surface-100 text-gray-700 font-medium rounded-lg hover:bg-surface-200 transition-all duration-200 border border-surface-300"
                          title="Remover liderança"
                        >
                          Rebaixar
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveMember(membership.user.id)}
                        className="p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
                        title="Remover da equipe"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
