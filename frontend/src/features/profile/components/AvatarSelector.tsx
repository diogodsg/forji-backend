import { FiX } from "react-icons/fi";
import {
  dicebearAvatarOptions,
  getDiceBearAvatarUrl,
  type DiceBearAvatarOption,
} from "../data/dicebearAvatars";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onSelectAvatar: (avatarId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function AvatarSelector({
  currentAvatar,
  onSelectAvatar,
  onClose,
  isOpen,
}: AvatarSelectorProps) {
  if (!isOpen) return null;

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
              Selecione um avatar pixel art que represente você
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-surface-300 bg-surface-0 hover:bg-surface-50 flex items-center justify-center transition-colors duration-200"
          >
            <FiX className="w-5 h-5 text-surface-600" />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto max-h-[600px]">
          <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {dicebearAvatarOptions.map((avatar) => (
              <AvatarOption
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
              {dicebearAvatarOptions.length} avatares disponíveis
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

interface AvatarOptionProps {
  avatar: DiceBearAvatarOption;
  isSelected: boolean;
  onSelect: () => void;
}

function AvatarOption({ avatar, isSelected, onSelect }: AvatarOptionProps) {
  const avatarUrl = getDiceBearAvatarUrl(avatar.seed, 120);

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
        w-full h-full rounded-xl bg-surface-100
        flex items-center justify-center overflow-hidden
        shadow-md group-hover:shadow-lg transition-all duration-200
        ${isSelected ? "shadow-xl ring-2 ring-brand-400" : ""}
      `}
      >
        <img
          src={avatarUrl}
          alt={avatar.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center shadow-md">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface-900 text-surface-0 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 font-medium">
        {avatar.name}
      </div>
    </button>
  );
}
