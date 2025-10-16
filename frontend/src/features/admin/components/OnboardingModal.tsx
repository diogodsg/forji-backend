import { useState } from "react";
import type { AdminUser } from "../types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUser[]; // Se vazio, é criação de nova pessoa
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface NewUserData {
  name: string;
  email: string;
  isAdmin: boolean;
  position?: string;
}

export function OnboardingModal({
  isOpen,
  onClose,
  users,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<
    Record<string | number, { manager?: number; team?: string }>
  >({});

  // Estados para criação de nova pessoa
  const [newUserData, setNewUserData] = useState<NewUserData>({
    name: "",
    email: "",
    isAdmin: false,
    position: "",
  });

  const isCreatingNewUser = users.length === 0;

  const steps: OnboardingStep[] = isCreatingNewUser
    ? [
        {
          id: "create-user",
          title: "Dados Pessoais",
          description: "Informações da nova pessoa",
          icon: "👤",
          completed:
            newUserData.name.trim() !== "" && newUserData.email.trim() !== "",
        },
        {
          id: "assign-structure",
          title: "Definir Estrutura",
          description: "Atribua gerente e equipe",
          icon: "🏢",
          completed: false, // Will be validated later
        },
        {
          id: "review-confirm",
          title: "Revisar & Confirmar",
          description: "Verificar as configurações",
          icon: "✅",
          completed: false,
        },
      ]
    : [
        {
          id: "select-users",
          title: "Selecionar Pessoas",
          description: "Escolha quem precisa ser organizado",
          icon: "👥",
          completed: selectedUsers.length > 0,
        },
        {
          id: "assign-structure",
          title: "Definir Estrutura",
          description: "Atribua gerentes e equipes",
          icon: "🏢",
          completed: selectedUsers.every(
            (userId) => assignments[userId]?.manager
          ),
        },
        {
          id: "review-confirm",
          title: "Revisar & Confirmar",
          description: "Verificar as configurações",
          icon: "✅",
          completed: false,
        },
      ];

  const allManagers = users.filter(
    (user) => user.isAdmin || user.reports?.length
  );

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssignment = (
    userId: number | string,
    field: "manager" | "team",
    value: string | number
  ) => {
    setAssignments((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleConfirm = () => {
    console.log("Onboarding completed:", { selectedUsers, assignments });
    onClose();
    // Aqui você faria a chamada à API para aplicar as mudanças
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-surface-300 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header seguindo Design System */}
        <div className="px-6 py-4 border-b border-surface-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 via-sky-500 to-indigo-400 flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                  {isCreatingNewUser
                    ? "Adicionar Nova Pessoa"
                    : "Onboarding Guiado"}
                </h2>
                <p className="text-xs text-gray-500">
                  {isCreatingNewUser
                    ? "Configure dados e posição na organização"
                    : `Organize ${users.length} pessoa${
                        users.length > 1 ? "s" : ""
                      } na estrutura`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 w-10 transition hover:bg-surface-100 focus:ring-2 focus:ring-indigo-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    index === currentStep
                      ? "bg-brand-100 text-brand-900"
                      : step.completed
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-surface-100 text-surface-600"
                  }`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-surface-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 0 && isCreatingNewUser && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                Informações da nova pessoa
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                    placeholder="Ex: Maria da Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                    placeholder="usuario@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                    Cargo (opcional)
                  </label>
                  <input
                    type="text"
                    value={newUserData.position || ""}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                    placeholder="Ex: Desenvolvedora Frontend"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newUserData.isAdmin || false}
                      onChange={(e) =>
                        setNewUserData((prev) => ({
                          ...prev,
                          isAdmin: e.target.checked,
                        }))
                      }
                      className="rounded border-surface-300 text-indigo-600 focus:ring-indigo-400 focus:ring-2"
                    />
                    <span className="text-sm font-medium tracking-tight text-slate-800">
                      Dar permissões de administrador
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 0 && !isCreatingNewUser && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                Selecione as pessoas para organizar
              </h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-3 border border-surface-200 rounded-lg hover:bg-surface-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isAdmin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-surface-100 text-surface-700"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "Usuário"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                Definir estrutura organizacional
              </h3>
              <div className="space-y-4">
                {isCreatingNewUser ? (
                  // Estrutura para nova pessoa
                  <div className="p-4 border border-surface-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {newUserData.name || "Nova pessoa"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {newUserData.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                          Gerente
                        </label>
                        <select
                          value={assignments["new"]?.manager || ""}
                          onChange={(e) =>
                            handleAssignment(
                              "new" as any,
                              "manager",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                        >
                          <option value="">Selecionar gerente...</option>
                          {allManagers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                              {manager.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                          Equipe
                        </label>
                        <select
                          value={assignments["new"]?.team || ""}
                          onChange={(e) =>
                            handleAssignment(
                              "new" as any,
                              "team",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                        >
                          <option value="">Selecionar equipe...</option>
                          <option value="desenvolvimento">
                            Desenvolvimento
                          </option>
                          <option value="produto">Produto</option>
                          <option value="marketing">Marketing</option>
                          <option value="vendas">Vendas</option>
                          <option value="suporte">Suporte</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Estrutura para pessoas existentes
                  selectedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId)!;
                    return (
                      <div
                        key={userId}
                        className="p-4 border border-surface-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                              Gerente
                            </label>
                            <select
                              value={assignments[userId]?.manager || ""}
                              onChange={(e) =>
                                handleAssignment(
                                  userId,
                                  "manager",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                            >
                              <option value="">Selecionar gerente...</option>
                              {allManagers
                                .filter((m) => m.id !== userId)
                                .map((manager) => (
                                  <option key={manager.id} value={manager.id}>
                                    {manager.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium tracking-tight text-slate-800 mb-2">
                              Equipe
                            </label>
                            <select
                              value={assignments[userId]?.team || ""}
                              onChange={(e) =>
                                handleAssignment(userId, "team", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition"
                            >
                              <option value="">Selecionar equipe...</option>
                              <option value="desenvolvimento">
                                Desenvolvimento
                              </option>
                              <option value="produto">Produto</option>
                              <option value="marketing">Marketing</option>
                              <option value="vendas">Vendas</option>
                              <option value="suporte">Suporte</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                Revisão das configurações
              </h3>
              <div className="space-y-3">
                {isCreatingNewUser ? (
                  <div className="p-4 bg-surface-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {newUserData.name}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {newUserData.email}
                        </p>
                        <div className="space-y-1">
                          {newUserData.position && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Cargo:</span>{" "}
                              {newUserData.position}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Tipo:</span>{" "}
                            {newUserData.isAdmin ? "Administrador" : "Usuário"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Gerente:</span>{" "}
                            {allManagers.find(
                              (m) => m.id === assignments["new"]?.manager
                            )?.name || "Não definido"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Equipe:</span>{" "}
                            {assignments["new"]?.team || "Não definida"}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        ✓ Nova pessoa
                      </span>
                    </div>
                  </div>
                ) : (
                  selectedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId)!;
                    const assignment = assignments[userId];
                    const manager = allManagers.find(
                      (m) => m.id === assignment?.manager
                    );

                    return (
                      <div
                        key={userId}
                        className="p-4 bg-surface-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <div className="mt-1 space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Gerente:</span>{" "}
                                {manager?.name || "Não definido"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Equipe:</span>{" "}
                                {assignment?.team || "Não definida"}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                            ✓ Pronto
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer seguindo Design System */}
        <div className="px-6 py-4 border-t border-surface-300 flex justify-between">
          <button
            onClick={
              currentStep > 0 ? () => setCurrentStep(currentStep - 1) : onClose
            }
            className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 px-4 transition hover:bg-surface-100 focus:ring-2 focus:ring-indigo-400"
          >
            {currentStep > 0 ? "← Voltar" : "Cancelar"}
          </button>

          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!steps[currentStep].completed}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 text-white font-medium text-sm h-10 px-6 transition hover:opacity-90 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
              >
                Continuar →
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm h-10 px-6 transition hover:opacity-90 focus:ring-2 focus:ring-emerald-400"
              >
                {isCreatingNewUser
                  ? "✨ Criar e Organizar"
                  : "🚀 Aplicar Onboarding"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
