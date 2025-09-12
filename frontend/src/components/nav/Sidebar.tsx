import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const baseNavItems = [
  { to: "/me/prs", label: "PRs", icon: "<>" },
  { to: "/me/pdi", label: "PDI", icon: "\u2691" },
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
  const navItems = React.useMemo(() => {
    let items = baseNavItems.slice();
    if (showManager)
      items = [...items, { to: "/manager", label: "Manager", icon: "\u2605" }];
    if (showAdmin)
      items = [...items, { to: "/admin", label: "Admin", icon: "#" }];
    return items;
  }, [showManager, showAdmin]);
  return (
    <aside className="hidden md:flex h-screen flex-col flex-none w-60 border-r border-surface-300/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/55">
      <div className="h-14 flex items-center px-4 border-b border-surface-300/60">
        <div className="flex items-center gap-2 select-none">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            F
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-gray-800 text-[15px]">
              Forge
            </span>
            <span className="text-[10px] uppercase tracking-wide text-indigo-500/70 font-medium">
              mvp
            </span>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto min-h-0">
        <SectionLabel>Principal</SectionLabel>
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            active={location.pathname.startsWith(item.to)}
          />
        ))}
      </nav>
      <div className="mt-auto border-t border-surface-300/60 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-semibold flex items-center justify-center text-sm shadow-inner">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <span
              className="block text-xs font-medium text-gray-700 truncate"
              title={userName}
            >
              {userName}
            </span>
            <button
              onClick={onLogout}
              className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 hover:text-rose-600 transition-colors"
            >
              Sair
            </button>
          </div>
          <button
            onClick={onLogout}
            className="text-[10px] px-1.5 py-1 rounded md:hover:bg-surface-200 text-gray-400 hover:text-rose-600 transition-colors"
            title="Sair"
            aria-label="Sair"
          >
            ⇦
          </button>
        </div>
        <div className="mt-3 text-[10px] text-gray-400">v0.0.1</div>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wide font-semibold text-gray-400">
      {children}
    </div>
  );
}

function NavItem({
  to,
  label,
  icon,
  active,
}: {
  to: string;
  label: string;
  icon?: string;
  active: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium relative transition-colors ${
          isActive || active
            ? "bg-indigo-50 text-indigo-600 after:opacity-100"
            : "text-gray-600 hover:bg-surface-200 after:opacity-0"
        } after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[3px] after:rounded-r after:bg-gradient-to-b after:from-indigo-500 after:to-sky-400 after:transition-opacity`
      }
      aria-current={active ? "page" : undefined}
    >
      <span className="w-5 h-5 flex items-center justify-center text-[11px] text-gray-400 group-hover:text-indigo-500 transition-colors">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
