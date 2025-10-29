import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiUsers,
  FiShield,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiAward,
  FiHome,
} from "react-icons/fi";
import { useUserPoints } from "@/features/pdi/hooks/useUserPoints";

interface HorizontalNavbarProps {
  userName: string;
  onLogout: () => void;
  showManager?: boolean;
  showAdmin?: boolean;
}

export function HorizontalNavbar({
  userName,
  onLogout,
  showManager,
  showAdmin,
}: HorizontalNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = userName?.[0]?.toUpperCase() || "U";
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);
  const { totalPoints } = useUserPoints();

  // Close user menu when clicking outside
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

  // Keyboard shortcuts (g + key)
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      // Ignorar shortcuts quando usuário está digitando em inputs ou textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "g") {
        (document as any)._navGPressed = true;
        setTimeout(() => {
          (document as any)._navGPressed = false;
        }, 800);
      } else if ((document as any)._navGPressed) {
        const k = e.key.toLowerCase();
        if (k === "h") navigate("/");
        if (k === "d") navigate("/me/pdi");
        if (k === "m" && showManager) navigate("/manager");
        if (k === "a" && showAdmin) navigate("/admin");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, showManager, showAdmin]);

  return (
    <div className="bg-white/75 backdrop-blur border-b border-surface-300/70 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm select-none">
                  F
                </span>
              </div>
              <span className="font-semibold tracking-tight text-gray-800 text-lg select-none">
                forji<span className="text-indigo-500">·</span>
              </span>
            </div>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavItem
                to="/"
                icon={<FiHome className="w-4 h-4" />}
                label="Home"
                isActive={
                  location.pathname === "/" || location.pathname === "/home"
                }
              />

              <NavItem
                to="/me/pdi"
                icon={<FiTarget className="w-4 h-4" />}
                label="PDI"
                isActive={location.pathname.startsWith("/me")}
              />

              {showManager && (
                <NavItem
                  to="/manager"
                  icon={<FiUsers className="w-4 h-4" />}
                  label="Manager"
                  isActive={location.pathname.startsWith("/manager")}
                />
              )}

              {showAdmin && (
                <NavItem
                  to="/admin"
                  icon={<FiShield className="w-4 h-4" />}
                  label="Admin"
                  isActive={location.pathname.startsWith("/admin")}
                />
              )}
            </nav>
          </div>

          {/* Right side: User Menu */}
          <div className="flex items-center space-x-4">
            {/* Keyboard shortcuts hint */}
            <div className="hidden lg:block text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 border border-gray-200 rounded">
                g
              </kbd>{" "}
              +{" "}
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 border border-gray-200 rounded">
                h/d/m/a
              </kbd>
            </div>

            {/* Points Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <FiAward className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">
                {totalPoints.toLocaleString()} pts
              </span>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-sm flex items-center justify-center font-semibold shadow-sm">
                  {initial}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-32">
                  {userName}
                </span>
                <FiChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {userName}
                    </div>
                    <div className="text-xs text-gray-500">Usuário</div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiSettings className="w-4 h-4 mr-3" />
                    Configurações
                  </button>

                  <hr className="my-1 border-gray-100" />

                  <button
                    onClick={() => {
                      onLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="flex">
          <MobileNavItem
            to="/"
            icon={<FiHome className="w-5 h-5" />}
            label="Home"
            isActive={
              location.pathname === "/" || location.pathname === "/home"
            }
          />

          <MobileNavItem
            to="/me/pdi"
            icon={<FiTarget className="w-5 h-5" />}
            label="PDI"
            isActive={location.pathname.startsWith("/me")}
          />

          {showManager && (
            <MobileNavItem
              to="/manager"
              icon={<FiUsers className="w-5 h-5" />}
              label="Manager"
              isActive={location.pathname.startsWith("/manager")}
            />
          )}

          {showAdmin && (
            <MobileNavItem
              to="/admin"
              icon={<FiShield className="w-5 h-5" />}
              label="Admin"
              isActive={location.pathname.startsWith("/admin")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Desktop Navigation Item
function NavItem({
  to,
  icon,
  label,
  isActive,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) => {
        const active = isActive || linkActive;
        return `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`;
      }}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

// Mobile Navigation Item
function MobileNavItem({
  to,
  icon,
  label,
  isActive,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) => {
        const active = isActive || linkActive;
        return `flex-1 flex flex-col items-center space-y-1 px-2 py-3 text-xs font-medium transition-colors ${
          active
            ? "text-indigo-700 bg-indigo-50"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`;
      }}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
