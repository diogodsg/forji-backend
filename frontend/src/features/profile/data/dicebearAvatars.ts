import { createAvatar } from "@dicebear/core";
import * as pixelArt from "@dicebear/pixel-art";

export interface DiceBearAvatarOption {
  id: string;
  name: string;
  seed: string;
  category: "professional" | "creative" | "casual" | "nature" | "abstract";
}

// Função para gerar URL do avatar DiceBear
export function getDiceBearAvatarUrl(seed: string, size: number = 128): string {
  const avatar = createAvatar(pixelArt, {
    seed,
    size,
    // Opções de customização para melhor visual
    flip: false,
  });

  return avatar.toDataUri();
}

// Seeds pré-definidos com visuais interessantes
export const dicebearAvatarOptions: DiceBearAvatarOption[] = [
  // Professional - tons mais sérios
  {
    id: "professional-1",
    name: "Executivo",
    seed: "executive-blue",
    category: "professional",
  },
  {
    id: "professional-2",
    name: "Líder",
    seed: "leader-strong",
    category: "professional",
  },
  {
    id: "professional-3",
    name: "Estrategista",
    seed: "strategist-wise",
    category: "professional",
  },
  {
    id: "professional-4",
    name: "Analista",
    seed: "analyst-sharp",
    category: "professional",
  },
  {
    id: "professional-5",
    name: "Mentor",
    seed: "mentor-guide",
    category: "professional",
  },
  {
    id: "professional-6",
    name: "Consultor",
    seed: "consultant-expert",
    category: "professional",
  },
  {
    id: "professional-7",
    name: "Diretor",
    seed: "director-vision",
    category: "professional",
  },
  {
    id: "professional-8",
    name: "Especialista",
    seed: "specialist-pro",
    category: "professional",
  },

  // Creative - visual mais artístico
  {
    id: "creative-1",
    name: "Artista",
    seed: "artist-creative",
    category: "creative",
  },
  {
    id: "creative-2",
    name: "Designer",
    seed: "designer-style",
    category: "creative",
  },
  {
    id: "creative-3",
    name: "Inovador",
    seed: "innovator-fresh",
    category: "creative",
  },
  {
    id: "creative-4",
    name: "Visionário",
    seed: "visionary-future",
    category: "creative",
  },
  {
    id: "creative-5",
    name: "Criador",
    seed: "creator-make",
    category: "creative",
  },
  {
    id: "creative-6",
    name: "Músico",
    seed: "musician-harmony",
    category: "creative",
  },
  {
    id: "creative-7",
    name: "Escritor",
    seed: "writer-words",
    category: "creative",
  },
  {
    id: "creative-8",
    name: "Arquiteto",
    seed: "architect-build",
    category: "creative",
  },

  // Casual - mais descontraído
  {
    id: "casual-1",
    name: "Aventureiro",
    seed: "adventurer-explore",
    category: "casual",
  },
  {
    id: "casual-2",
    name: "Explorador",
    seed: "explorer-discover",
    category: "casual",
  },
  {
    id: "casual-3",
    name: "Sonhador",
    seed: "dreamer-imagine",
    category: "casual",
  },
  {
    id: "casual-4",
    name: "Viajante",
    seed: "traveler-journey",
    category: "casual",
  },
  {
    id: "casual-5",
    name: "Amigável",
    seed: "friendly-smile",
    category: "casual",
  },
  {
    id: "casual-6",
    name: "Energético",
    seed: "energetic-active",
    category: "casual",
  },
  {
    id: "casual-7",
    name: "Alegre",
    seed: "cheerful-happy",
    category: "casual",
  },
  {
    id: "casual-8",
    name: "Tranquilo",
    seed: "calm-peaceful",
    category: "casual",
  },

  // Nature - inspirado na natureza
  {
    id: "nature-1",
    name: "Floresta",
    seed: "forest-green",
    category: "nature",
  },
  {
    id: "nature-2",
    name: "Oceano",
    seed: "ocean-blue",
    category: "nature",
  },
  {
    id: "nature-3",
    name: "Montanha",
    seed: "mountain-high",
    category: "nature",
  },
  {
    id: "nature-4",
    name: "Céu",
    seed: "sky-clouds",
    category: "nature",
  },
  {
    id: "nature-5",
    name: "Tempestade",
    seed: "storm-power",
    category: "nature",
  },
  {
    id: "nature-6",
    name: "Aurora",
    seed: "aurora-lights",
    category: "nature",
  },
  {
    id: "nature-7",
    name: "Deserto",
    seed: "desert-sand",
    category: "nature",
  },
  {
    id: "nature-8",
    name: "Floresta",
    seed: "jungle-wild",
    category: "nature",
  },

  // Abstract - mais abstratos e únicos
  {
    id: "abstract-1",
    name: "Cósmico",
    seed: "cosmic-space",
    category: "abstract",
  },
  {
    id: "abstract-2",
    name: "Quantum",
    seed: "quantum-science",
    category: "abstract",
  },
  {
    id: "abstract-3",
    name: "Digital",
    seed: "digital-matrix",
    category: "abstract",
  },
  {
    id: "abstract-4",
    name: "Neon",
    seed: "neon-glow",
    category: "abstract",
  },
  {
    id: "abstract-5",
    name: "Cristal",
    seed: "crystal-clear",
    category: "abstract",
  },
  {
    id: "abstract-6",
    name: "Plasma",
    seed: "plasma-energy",
    category: "abstract",
  },
  {
    id: "abstract-7",
    name: "Holográfico",
    seed: "hologram-3d",
    category: "abstract",
  },
  {
    id: "abstract-8",
    name: "Estelar",
    seed: "stellar-stars",
    category: "abstract",
  },
];

export const dicebearAvatarCategories = [
  { id: "professional", name: "Profissional", icon: "💼" },
  { id: "creative", name: "Criativo", icon: "🎨" },
  { id: "casual", name: "Casual", icon: "😊" },
  { id: "nature", name: "Natureza", icon: "🌿" },
  { id: "abstract", name: "Abstrato", icon: "✨" },
] as const;

// Função para gerar avatar customizado com seed específico
export function generateCustomAvatar(seed: string, size: number = 128): string {
  return getDiceBearAvatarUrl(seed, size);
}

// Função para obter informações de um avatar por ID
export function getDiceBearAvatarById(
  id: string
): DiceBearAvatarOption | undefined {
  return dicebearAvatarOptions.find((avatar) => avatar.id === id);
}
