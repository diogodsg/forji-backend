import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiUsers,
  FiGlobe,
  FiLock,
  FiSave,
} from "react-icons/fi";
import type { PrivacySettings } from "../types/profile";

interface ConfigurationTabProps {
  privacySettings: PrivacySettings;
  onUpdateSettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  loading?: boolean;
}

const visibilityOptions = [
  {
    value: "private",
    label: "Apenas eu",
    icon: FiLock,
    description: "Somente você pode ver",
  },
  {
    value: "team",
    label: "Minha equipe",
    icon: FiUsers,
    description: "Membros da sua equipe",
  },
  {
    value: "company",
    label: "Empresa",
    icon: FiGlobe,
    description: "Todos na empresa",
  },
  {
    value: "public",
    label: "Público",
    icon: FiEye,
    description: "Visível para visitantes",
  },
] as const;

export function ConfigurationTab({
  privacySettings,
  onUpdateSettings,
  loading = false,
}: ConfigurationTabProps) {
  const [settings, setSettings] = useState<PrivacySettings>(privacySettings);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(
      JSON.stringify(newSettings) !== JSON.stringify(privacySettings)
    );
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    try {
      await onUpdateSettings(settings);
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setSaving(false);
    }
  };

  const VisibilitySelector = ({
    value,
    onChange,
    title,
    description,
  }: {
    value: string;
    onChange: (value: string) => void;
    title: string;
    description: string;
  }) => (
    <div className="bg-white rounded-xl p-6 border border-surface-200">
      <div className="mb-4">
        <h4 className="text-md font-medium text-surface-900">{title}</h4>
        <p className="text-sm text-surface-600 mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibilityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                p-3 rounded-lg border transition-all duration-200 text-left
                ${
                  isSelected
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? "text-brand-600" : "text-surface-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm ${
                      isSelected ? "text-brand-700" : "text-surface-700"
                    }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-xs ${
                      isSelected ? "text-brand-600" : "text-surface-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-brand-500 rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-surface-200 animate-pulse"
          >
            <div className="space-y-3">
              <div className="h-5 bg-surface-200 rounded w-1/3" />
              <div className="h-4 bg-surface-200 rounded w-2/3" />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="h-16 bg-surface-200 rounded-lg" />
                <div className="h-16 bg-surface-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-surface-900">
            🔒 Configurações de Privacidade
          </h3>
          <p className="text-sm text-surface-600 mt-1">
            Controle quem pode ver suas informações e conquistas
          </p>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FiSave className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        )}
      </div>

      {/* Privacy Settings */}
      <div className="space-y-6">
        {/* Badges Visibility */}
        <VisibilitySelector
          title="Visibilidade dos Badges"
          description="Quem pode ver suas conquistas e badges"
          value={settings.showBadges}
          onChange={(value) => handleSettingChange("showBadges", value as any)}
        />

        {/* Stats Visibility */}
        <VisibilitySelector
          title="Visibilidade das Estatísticas"
          description="Quem pode ver seus números de XP, nível e progresso"
          value={settings.showStats}
          onChange={(value) => handleSettingChange("showStats", value as any)}
        />

        {/* Timeline Visibility */}
        <VisibilitySelector
          title="Visibilidade da Timeline"
          description="Quem pode ver suas atividades e conquistas recentes"
          value={settings.showTimeline}
          onChange={(value) =>
            handleSettingChange("showTimeline", value as any)
          }
        />

        {/* PDI Progress Visibility */}
        <VisibilitySelector
          title="Progresso do PDI"
          description="Quem pode ver informações sobre seu desenvolvimento profissional"
          value={settings.showPDIProgress}
          onChange={(value) =>
            handleSettingChange("showPDIProgress", value as any)
          }
        />
      </div>

      {/* Additional Settings */}
      <section>
        <h4 className="text-md font-medium text-surface-900 mb-4">
          ⚙️ Configurações Adicionais
        </h4>

        <div className="space-y-3">
          {/* Team Contributions */}
          <div className="bg-white rounded-xl p-4 border border-surface-200">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <FiUsers className="w-5 h-5 text-surface-600" />
                <div>
                  <div className="font-medium text-surface-900">
                    Mostrar Contribuições para Equipe
                  </div>
                  <div className="text-sm text-surface-600">
                    Exibir estatísticas de colaboração
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.showTeamContributions}
                  onChange={(e) =>
                    handleSettingChange(
                      "showTeamContributions",
                      e.target.checked
                    )
                  }
                  className="sr-only"
                />
                <div
                  className={`
                  w-11 h-6 rounded-full transition-colors duration-200
                  ${
                    settings.showTeamContributions
                      ? "bg-brand-500"
                      : "bg-surface-300"
                  }
                `}
                >
                  <div
                    className={`
                    w-5 h-5 bg-white rounded-full transition-transform duration-200 mt-0.5
                    ${
                      settings.showTeamContributions
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }
                  `}
                  />
                </div>
              </div>
            </label>
          </div>

          {/* Show Streak */}
          <div className="bg-white rounded-xl p-4 border border-surface-200">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <FiEye className="w-5 h-5 text-surface-600" />
                <div>
                  <div className="font-medium text-surface-900">
                    Mostrar Streak de Atividade
                  </div>
                  <div className="text-sm text-surface-600">
                    Exibir dias consecutivos de atividade
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.showStreak}
                  onChange={(e) =>
                    handleSettingChange("showStreak", e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`
                  w-11 h-6 rounded-full transition-colors duration-200
                  ${settings.showStreak ? "bg-brand-500" : "bg-surface-300"}
                `}
                >
                  <div
                    className={`
                    w-5 h-5 bg-white rounded-full transition-transform duration-200 mt-0.5
                    ${settings.showStreak ? "translate-x-5" : "translate-x-0.5"}
                  `}
                  />
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <FiEyeOff className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-blue-900">
              💡 Dica de Privacidade
            </h5>
            <p className="text-sm text-blue-700 mt-1">
              Suas configurações se aplicam apenas ao seu perfil público.
              Gestores e administradores podem ter acesso diferenciado conforme
              as políticas da empresa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
