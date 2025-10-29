import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiAward,
  FiZap,
} from "react-icons/fi";
import { usePlayerProfile } from "@/features/gamification/hooks/useGamification";

interface GamifiedMobileNavProps {
  showManager?: boolean;
  showAdmin?: boolean;
}

// Mock data - integrar com useGamification quando disponível
const mockPlayerProfile = {
  level: 12,
  totalXP: 15420,
  weeklyXP: 340,
  rank: 3,
};

export function GamifiedMobileNav({
  showManager,
  showAdmin,
}: GamifiedMobileNavProps) {
  const location = useLocation();

  // Conectar com dados reais de gamificação
  const { profile } = usePlayerProfile();

  // Usar dados reais ou fallback para mock
  const playerData = profile
    ? {
        level: profile.level,
        totalXP: profile.totalXP,
        rank: profile.rank || 3,
      }
    : mockPlayerProfile;

  const navItems = React.useMemo(() => {
    let items = [
      {
        to: "/",
        label: "Home",
        icon: <FiHome className="w-5 h-5" />,
      },
      {
        to: "/development/cycles",
        label: "Ciclo",
        icon: <FiZap className="w-5 h-5" />,
      },
      {
        to: "/me/pdi",
        label: "PDI",
        icon: <FiTarget className="w-5 h-5" />,
      },
      {
        to: "/leaderboard",
        label: "Rank",
        icon: <FiTrendingUp className="w-5 h-5" />,
        badge: playerData.rank,
      },
    ];

    if (showManager) {
      items.push({
        to: "/manager",
        label: "Equipe",
        icon: <FiUsers className="w-5 h-5" />,
      });
    }

    if (showAdmin) {
      items.push({
        to: "/admin",
        label: "Admin",
        icon: <FiShield className="w-5 h-5" />,
      });
    }

    return items;
  }, [showManager, showAdmin, playerData.rank]);

  return (
    <div className="md:hidden">
      {/* Top Bar Mobile */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo-forji.webp"
              alt="Forji"
              className="h-8 w-8 rounded-lg"
            />
            <div>
              <h1 className="font-bold text-gray-900">Forji</h1>
              <p className="text-xs text-gray-500">Level {playerData.level}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-2 py-1 rounded-lg border border-yellow-200">
              <FiAward className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700">
                {playerData.totalXP.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active =
              location.pathname === item.to ||
              (item.to !== "/" && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors relative ${
                  active
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {"badge" in item && item.badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full"></div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}
