import { useState } from "react";
import type { AdminUser } from "../types";

interface CompactPersonCardProps {
  user: AdminUser;
  onEdit: () => void;
  onHierarchy: () => void;
  onChangePassword: () => void;
  onRemove: () => void;
}

export function CompactPersonCard({
  user,
  onEdit,
  onHierarchy,
  onChangePassword,
  onRemove,
}: CompactPersonCardProps) {
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
    <div className="border border-surface-300 rounded bg-white p-2 hover:shadow-sm transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/20">
      {/* Layout Super Compacto */}
      <div className="flex items-center gap-2">
        {/* Avatar menor */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white font-medium text-xs">{initials}</span>
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {user.name}
            </h3>
            {user.isAdmin && (
              <span className="px-1 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded text-xs">
                A
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {user.position || "Sem cargo"}
          </p>
        </div>

        {/* Badges de status */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {managesCount > 0 && (
            <span
              className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-medium"
              title={`Gerencia ${managesCount} pessoas`}
            >
              {managesCount}
            </span>
          )}
          {hasManager && (
            <span
              className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center"
              title="Tem manager"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>

        {/* Ações mínimas */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Editar"
          >
            <svg
              className="w-3.5 h-3.5"
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
            className="p-1 text-violet-500 hover:text-violet-700 hover:bg-violet-100 rounded transition-colors"
            title="Hierarquias"
          >
            <svg
              className="w-3.5 h-3.5"
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

          {/* Dropdown compacto */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Mais"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onChangePassword();
                    setShowDropdown(false);
                  }}
                  className="w-full px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Senha
                </button>
                <button
                  onClick={() => {
                    onRemove();
                    setShowDropdown(false);
                  }}
                  className="w-full px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
