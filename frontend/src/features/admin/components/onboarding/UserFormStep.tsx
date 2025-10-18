import { Mail, User as UserIcon, Briefcase, Shield } from "lucide-react";
import type { NewUserData } from "./types";

interface UserFormStepProps {
  userData: NewUserData;
  onUpdate: (data: Partial<NewUserData>) => void;
}

export function UserFormStep({ userData, onUpdate }: UserFormStepProps) {
  const isNameValid = userData.name.trim() !== "";
  const isEmailValid =
    userData.email.trim() !== "" && userData.email.includes("@");

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Informações da nova pessoa
        </h3>
        <p className="text-sm text-gray-600">
          Preencha os dados básicos para criar o perfil
        </p>
      </div>

      <div className="space-y-5">
        {/* Nome e Cargo - mesma linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div>
            <label
              htmlFor="user-name"
              className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2"
            >
              <UserIcon className="w-4 h-4 text-brand-600" />
              Nome completo <span className="text-error-500">*</span>
            </label>
            <input
              id="user-name"
              type="text"
              value={userData.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200 ${
                userData.name && !isNameValid
                  ? "border-error-300 focus:ring-error-400 focus:border-error-500"
                  : "border-surface-300 focus:ring-brand-400 focus:border-brand-500"
              }`}
              placeholder="Ex: Maria da Silva"
              required
            />
            {userData.name && !isNameValid && (
              <p className="mt-1 text-xs text-error-600">Nome é obrigatório</p>
            )}
          </div>

          {/* Cargo */}
          <div>
            <label
              htmlFor="user-position"
              className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2"
            >
              <Briefcase className="w-4 h-4 text-brand-600" />
              Cargo{" "}
              <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <input
              id="user-position"
              type="text"
              value={userData.position || ""}
              onChange={(e) => onUpdate({ position: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200"
              placeholder="Ex: Desenvolvedora Frontend"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="user-email"
            className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2"
          >
            <Mail className="w-4 h-4 text-brand-600" />
            Email <span className="text-error-500">*</span>
          </label>
          <input
            id="user-email"
            type="email"
            value={userData.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className={`w-full px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200 ${
              userData.email && !isEmailValid
                ? "border-error-300 focus:ring-error-400 focus:border-error-500"
                : "border-surface-300 focus:ring-brand-400 focus:border-brand-500"
            }`}
            placeholder="usuario@empresa.com"
            required
          />
          {userData.email && !isEmailValid && (
            <p className="mt-1 text-xs text-error-600">Email deve conter @</p>
          )}
        </div>

        {/* Admin Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-surface-200 bg-surface-50 cursor-pointer hover:bg-surface-100 transition-all duration-200">
            <input
              type="checkbox"
              checked={userData.isAdmin || false}
              onChange={(e) => onUpdate({ isAdmin: e.target.checked })}
              className="mt-0.5 rounded border-surface-300 text-brand-600 focus:ring-brand-400 focus:ring-2"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-gray-800">
                  Permissões de administrador
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Acesso completo ao sistema incluindo gestão de pessoas e equipes
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
