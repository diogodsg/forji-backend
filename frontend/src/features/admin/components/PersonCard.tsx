import { useState } from "react";
import type { AdminUser } from "../types";

interface PersonCardProps {
  user: AdminUser;
  onEdit: () => void;
  onHierarchy: () => void;
  onChangePassword: () => void;
  onRemove: () => void;
}

export function PersonCard({
  user,
  onEdit,
  onHierarchy,
  onChangePassword,
  onRemove,
}: PersonCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Calcular informações hierárquicas
  const managesCount = user.reports?.length || 0;
  const hasManager = user.managers?.length > 0;

  // Gerar iniciais para avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="border border-surface-300 rounded-lg bg-white p-3 hover:shadow-md transition-all duration-200 hover:border-violet-300">
      {/* Layout Compacto em Grid */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Avatar + Nome + Email (Coluna principal) */}
        <div className="col-span-5 flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white font-medium text-sm">{initials}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {user.name}
              </h3>
              {user.isAdmin && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400 truncate">
              {user.position || "Sem cargo"}
            </p>
          </div>
        </div>

        {/* Informações Hierárquicas (Compactas) */}
        <div className="col-span-4 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Gerencia:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                managesCount > 0
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {managesCount > 0 ? `${managesCount}` : "0"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Manager:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                hasManager
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {hasManager ? "✓" : "✗"}
            </span>
          </div>
        </div>

        {/* Ações Compactas */}
        <div className="col-span-3 flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Editar pessoa"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={onHierarchy}
            className="p-1.5 text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded transition-colors"
            title="Gerenciar hierarquias"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>

          <button
            onClick={onChangePassword}
            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
            title="Alterar senha"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2l-4-4L7.257 8.743A6 6 0 0119 9z"
              />
            </svg>
          </button>

          {/* Dropdown Menu Compacto */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Mais opções"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onRemove();
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler para fechar dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
