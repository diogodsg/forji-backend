import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiGitPullRequest,
  FiTarget,
  FiUsers,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import { HiOutlineHashtag } from "react-icons/hi2";

// Sidebar sem colapso (feature removida a pedido)

type NavItemDef = {
  to: string;
  label: string;
  icon: React.ReactNode; // ícone outline / inativo
  activeIcon?: React.ReactNode; // ícone preenchido / ativo
};

// Ordem ajustada: PDI primeiro, depois PRs
const baseNavItems: Array<NavItemDef> = [
  { to: "/me/pdi", label: "PDI", icon: <FiTarget className="w-4 h-4" /> },
  {
    to: "/me/prs",
    label: "PRs",
    icon: <FiGitPullRequest className="w-4 h-4" />,
  },
];

export function Sidebar({
  userName,
  onLogout,
  showManager,
  showAdmin,
}: {
  userName: string;
  onLogout: () => void;
  showManager?: boolean;
  showAdmin?: boolean;
}) {
  const location = useLocation();
  const initial = userName?.[0]?.toUpperCase() || "U";
  // Colapso desativado: sidebar sempre expandida (estado removido)

  // Menu usuário (popover)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = React.useMemo(() => {
    let items = baseNavItems.slice();
    if (showManager)
      items = [
        ...items,
        {
          to: "/manager",
          label: "Manager",
          icon: <FiUsers className="w-4 h-4" />,
        },
      ];
    if (showAdmin)
      items = [
        ...items,
        {
          to: "/admin",
          label: "Admin",
          icon: <FiShield className="w-4 h-4" />,
        },
      ];
    return items;
  }, [showManager, showAdmin]);
  return (
    <aside className="hidden md:flex h-screen flex-col flex-none w-64 border-r border-surface-300/70 bg-gradient-to-b from-white/80 via-white/65 to-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/55 relative shadow-sm">
      {/* Header / Brand + Toggle */}
      <div className="h-14 flex items-center px-3 border-b border-surface-300/60">
        <div className="flex items-center gap-2 select-none flex-1 min-w-0">
          <img
            src="/logo-forge.webp"
            alt="Forge"
            className="h-8 w-8 rounded-md shadow-sm ring-1 ring-surface-300/60 object-cover flex-none"
          />
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="font-semibold tracking-tight text-gray-800 text-[15px]">
              Forge
            </span>
            <span
              className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wide text-indigo-600/80 font-semibold"
              title="Forjando talentos, moldando times"
            >
              <HiOutlineHashtag className="w-3 h-3" /> mvp
            </span>
          </div>
        </div>
      </div>
      {/* Navegação */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto min-h-0 relative scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-300/40">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return <NavItem key={item.to} {...item} active={active} />;
        })}
      </nav>
      {/* User / Version */}
      <div
        ref={userMenuRef}
        className="mt-auto border-t border-surface-300/60 px-2 pt-2 pb-2 relative flex flex-col"
      >
        <button
          onClick={() => setUserMenuOpen((o) => !o)}
          className={`group w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 text-left ${
            userMenuOpen
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-surface-200"
          }`}
          aria-haspopup="menu"
          aria-expanded={userMenuOpen}
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-semibold flex items-center justify-center text-sm shadow-inner flex-none">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <span
              className="block text-xs font-medium truncate tracking-wide"
              title={userName}
            >
              {userName}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-gray-400 group-hover:text-indigo-600 font-semibold transition-colors">
              Conta
            </span>
          </div>
        </button>
        {userMenuOpen && (
          <div
            role="menu"
            className={`absolute z-20 left-2 right-2 bottom-[calc(100%+6px)] origin-bottom shadow-lg rounded-md p-1 backdrop-blur bg-white/80 ring-1 ring-surface-300/70 flex flex-col animate-fade-in-up ${""}`}
          >
            <MenuItem
              icon={<FiLogOut className="text-rose-500" />}
              label="Sair"
              destructive
              onSelect={() => {
                setUserMenuOpen(false);
                onLogout();
              }}
            />
            <div className="px-2 pt-1 pb-1.5 text-[10px] text-gray-400/80 select-none">
              v0.0.1
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
// Componente item de navegação com suporte a modo colapsado e tooltip
function NavItem({
  to,
  label,
  icon,
  active,
  activeIcon,
}: NavItemDef & { active: boolean }) {
  return (
    <div className="relative group/nav">
      <NavLink
        to={to}
        className={({ isActive }) => {
          const is = isActive || active;
          return `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium relative overflow-hidden transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
            is
              ? "bg-indigo-50 text-indigo-600 shadow-sm"
              : "text-gray-700 hover:bg-surface-200"
          }`;
        }}
        aria-current={active ? "page" : undefined}
        draggable={false}
      >
        <span
          className={`w-5 h-5 flex items-center justify-center transition-colors ${
            active
              ? "text-indigo-600"
              : "text-gray-400 group-hover/nav:text-indigo-500"
          }`}
        >
          {active && activeIcon ? activeIcon : icon}
        </span>
        <span
          className={`truncate transition-colors ${
            active ? "font-semibold" : "font-medium"
          }`}
        >
          {label}
        </span>
      </NavLink>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}
function MenuItem({ icon, label, onSelect, destructive }: MenuItemProps) {
  return (
    <button
      role="menuitem"
      onClick={onSelect}
      className={`flex items-center gap-2 w-full text-sm px-2 py-2 rounded-md text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
        destructive
          ? "text-rose-600 hover:bg-rose-50"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span className="text-[13px] leading-none">{label}</span>
    </button>
  );
}

// Animação util (podemos mover para CSS global futuramente)
// tailwind.config pode adicionar keyframes; aqui usamos util custom com classes ad-hoc se existir plugin future
