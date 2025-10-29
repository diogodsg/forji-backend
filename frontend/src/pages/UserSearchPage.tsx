import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiMapPin,
  FiMessageCircle,
} from "react-icons/fi";
import { api } from "@/lib/apiClient";
import { GamificationFeedbackPanel } from "@/features/gamification/components/GamificationFeedbackPanel";

interface User {
  id: number;
  name: string;
  email: string;
  position?: string;
  bio?: string;
  avatarId?: string;
}

export function UserSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

  // Carregar todos os usuários na inicialização
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários com base no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.position &&
          user.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api<User[]>("/users", { auth: true });
      setUsers(response);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowFeedbackPanel(false);
  };

  const handleGiveFeedback = () => {
    setShowFeedbackPanel(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackPanel(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buscar Colaboradores
          </h1>
          <p className="text-gray-600">
            Encontre pessoas da equipe para dar feedback ou registrar ações de
            desenvolvimento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Users List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Users Grid */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando usuários...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                        selectedUser?.id === user.id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <FiMail className="w-4 h-4" />
                              {user.email}
                            </div>
                            {user.position && (
                              <div className="flex items-center gap-1">
                                <FiMapPin className="w-4 h-4" />
                                {user.position}
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedUser?.id === user.id && (
                          <div className="text-blue-600">
                            <FiUser className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm
                      ? "Nenhum usuário encontrado"
                      : "Nenhum usuário disponível"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Tente ajustar os termos de busca"
                      : "Não há usuários cadastrados no sistema"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Panel */}
          <div className="lg:col-span-1">
            {selectedUser ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                {showFeedbackPanel ? (
                  <GamificationFeedbackPanel
                    targetUserId={String(selectedUser.id)}
                    targetUserName={selectedUser.name}
                    onClose={handleCloseFeedback}
                  />
                ) : (
                  <>
                    {/* User Profile */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                        {getInitials(selectedUser.name)}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedUser.name}
                      </h2>
                      {selectedUser.position && (
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedUser.position}
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {selectedUser.email}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    {selectedUser.bio && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Sobre
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {selectedUser.bio}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={handleGiveFeedback}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      Registrar Ação/Feedback
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um usuário
                </h3>
                <p className="text-sm text-gray-500">
                  Clique em um usuário da lista para ver o perfil e registrar
                  feedback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
