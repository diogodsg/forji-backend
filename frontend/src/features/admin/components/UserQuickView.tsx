import { Fragment } from "react";
import { FiX, FiEdit2, FiShield, FiGithub, FiUsers } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import type { AdminUser } from "../types";

interface Props {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  allUsers: AdminUser[];
}

export function UserQuickView({ user, isOpen, onClose, allUsers }: Props) {
  const navigate = useNavigate();

  if (!user) return null;

  const managers = user.managers
    .filter((m) => m.id !== user.id)
    .map((m) => {
      const ref = allUsers.find((x) => x.id === m.id);
      return {
        id: m.id,
        name: ref?.name || `#${m.id}`,
        email: ref?.email || "",
      };
    });

  const subordinates = allUsers.filter(
    (u) => u.managers.some((m) => m.id === user.id) && u.id !== user.id
  );

  const handleEdit = () => {
    navigate(`/admin/users/${user.id}`);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Detalhes do Usuário
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-lg font-semibold flex items-center justify-center">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {user.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          ID: {user.id}
                        </span>
                        {user.isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            <FiShield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    {user.githubId && (
                      <div className="flex items-center gap-3 text-sm">
                        <FiGithub className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">GitHub:</span>
                        <span className="font-medium text-gray-800">
                          @{user.githubId}
                        </span>
                      </div>
                    )}

                    {managers.length > 0 && (
                      <div className="text-sm">
                        <p className="text-gray-600 mb-2 flex items-center gap-2">
                          <FiUsers className="w-4 h-4" />
                          Gerentes ({managers.length}):
                        </p>
                        <div className="space-y-1">
                          {managers.map((manager) => (
                            <div
                              key={manager.id}
                              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                            >
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white text-xs font-semibold flex items-center justify-center">
                                {manager.name?.[0]?.toUpperCase() || "M"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-xs truncate">
                                  {manager.name}
                                </p>
                                {manager.email && (
                                  <p className="text-gray-500 text-xs truncate">
                                    {manager.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {subordinates.length > 0 && (
                      <div className="text-sm">
                        <p className="text-gray-600 mb-2 flex items-center gap-2">
                          <FiUsers className="w-4 h-4" />
                          Subordinados ({subordinates.length}):
                        </p>
                        <div className="space-y-1">
                          {subordinates.slice(0, 3).map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center gap-2 bg-blue-50 p-2 rounded"
                            >
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-semibold flex items-center justify-center">
                                {sub.name?.[0]?.toUpperCase() || "S"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-xs truncate">
                                  {sub.name}
                                </p>
                                <p className="text-gray-500 text-xs truncate">
                                  {sub.email}
                                </p>
                              </div>
                            </div>
                          ))}
                          {subordinates.length > 3 && (
                            <p className="text-xs text-gray-500 text-center py-1">
                              +{subordinates.length - 3} mais
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleEdit}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Editar Perfil
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
