import { ArrowLeft, Edit3 } from "lucide-react";
import { TeamStats } from "./TeamStats";
import { TeamMembersList } from "./TeamMembersList";
import { useAdminTeams } from "@/features/admin/hooks/useAdminTeams";
import type { TeamDetail } from "@/features/admin/types/team";
import type { TeamMemberRole } from "@/lib/api/endpoints/teams";

interface TeamEditViewProps {
  team: TeamDetail;
  onBack: () => void;
}

export function TeamEditView({ team, onBack }: TeamEditViewProps) {
  const { addMember, removeMember, updateMemberRole } = useAdminTeams();

  const managers = team.memberships?.filter((m) => m.role === "MANAGER") || [];
  const members = team.memberships?.filter((m) => m.role === "MEMBER") || [];

  // Adapter: MANAGER -> LEADER
  const toApiRole = (role: "MANAGER" | "MEMBER"): TeamMemberRole => {
    return role === "MANAGER" ? "LEADER" : "MEMBER";
  };

  // Handlers com integração backend
  const handleAddMember = () => {
    // TODO: Abrir modal de seleção de usuário
    console.log("Add member - implementar modal de seleção");
  };

  const handlePromoteMember = async (userId: string) => {
    try {
      await updateMemberRole(team.id, userId, "LEADER");
    } catch (err) {
      console.error("Erro ao promover membro:", err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember(team.id, userId);
    } catch (err) {
      console.error("Erro ao remover membro:", err);
    }
  };

  const handleChangeRole = async (userId: string) => {
    try {
      // Toggle entre MEMBER e MANAGER
      const currentMember = [...managers, ...members].find(
        (m) => m.user.id === userId
      );
      const newRole: TeamMemberRole =
        currentMember?.role === "MANAGER" ? "MEMBER" : "LEADER";
      await updateMemberRole(team.id, userId, newRole);
    } catch (err) {
      console.error("Erro ao mudar role:", err);
    }
  };

  const handleSave = () => {
    // Salvar mudanças se necessário
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com breadcrumb */}
        <div className="bg-gradient-to-br from-white to-surface-50 rounded-2xl border border-surface-300 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-brand-50 hover:shadow-sm rounded-lg transition-all duration-200 border border-transparent hover:border-brand-200"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-brand-600 transition-colors" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span>Gestão de Equipes</span>
                  <span>/</span>
                  <span className="text-brand-600 font-medium">Editar</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {team.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {team.description || "Sem descrição"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout em duas colunas */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Coluna esquerda: Configurações (35%) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Informações básicas */}
            <div className="bg-gradient-to-br from-white to-surface-50 rounded-2xl border border-surface-300 shadow-lg overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-5 text-white">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  Informações Básicas
                </h2>
                <p className="text-brand-100 text-sm mt-1">
                  Configure os dados da equipe
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  {/* Estatísticas da equipe */}
                  <TeamStats membersCount={team.memberships?.length || 0} />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Equipe
                    </label>
                    <input
                      type="text"
                      defaultValue={team.name}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      defaultValue={team.description || ""}
                      rows={4}
                      placeholder="Descreva o propósito e responsabilidades da equipe..."
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all duration-200 text-sm resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={onBack}
                      className="px-5 py-3 text-gray-600 hover:bg-surface-100 rounded-lg font-semibold text-sm transition-all duration-200 border border-surface-300 hover:border-surface-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita: Membros (65%) */}
          <div className="xl:col-span-3">
            <TeamMembersList
              managers={managers}
              members={members}
              onAddMember={handleAddMember}
              onPromoteMember={handlePromoteMember}
              onRemoveMember={handleRemoveMember}
              onChangeRole={handleChangeRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
