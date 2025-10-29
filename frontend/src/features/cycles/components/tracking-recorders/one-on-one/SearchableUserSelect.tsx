import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Crown } from "lucide-react";
import type { WorkspaceUser } from "@/features/admin/hooks/useWorkspaceUsers";

interface SearchableUserSelectProps {
  users: WorkspaceUser[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function SearchableUserSelect({
  users,
  value,
  onChange,
  disabled = false,
  placeholder = "Selecione o participante",
}: SearchableUserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected user
  const selectedUser = users.find((user) => user.name === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (user: WorkspaceUser) => {
    onChange(user.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected value or search input */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-left flex items-center justify-between"
      >
        <span className={selectedUser ? "text-gray-900" : "text-gray-400"}>
          {selectedUser ? selectedUser.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuário..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* User list */}
          <div className="overflow-y-auto max-h-48">
            {filteredUsers.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Nenhum usuário encontrado
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-blue-50 flex items-center gap-2 ${
                    value === user.name ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  {user.isManager ? (
                    <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{user.name}</span>
                  {user.isManager && (
                    <span className="ml-auto text-xs text-amber-600 font-medium">
                      Gerente
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
