import { useState } from "react";
import { FiX } from "react-icons/fi";
import { svgAvatarOptions, svgAvatarCategories } from "../data/svgAvatars";

interface UnifiedAvatarSelectorProps {
  currentAvatar?: string;
  onSelectAvatar: (avatarId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function UnifiedAvatarSelector({
  currentAvatar,
  onSelectAvatar,
  onClose,
  isOpen,
}: UnifiedAvatarSelectorProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("professional");

  if (!isOpen) return null;

  const filteredAvatars = svgAvatarOptions.filter(
    (avatar) => avatar.category === selectedCategory
  );

  const handleSelectAvatar = (avatarId: string) => {
    onSelectAvatar(avatarId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-2xl shadow-xl border border-surface-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div>
            <h2 className="text-xl font-semibold text-surface-900 tracking-tight">
              Escolher Avatar
            </h2>
            <p className="text-sm text-surface-600 mt-1 font-medium">
              Selecione um avatar profissional que represente você
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-surface-300 bg-surface-0 hover:bg-surface-50 flex items-center justify-center transition-colors duration-200"
          >
            <FiX className="w-5 h-5 text-surface-600" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-surface-200 bg-surface-50">
          <div className="flex overflow-x-auto px-6 py-3 gap-2">
            {svgAvatarCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    selectedCategory === category.id
                      ? "bg-brand-500 text-white shadow-md"
                      : "bg-surface-0 text-surface-700 border border-surface-300 hover:bg-surface-100"
                  }
                `}
              >
                <span className="text-base">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredAvatars.map((avatar) => (
              <SVGAvatarOption
                key={avatar.id}
                avatar={avatar}
                isSelected={currentAvatar === avatar.id}
                onSelect={() => handleSelectAvatar(avatar.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-200 bg-surface-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-surface-500 font-medium">
              {filteredAvatars.length} avatares SVG disponíveis
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-surface-700 bg-surface-0 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// SVG Avatar Option Component
interface SVGAvatarOptionProps {
  avatar: any;
  isSelected: boolean;
  onSelect: () => void;
}

function SVGAvatarOption({
  avatar,
  isSelected,
  onSelect,
}: SVGAvatarOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        group relative w-full aspect-square rounded-xl transition-all duration-200
        ${
          isSelected
            ? "ring-2 ring-brand-500 ring-offset-2 scale-105"
            : "hover:scale-105"
        }
      `}
      title={avatar.name}
    >
      <div
        className={`
        w-full h-full rounded-xl bg-gradient-to-br ${avatar.gradient} 
        flex items-center justify-center text-surface-0 
        shadow-md group-hover:shadow-lg transition-all duration-200 p-3
        ${isSelected ? "shadow-xl" : ""}
      `}
      >
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: avatar.svg }}
        />
      </div>

      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center shadow-md">
          <div className="w-2 h-2 bg-surface-0 rounded-full" />
        </div>
      )}

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface-900 text-surface-0 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 font-medium">
        {avatar.name}
      </div>
    </button>
  );
}
