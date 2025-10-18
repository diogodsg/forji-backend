import { Search } from "lucide-react";
import type { User } from "./types";

interface PersonSelectorProps {
  users: User[];
  selectedPersonIds: string[]; // UUID[]
  searchValue: string;
  onSearchChange: (value: string) => void;
  onTogglePerson: (userId: string) => void; // UUID
}

export function PersonSelector({
  users,
  selectedPersonIds,
  searchValue,
  onSearchChange,
  onTogglePerson,
}: PersonSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecionar Pessoas
      </label>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar pessoas..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
        />
      </div>
      <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-gray-50">
        {users.map((user) => (
          <label
            key={user.id}
            className="flex items-center gap-3 p-4 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedPersonIds.includes(user.id)}
              onChange={() => onTogglePerson(user.id)}
              className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
            />
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </label>
        ))}
        {users.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma pessoa encontrada
          </div>
        )}
      </div>
    </div>
  );
}
