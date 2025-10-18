import { Users, Mail } from "lucide-react";
import type { AdminUser } from "../../types";

interface UserSelectionStepProps {
  users: AdminUser[];
  selectedUsers: string[]; // UUID[]
  onToggleUser: (userId: string) => void; // UUID
}

export function UserSelectionStep({
  users,
  selectedUsers,
  onToggleUser,
}: UserSelectionStepProps) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Selecione as pessoas para organizar
            </h3>
            <p className="text-sm text-gray-600">
              Escolha quem precisa ser atribuído a gerentes e equipes
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-600">
              {selectedUsers.length}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              selecionada{selectedUsers.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {users.map((user) => {
          const isSelected = selectedUsers.includes(user.id);
          return (
            <label
              key={user.id}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-brand-50 border-brand-300 shadow-sm"
                  : "bg-white border-surface-200 hover:bg-surface-50 hover:border-brand-200"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleUser(user.id)}
                className="rounded border-surface-300 text-brand-600 focus:ring-brand-400 focus:ring-2"
              />

              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${
                  user.isAdmin
                    ? "bg-brand-100 text-brand-700 border border-brand-200"
                    : "bg-surface-100 text-gray-600"
                }`}
              >
                {user.isAdmin ? "Admin" : "Usuário"}
              </span>
            </label>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">Nenhuma pessoa encontrada</p>
          <p className="text-sm text-gray-500">
            Não há pessoas disponíveis para organizar
          </p>
        </div>
      )}
    </div>
  );
}
