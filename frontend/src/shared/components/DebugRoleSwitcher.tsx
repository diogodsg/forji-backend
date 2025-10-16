import React from "react";
import { Settings, User, Users, Shield } from "lucide-react";

export type UserRole = "collaborator" | "manager" | "admin";

interface DebugRoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Componente de debug para alternar entre diferentes papéis de usuário
 * durante o desenvolvimento. Permite testar diferentes visões da interface
 * sem necessidade de logins múltiplos.
 *
 * @example
 * ```tsx
 * import { DebugRoleSwitcher, useDebugRole } from "@/shared";
 *
 * function MyPage() {
 *   const { debugRole, setDebugRole, isManager, isAdmin } = useDebugRole("collaborator");
 *
 *   return (
 *     <div>
 *       <DebugRoleSwitcher
 *         currentRole={debugRole}
 *         onRoleChange={setDebugRole}
 *         size="sm"
 *       />
 *
 *       {isManager && <ManagerSection />}
 *       {isAdmin && <AdminSection />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param currentRole - Papel atual selecionado
 * @param onRoleChange - Callback chamado quando o papel é alterado
 * @param className - Classes CSS adicionais
 * @param showLabel - Se deve mostrar o label "Debug Role"
 * @param size - Tamanho do componente (sm, md, lg)
 */
export function DebugRoleSwitcher({
  currentRole,
  onRoleChange,
  className = "",
  showLabel = true,
  size = "md",
}: DebugRoleSwitcherProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const getRoleIcon = (role: UserRole) => {
    const iconClass = `${iconSizes[size]} text-gray-500`;
    switch (role) {
      case "collaborator":
        return <User className={iconClass} />;
      case "manager":
        return <Users className={iconClass} />;
      case "admin":
        return <Shield className={iconClass} />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "collaborator":
        return "Colaborador";
      case "manager":
        return "Manager";
      case "admin":
        return "Admin";
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "collaborator":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "manager":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "admin":
        return "border-purple-200 bg-purple-50 text-purple-700";
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2 text-gray-600">
          <Settings className={iconSizes[size]} />
          <span
            className={
              size === "sm"
                ? "text-xs"
                : size === "lg"
                ? "text-base"
                : "text-sm"
            }
          >
            Debug Role:
          </span>
        </div>
      )}

      <div className="relative">
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          className={`
            ${sizeClasses[size]}
            ${getRoleColor(currentRole)}
            border rounded-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
            transition-all duration-200
            cursor-pointer
            appearance-none
            pr-8
          `}
        >
          <option value="collaborator">👤 Colaborador</option>
          <option value="manager">👥 Manager</option>
          <option value="admin">🛡️ Admin</option>
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`${iconSizes[size]} text-gray-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Role indicator badge */}
      <div
        className={`
        inline-flex items-center gap-1.5 ${
          sizeClasses[size]
        } rounded-full border
        ${getRoleColor(currentRole)}
        font-medium
      `}
      >
        {getRoleIcon(currentRole)}
        <span>{getRoleLabel(currentRole)}</span>
      </div>
    </div>
  );
}

/**
 * Hook para gerenciar estado do debug role switcher
 * Útil para páginas que precisam simular diferentes papéis
 */
export function useDebugRole(initialRole: UserRole = "collaborator") {
  const [debugRole, setDebugRole] = React.useState<UserRole>(initialRole);

  return {
    debugRole,
    setDebugRole,
    isCollaborator: debugRole === "collaborator",
    isManager: debugRole === "manager",
    isAdmin: debugRole === "admin",
  };
}
