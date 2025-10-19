import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Search, UserPlus, User, CheckCircle2 } from "lucide-react";
import type { TeamMemberRole } from "@/lib/api/endpoints/teams";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userId: string, role: TeamMemberRole) => Promise<void>;
  currentMemberIds: string[]; // IDs dos membros já na equipe
}

export function AddMemberModal({
  isOpen,
  onClose,
  onAdd,
  currentMemberIds,
}: AddMemberModalProps) {
  const { users } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [adding, setAdding] = useState(false);

  // Log para debug
  console.log("🔍 AddMemberModal - currentMemberIds:", currentMemberIds);

  // Filtra usuários que ainda não estão na equipe
  const availableUsers = useMemo(() => {
    return users.filter((user) => !currentMemberIds.includes(user.id));
  }, [users, currentMemberIds]);

  // Filtra por busca
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return availableUsers;
    const query = search.toLowerCase();
    return availableUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.position?.toLowerCase().includes(query)
    );
  }, [availableUsers, search]);

  const handleAdd = async () => {
    if (selectedUserIds.size === 0) return;

    setAdding(true);

    // Mantém lista de membros adicionados nesta sessão
    const addedInThisSession = new Set<string>();

    try {
      // Converte para array e remove duplicatas
      const uniqueUserIds = Array.from(new Set(selectedUserIds));

      console.log("📝 Adicionando membros:", uniqueUserIds);
      console.log("👥 Membros atuais:", currentMemberIds);

      // Adiciona usuários UM POR VEZ para evitar condição de corrida
      // (o hook recarrega o team após cada adição)
      for (const userId of uniqueUserIds) {
        // Verifica se já não está na lista (double-check com membros atuais + adicionados nesta sessão)
        if (
          currentMemberIds.includes(userId) ||
          addedInThisSession.has(userId)
        ) {
          console.warn(
            `⚠️ Usuário ${userId} já está na equipe ou foi adicionado nesta sessão, pulando...`
          );
          continue;
        }

        console.log(`➕ Adicionando usuário ${userId}...`);
        await onAdd(userId, "MEMBER");

        // Marca como adicionado nesta sessão
        addedInThisSession.add(userId);
        console.log(`✅ Usuário ${userId} adicionado com sucesso`);
      }

      handleClose();
    } catch (err) {
      console.error("❌ Erro ao adicionar membros:", err);
      // Não fecha o modal se der erro, para o usuário ver o que aconteceu
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setSearch("");
    setSelectedUserIds(new Set());
    onClose();
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-brand-600" />
              Adicionar Membro
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Selecione uma pessoa para adicionar à equipe
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-surface-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email ou cargo..."
              className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {availableUsers.length === 0
                  ? "Todos os usuários já estão nesta equipe"
                  : "Nenhum usuário encontrado"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUserIds.has(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all text-left
                      ${
                        isSelected
                          ? "border-brand-500 bg-brand-50"
                          : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        {user.position && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {user.position}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Role Selection & Actions - Sempre visível */}
        <div className="p-6 border-t border-surface-200 bg-surface-50 rounded-b-2xl">
          {/* Contador de selecionados */}
          {selectedUserIds.size > 0 && (
            <div className="mb-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
              <p className="text-sm font-semibold text-brand-900">
                {selectedUserIds.size}{" "}
                {selectedUserIds.size === 1
                  ? "pessoa selecionada"
                  : "pessoas selecionadas"}
              </p>
              <p className="text-xs text-brand-700 mt-1">
                Serão adicionados como membros da equipe
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={adding || selectedUserIds.size === 0}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding
                ? "Adicionando..."
                : selectedUserIds.size > 1
                ? `Adicionar ${selectedUserIds.size} Membros`
                : "Adicionar Membro"}
            </button>
            <button
              onClick={handleClose}
              disabled={adding}
              className="px-5 py-3 text-gray-700 hover:bg-surface-200 rounded-lg font-semibold transition-colors border border-surface-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderiza via portal no body
  return createPortal(modalContent, document.body);
}
