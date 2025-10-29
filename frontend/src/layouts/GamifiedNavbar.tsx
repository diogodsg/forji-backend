import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiTarget, FiShield, FiAward, FiStar, FiLock } from "react-icons/fi";
import { usePlayerProfile } from "@/features/gamification/hooks/useGamification";

interface GamifiedNavbarProps {
  showAdmin?: boolean;
}

interface NavItemDef {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  locked?: boolean;
}

const mockPlayerProfile = {
  name: "Usu??rio",
  level: 1,
  currentXP: 0,
  totalXP: 0,
  nextLevelXP: 100,
  rank: 0,
  streak: 0,
  weeklyXP: 0,
  recentBadges: [],
};

export function GamifiedNavbar({ showAdmin }: GamifiedNavbarProps) {
  const location = useLocation();

  // Conectar com dados reais de gamifica????o
  const { profile } = usePlayerProfile();

  // Usar dados reais ou fallback para mock
  const playerData = profile
    ? {
        level: profile.level || 1,
        currentXP: profile.currentXP || 0,
        totalXP: profile.totalXP || 0,
        nextLevelXP: profile.nextLevelXP || 100,
        rank: profile.rank || 0,
        recentBadges: profile.badges?.slice(0, 3) || [],
      }
    : mockPlayerProfile;

  const navItems = useMemo(() => {
    const items: NavItemDef[] = [
      {
        to: "/development",
        label: "Desenvolvimento",
        icon: <FiTarget className="w-5 h-5" />,
        locked: false,
      },
      {
        to: "/",
        label: "Início",
        icon: <FiLock className="w-5 h-5" />,
        locked: true,
      },
      {
        to: "/teams",
        label: "Equipe",
        icon: <FiLock className="w-5 h-5" />,
        locked: true,
      },
      {
        to: "/leaderboard",
        label: "Classificação",
        icon: <FiLock className="w-5 h-5" />,
        badge: playerData.rank > 0 ? playerData.rank : undefined,
        locked: true,
      },
      {
        to: "/guide",
        label: "Sistema",
        icon: <FiLock className="w-5 h-5" />,
        locked: true,
      },
    ];

    if (showAdmin) {
      items.push({
        to: "/admin",
        label: "Admin",
        icon: <FiShield className="w-5 h-5" />,
      });
    }

    return items;
  }, [showAdmin, playerData.rank]);

  // NavItem component com novo design system
  const NavItem = ({
    to,
    label,
    icon,
    badge,
    active,
    locked,
  }: NavItemDef & { active: boolean }) => {
    if (locked) {
      return (
        <div className="group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 text-gray-400 bg-surface-50 cursor-not-allowed opacity-60">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 text-gray-400">{icon}</div>
            <span className="ml-3 truncate font-medium">{label}</span>
          </div>
          {badge && (
            <span className="ml-3 px-2.5 py-1 text-xs font-bold rounded-full flex-shrink-0 bg-gray-200 text-gray-400">
              #{badge}
            </span>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={to}
        className={({ isActive }) => {
          const activeState = isActive || active;
          return `group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
            activeState
              ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:shadow-glow transform hover:scale-[1.02]"
              : "text-gray-600 hover:bg-surface-100 hover:text-gray-900 hover:scale-[1.01] hover:shadow-soft"
          }`;
        }}
      >
        <div className="flex items-center min-w-0 flex-1">
          <div
            className={`flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${
              location.pathname === to ||
              (to !== "/" && location.pathname.startsWith(to))
                ? "text-white drop-shadow-sm"
                : "text-gray-500 group-hover:text-brand-600"
            }`}
          >
            {icon}
          </div>
          <span className="ml-3 truncate font-medium">{label}</span>
        </div>
        {badge && (
          <span
            className={`ml-3 px-2.5 py-1 text-xs font-bold rounded-full flex-shrink-0 transition-all duration-150 ${
              location.pathname === to ||
              (to !== "/" && location.pathname.startsWith(to))
                ? "bg-white/20 text-white shadow-sm"
                : "bg-brand-50 text-brand-600 group-hover:bg-brand-100"
            }`}
          >
            #{badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="hidden md:flex h-screen flex-col flex-none w-64 border-r border-surface-300 bg-surface-0 fixed left-0 top-0 z-30 shadow-soft">
      {/* Header com Logo Forji - Design System v2 */}
      <div className="p-6 border-b border-surface-200 bg-gradient-to-br from-surface-50 to-surface-0">
        <div className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-md transition-transform duration-150 group-hover:scale-105">
            <FiAward className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Forji
            </h1>
            <p className="text-xs font-medium text-gray-500 tracking-wide">
              Team-First Growth System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Melhorado com novo design system */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <NavItem
              key={item.to}
              {...item}
              active={active}
              locked={item.locked}
            />
          );
        })}
      </nav>

      {/* Footer - Design System v2 */}
      <div className="border-t border-surface-200 p-4 bg-gradient-to-t from-surface-100 to-surface-50">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-lg flex items-center justify-center">
              <FiStar className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">v2.0.0</span>
          </div>
          <p className="text-xs font-medium text-gray-500 tracking-wide">
            Construindo o futuro juntos
          </p>
        </div>
      </div>
    </aside>
  );
}
