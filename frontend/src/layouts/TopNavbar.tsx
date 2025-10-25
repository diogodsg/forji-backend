import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiX,
  FiLoader,
  FiSettings,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { usersApi, type User } from "@/lib/api/endpoints/users";
import { useGamificationProfile } from "../features/cycles/hooks/useGamificationProfile";
import { useAuth } from "@/features/auth";
import { Avatar } from "@/features/profile/components/Avatar";

interface TopNavbarProps {
  userName: string;
  onLogout: () => void;
}

export function TopNavbar({ userName, onLogout }: TopNavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get user and gamification data
  const { user } = useAuth();
  const { profile: gamificationProfile } = useGamificationProfile();

  // Auto-focus quando abrir busca
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedIndex(-1);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce da busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }

    if (searchQuery.length < 2) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await usersApi.search(searchQuery);
        setSearchResults(results);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Navegação por teclado
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isSearchOpen) {
        // Ctrl/Cmd + K para abrir busca (prioridade sobre sidebar)
        if ((event.metaKey || event.ctrlKey) && event.key === "k") {
          event.preventDefault();
          event.stopPropagation();
          setIsSearchOpen(true);
        }
        return;
      }

      switch (event.key) {
        case "Escape":
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
          setSelectedIndex(-1);
          break;

        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;

        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleUserSelect(searchResults[selectedIndex]);
          }
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  const handleUserSelect = (user: User) => {
    navigate(`/users/${user.id}/profile`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getXPProgressPercentage = () => {
    if (!gamificationProfile) return 0;
    const { currentXP, nextLevelXP } = gamificationProfile;
    if (nextLevelXP === 0) return 100;
    return Math.min(100, (currentXP / nextLevelXP) * 100);
  };

  return (
    <>
      {/* Top Navbar - Design System v2 */}
      <div className="bg-surface-0/95 backdrop-blur-md border-b border-surface-300 shadow-soft sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Level Card */}
            <div className="flex items-center gap-3">
              {/* Level Progress Card - Design System v2 */}
              {gamificationProfile && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 rounded-xl shadow-soft hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {gamificationProfile.level}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 tracking-wide">
                        Nível {gamificationProfile.level}
                      </div>
                      <div className="text-xs font-medium text-gray-600 tabular-nums">
                        {gamificationProfile.currentXP?.toLocaleString()}/
                        {gamificationProfile.nextLevelXP?.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 group-hover:shadow-glow"
                      style={{ width: `${getXPProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Center: Enhanced Search Bar - Design System v2 */}
            <div className="flex-1 max-w-2xl mx-4" ref={searchContainerRef}>
              <div className="relative">
                <div
                  className={`
                    relative rounded-xl border transition-all duration-200 cursor-text
                    ${
                      isSearchOpen
                        ? "border-brand-500 shadow-glow ring-2 ring-brand-100 bg-surface-0 scale-[1.02]"
                        : "border-surface-300 hover:border-brand-200 bg-surface-50 hover:bg-surface-0 hover:shadow-soft"
                    }
                  `}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <div className="flex items-center px-4 py-3">
                    <FiSearch
                      className={`w-5 h-5 mr-3 transition-all duration-200 ${
                        isSearchOpen
                          ? "text-brand-600 scale-110"
                          : "text-gray-400 group-hover:text-brand-500"
                      }`}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar colaboradores... (⌘K)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchOpen(true)}
                      className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500 text-sm font-medium"
                    />
                    <div className="flex items-center gap-2">
                      {isSearchOpen && searchQuery && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery("");
                            setSearchResults([]);
                            setSelectedIndex(-1);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                      {!isSearchOpen && (
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500">
                          ⌘K
                        </kbd>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Search Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-surface-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-12">
                          <FiLoader className="w-5 h-5 text-indigo-500 animate-spin mr-3" />
                          <span className="text-gray-600">
                            Buscando colaboradores...
                          </span>
                        </div>
                      ) : searchQuery.length > 0 && searchQuery.length < 2 ? (
                        <div className="py-8 px-4 text-center text-gray-500 text-sm">
                          Digite pelo menos 2 caracteres para buscar
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2 max-h-80 overflow-y-auto">
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-surface-100 bg-surface-50">
                            {searchResults.length} colaborador
                            {searchResults.length !== 1 ? "es" : ""} encontrado
                            {searchResults.length !== 1 ? "s" : ""}
                          </div>
                          {searchResults.map((user, index) => (
                            <button
                              key={user.id}
                              onClick={() => handleUserSelect(user)}
                              className={`
                                w-full text-left px-4 py-3 hover:bg-surface-50 
                                flex items-center transition-colors border-b border-surface-100 last:border-0
                                ${
                                  selectedIndex === index
                                    ? "bg-indigo-50 border-indigo-100"
                                    : ""
                                }
                              `}
                            >
                              <Avatar
                                avatarId={user.avatarId}
                                size="sm"
                                className="flex-shrink-0 mr-3"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900">
                                  {highlightMatch(user.name, searchQuery)}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  {user.position && (
                                    <span>
                                      {highlightMatch(
                                        user.position,
                                        searchQuery
                                      )}
                                    </span>
                                  )}
                                  {user.position && <span>•</span>}
                                  <span className="text-gray-400">
                                    {highlightMatch(user.email, searchQuery)}
                                  </span>
                                </div>
                              </div>
                              <FiUser className="w-4 h-4 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.length >= 2 ? (
                        <div className="py-12 text-center text-gray-500">
                          <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="font-medium">
                            Nenhum colaborador encontrado
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Tente buscar por nome, email ou cargo
                          </p>
                        </div>
                      ) : (
                        <div className="py-8 px-4 text-center text-gray-500">
                          <FiSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            Digite para buscar colaboradores
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center gap-3">
              {/* Notifications & User Menu - Design System v2 */}
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  {/* <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-3 text-gray-500 hover:text-brand-600 hover:bg-surface-100 rounded-xl transition-all duration-150 hover:scale-105 group"
                  >
                    <FiBell className="w-5 h-5 transition-transform duration-150 group-hover:scale-110" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-0 animate-pulse-soft"></span>
                  </button> */}

                  {notificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-surface-0 border border-surface-300 rounded-2xl shadow-xl z-50 overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gradient-to-r from-brand-50 to-brand-100 border-b border-surface-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            Notificações
                          </h3>
                          <span className="text-xs font-medium text-brand-600 bg-brand-100 px-2 py-1 rounded-full">
                            3 novas
                          </span>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {/* Sample notifications */}
                        <div className="p-4 border-b border-surface-200 hover:bg-surface-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <span className="text-emerald-600 font-semibold text-sm">
                                XP
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                Você ganhou 100 XP!
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Milestone PDI completada: "Estudar React Hooks"
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                há 5 minutos
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border-b border-surface-200 hover:bg-surface-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                              <span className="text-brand-600 font-semibold text-sm">
                                🏆
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                Nova conquista desbloqueada!
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Badge "First Steps" - Complete sua primeira
                                milestone
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                há 1 hora
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border-b border-surface-200 hover:bg-surface-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FiUser className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                Feedback recebido
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                João Silva deixou um feedback no seu PDI
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                há 2 horas
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-3 bg-surface-50 border-t border-surface-200">
                        <button className="w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                          Ver todas as notificações
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface-100 rounded-xl transition-all duration-150 hover:scale-105 group"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/me");
                        setUserMenuOpen(false);
                      }}
                      className="transition-all duration-150 hover:scale-110"
                      title="Clique para ver seu perfil"
                    >
                      <Avatar avatarId={user?.avatarId} size="sm" />
                    </button>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-gray-900 truncate max-w-32 tracking-tight">
                        {userName}
                      </div>
                      {gamificationProfile && (
                        <div className="text-xs font-medium text-brand-600 tabular-nums">
                          Nível {gamificationProfile.level}
                        </div>
                      )}
                    </div>
                    <FiChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-150 group-hover:rotate-180" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-surface-0 border border-surface-300 rounded-2xl shadow-xl z-50 overflow-hidden">
                      {gamificationProfile && (
                        <div className="p-6 bg-gradient-to-br from-brand-50 to-brand-100 border-b border-surface-200">
                          <div className="flex items-center gap-4">
                            <Avatar avatarId={user?.avatarId} size="lg" />
                            <div>
                              <div className="text-lg font-bold text-gray-900 tracking-tight">
                                {userName}
                              </div>
                              <div className="text-sm font-semibold text-brand-600 tracking-wide">
                                Nível {gamificationProfile.level} •{" "}
                                {gamificationProfile.totalXP?.toLocaleString()}{" "}
                                XP
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate("/me");
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:text-brand-600 hover:bg-gradient-to-r hover:from-brand-50 hover:to-surface-50 rounded-xl transition-all duration-150 hover:scale-[1.02] group"
                        >
                          <FiUser className="w-5 h-5 transition-transform duration-150 group-hover:scale-110" />
                          <span className="font-medium tracking-tight">
                            Meu Perfil
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/settings");
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:text-brand-600 hover:bg-gradient-to-r hover:from-brand-50 hover:to-surface-50 rounded-xl transition-all duration-150 hover:scale-[1.02] group"
                        >
                          <FiSettings className="w-5 h-5 transition-transform duration-150 group-hover:rotate-90" />
                          <span className="font-medium tracking-tight">
                            Configurações
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            onLogout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-surface-50 rounded-xl transition-all duration-150 hover:scale-[1.02] group"
                        >
                          <FiLogOut className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-1" />
                          <span className="font-medium tracking-tight">
                            Sair
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
