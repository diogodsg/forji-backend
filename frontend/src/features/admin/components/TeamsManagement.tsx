import { useState } from "react";
import {
  Users,
  Crown,
  Calendar,
  UserPlus,
  Plus,
  Search,
  Edit3,
  Trash2,
  MoreVertical,
  ArrowLeft,
  User,
} from "lucide-react";
import { useAdminTeams } from "../hooks/useAdminTeams";
import type { TeamSummary, TeamDetail } from "../types/team";

type ViewMode = "list" | "edit" | "create";

export function TeamsManagement() {
  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<
    "all" | "with-manager" | "without-manager"
  >("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [menuOpenTeamId, setMenuOpenTeamId] = useState<number | null>(null);

  // Hooks para dados
  const {
    teams,
    loading,
    error,
    deleteTeam,
    refresh,
    selectedTeam,
    selectTeam,
  } = useAdminTeams();

  // Filtrar equipes
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "with-manager" && team.managers > 0) ||
      (filterBy === "without-manager" && team.managers === 0);

    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleEditTeam = async (team: TeamSummary) => {
    await selectTeam(team.id);
    setViewMode("edit");
    setMenuOpenTeamId(null);
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta equipe?")) {
      try {
        await deleteTeam(teamId);
        refresh();
      } catch (error) {
        console.error("Erro ao excluir equipe:", error);
      }
    }
    setMenuOpenTeamId(null);
  };

  const handleBackToList = () => {
    setViewMode("list");
    selectTeam(null);
  };

  const handleCreateTeam = () => {
    setViewMode("create");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Se estiver no modo de edição, mostrar a tela de edição
  if (viewMode === "edit" && selectedTeam) {
    return <TeamEditView team={selectedTeam} onBack={handleBackToList} />;
  }

  // Se estiver no modo de criação, mostrar a tela de criação
  if (viewMode === "create") {
    return <TeamCreateView onBack={handleBackToList} />;
  }

  // Vista principal da lista de equipes
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-400 rounded-xl flex items-center justify-center text-white font-semibold shadow-md border border-surface-300/60">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Gestão de Equipes
            </h1>
            <p className="text-sm text-gray-600">
              Gerencie times, líderes e membros da organização
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateTeam}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white text-sm font-medium rounded-lg border border-violet-200/20 hover:border-violet-300/30 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nova Equipe
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-6 rounded-xl border border-surface-300/60 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome, descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">Todas as equipes</option>
              <option value="with-manager">Com líder</option>
              <option value="without-manager">Sem líder</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Equipes */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Carregando equipes...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Erro ao carregar equipes: {error}</p>
          <button
            onClick={refresh}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">
            Nenhuma equipe encontrada
          </p>
          <p className="text-sm text-gray-500">
            {searchQuery || filterBy !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece criando sua primeira equipe"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl border border-surface-300/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {team.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenTeamId(
                          menuOpenTeamId === team.id ? null : team.id
                        );
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {menuOpenTeamId === team.id && (
                      <div className="absolute right-0 top-8 bg-white border border-surface-300 rounded-lg shadow-lg py-1 z-10 min-w-48">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTeam(team);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Editar equipe
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir equipe
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Informações da equipe */}
                  <div className="space-y-2">
                    {team.managers > 0 ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700 font-medium">
                          {team.managers}{" "}
                          {team.managers === 1 ? "líder" : "líderes"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Crown className="w-4 h-4" />
                        <span>Sem líder</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-brand-600" />
                      <span>
                        {team.members}{" "}
                        {team.members === 1 ? "membro" : "membros"}
                      </span>
                    </div>

                    {team.createdAt && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Criada em {formatDate(team.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click outside para fechar menus */}
      {menuOpenTeamId && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setMenuOpenTeamId(null)}
        />
      )}
    </div>
  );
}

// Componente para editar equipe
function TeamEditView({
  team,
  onBack,
}: {
  team: TeamDetail;
  onBack: () => void;
}) {
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "há 1 dia";
    if (diffDays < 30) return `há ${diffDays} dias`;
    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths === 1 ? "há 1 mês" : `há ${diffMonths} meses`;
  };

  const managers = team.memberships?.filter((m) => m.role === "MANAGER") || [];
  const members = team.memberships?.filter((m) => m.role === "MEMBER") || [];

  return (
    <div className="space-y-6">
      {/* Header simples */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Editar Equipe: {team.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Layout em duas colunas */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Coluna esquerda: Configurações (35%) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Informações básicas */}
          <div className="bg-white rounded-xl border border-surface-300/60 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-500 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              Informações Básicas
            </h2>

            {/* Estatísticas da equipe - Mini-cards coloridos */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Card de Membros */}
              <div className="group bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-lg p-4 border border-violet-200/50 hover:shadow-md transition-all duration-200 cursor-default">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-500 rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-semibold text-surface-900 group-hover:text-violet-600 transition-colors duration-200">
                    {team.memberships?.length || 0}
                  </p>
                  <p className="text-xs text-surface-600 mt-1">membros</p>
                </div>
              </div>

              {/* Card de Líderes */}
              <div className="group bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-4 border border-amber-200/50 hover:shadow-md transition-all duration-200 cursor-default">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-semibold text-surface-900 group-hover:text-amber-600 transition-colors duration-200">
                    {managers.length}
                  </p>
                  <p className="text-xs text-surface-600 mt-1">
                    {managers.length === 1 ? "líder" : "líderes"}
                  </p>
                </div>
              </div>

              {/* Card de Dias de Vida */}
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg p-4 border border-slate-200/50 hover:shadow-md transition-all duration-200 cursor-default">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-semibold text-surface-900 group-hover:text-slate-600 transition-colors duration-200">
                    3
                  </p>
                  <p className="text-xs text-surface-600 mt-1">dias de vida</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Equipe
                </label>
                <input
                  type="text"
                  defaultValue={team.name}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  defaultValue={team.description || ""}
                  rows={4}
                  placeholder="Descreva o propósito e responsabilidades da equipe..."
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status da Equipe
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      defaultChecked
                      className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700">Ativa</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="archived"
                      className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700">Arquivada</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                  Salvar Alterações
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Arquivar Equipe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita: Membros (65%) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Líderes - Gradiente mais sutil */}
          {managers.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6 bg-gradient-to-r from-amber-400 to-yellow-400 border-b border-amber-200">
                <div className="flex items-center gap-3 text-amber-900">
                  <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">LÍDER</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {managers.map((membership) => (
                    <div
                      key={membership.user.id}
                      className="bg-white border border-amber-200/60 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                            {membership.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {membership.user.name}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Tech Lead
                            </p>
                            <p className="text-sm text-gray-600">
                              {membership.user.email}
                            </p>
                            <p className="text-xs text-amber-700 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              Líder {formatTimeAgo("2024-10-10")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 text-xs bg-amber-100 text-amber-800 font-medium rounded-full hover:bg-amber-200 transition-all duration-200 hover:scale-105 active:scale-95">
                            Alterar
                          </button>
                          <button className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Membros */}
          <div className="bg-white rounded-xl border border-surface-300/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-6 border-b border-surface-100 bg-gradient-to-r from-violet-600 to-violet-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    MEMBROS ({members.length})
                  </h3>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-violet-600 rounded-lg hover:bg-violet-50 transition-all duration-200 hover:scale-105 active:scale-95 font-medium shadow-sm hover:shadow-md">
                  <UserPlus className="w-4 h-4" />
                  Adicionar Membro
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {members.map((membership) => (
                  <div
                    key={membership.user.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                          {membership.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {membership.user.name}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Product Manager
                          </p>
                          <p className="text-sm text-gray-600">
                            {membership.user.email}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            Membro {formatTimeAgo("2024-10-12")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs bg-violet-100 text-violet-700 font-medium rounded-full hover:bg-violet-200 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Promover
                        </button>
                        <button className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95">
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-surface-400" />
                    </div>
                    <p className="text-surface-900 font-medium text-lg">
                      Nenhum membro na equipe ainda
                    </p>
                    <p className="text-sm text-surface-500 mt-2">
                      Use o botão "Adicionar Membro" para convidar pessoas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para criar equipe
function TeamCreateView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Nova Equipe
          </h1>
          <p className="text-sm text-gray-600">
            Crie uma nova equipe e configure seus membros
          </p>
        </div>
      </div>

      {/* Formulário de criação */}
      <div className="bg-white rounded-xl border border-surface-300/60 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informações da Equipe
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Equipe *
            </label>
            <input
              type="text"
              placeholder="Ex: Frontend, Backend, DevOps..."
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              placeholder="Descreva o propósito e responsabilidades da equipe..."
              rows={3}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
              Criar Equipe
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
