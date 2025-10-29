import {
  getDiceBearAvatarById,
  getDiceBearAvatarUrl,
  dicebearAvatarOptions,
} from "../data/dicebearAvatars";

interface AvatarProps {
  avatarId?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showName?: boolean;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
  "2xl": "w-24 h-24",
};

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 96,
};

export function Avatar({
  avatarId,
  size = "md",
  className = "",
  showName = false,
}: AvatarProps) {
  // Procura o avatar DiceBear ou usa o primeiro como fallback
  const avatar = avatarId
    ? getDiceBearAvatarById(avatarId)
    : dicebearAvatarOptions[0];

  if (!avatar) {
    // Fallback para quando não encontrar o avatar
    console.warn("⚠️ Avatar não encontrado, usando fallback");
    return (
      <div
        className={`
        ${sizeClasses[size]} 
        rounded-full bg-gradient-to-br from-surface-400 to-surface-600 
        flex items-center justify-center text-surface-0 font-semibold
        shadow-soft
        ${className}
      `}
      >
        <span className="text-xs">?</span>
      </div>
    );
  }

  const avatarUrl = getDiceBearAvatarUrl(avatar.seed, sizePixels[size]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`
        ${sizeClasses[size]} 
        rounded-full bg-surface-100
        overflow-hidden
        shadow-soft hover:shadow-glow transition-shadow duration-200
      `}
      >
        <img
          src={avatarUrl}
          alt={avatar.name}
          className="w-full h-full object-cover"
        />
      </div>

      {showName && (
        <span className="text-sm font-medium text-surface-700">
          {avatar.name}
        </span>
      )}
    </div>
  );
}

// Componente específico para avatar clicável (usado no header do perfil)
interface ClickableAvatarProps extends AvatarProps {
  onClick?: () => void;
  isEditable?: boolean;
}

export function ClickableAvatar({
  onClick,
  isEditable = false,
  ...avatarProps
}: ClickableAvatarProps) {
  if (!isEditable || !onClick) {
    return <Avatar {...avatarProps} />;
  }

  return (
    <button
      onClick={onClick}
      className="group relative"
      title="Clique para alterar avatar"
    >
      <Avatar {...avatarProps} />

      {/* Overlay de edição */}
      <div className="absolute inset-0 rounded-full bg-surface-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <span className="text-surface-0 text-xs font-medium">Editar</span>
      </div>
    </button>
  );
}
