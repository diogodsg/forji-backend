import { useState } from "react";
import { Crown, Users, Calendar, Trash2 } from "lucide-react";
import type { TeamSummary } from "@/features/admin/types/team";

interface TeamCardProps {
  team: TeamSummary;
  onEdit: () => void;
  onDelete: () => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleCardClick = () => {
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-gradient-to-br from-white to-surface-50 rounded-xl border border-surface-300/60 shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <div className="p-5">
          {/* Header com Avatar e Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform duration-200">
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
                  {team.name}
                </h3>
                {team.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {team.description}
                  </p>
                )}
              </div>
            </div>

            {/* Botão de Excluir */}
            <button
              onClick={handleDeleteClick}
              className="flex-shrink-0 p-2 hover:bg-error-50 rounded-lg transition-all duration-200 group/delete"
              aria-label="Excluir equipe"
            >
              <Trash2 className="w-4 h-4 text-gray-400 group-hover/delete:text-error-600 transition-colors" />
            </button>
          </div>

          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent mb-4"></div>

          {/* Info compacta */}
          <div className="space-y-3">
            {/* Contagem de membros - Destaque principal */}
            <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-lg p-4 border border-brand-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-700 uppercase tracking-wide">
                      Membros
                    </p>
                    <p className="text-2xl font-bold text-brand-900">
                      {team.members}
                    </p>
                  </div>
                </div>

                {/* Badge de líder */}
                {team.managers > 0 ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-full">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-900">
                      Com Líder
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 border border-surface-300 rounded-full">
                    <Crown className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">
                      Sem Líder
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer com Data */}
          {team.createdAt && (
            <div className="mt-4 pt-3 border-t border-surface-200">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Criada em {formatDate(team.createdAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-surface-300 shadow-2xl p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-error-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Excluir Equipe
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-error-900 font-medium mb-1">
                Tem certeza que deseja excluir a equipe "{team.name}"?
              </p>
              <p className="text-xs text-error-700">
                {team.members > 0 && (
                  <>
                    {team.members} membro{team.members > 1 ? "s" : ""}
                    {team.managers > 0 && " e o líder"} serão desvinculados da
                    equipe.
                  </>
                )}
                {team.members === 0 &&
                  team.managers > 0 &&
                  "O líder será desvinculado da equipe."}
                {team.members === 0 &&
                  team.managers === 0 &&
                  "A equipe está vazia e será removida permanentemente."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors border border-surface-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-error-400 focus:outline-none"
              >
                Excluir Equipe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
