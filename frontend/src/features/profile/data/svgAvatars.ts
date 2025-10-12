export interface SVGAvatarOption {
  id: string;
  name: string;
  category: string;
  gradient: string;
  svg: string;
}

export interface SVGAvatarCategory {
  id: string;
  name: string;
  icon: string;
}

export const svgAvatarCategories: SVGAvatarCategory[] = [
  { id: "professional", name: "Profissionais", icon: "👔" },
  { id: "abstract", name: "Abstratos", icon: "🎨" },
  { id: "minimal", name: "Minimalistas", icon: "⚪" },
  { id: "creative", name: "Criativos", icon: "✨" },
];

export const svgAvatarOptions: SVGAvatarOption[] = [
  // Categoria: Profissionais
  {
    id: "professional-1",
    name: "Executivo",
    category: "professional",
    gradient: "from-brand-400 to-brand-600",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="18" fill="white" opacity="0.95"/>
      <path d="M25 75 C25 60, 35 50, 50 50 C65 50, 75 60, 75 75 L75 85 L25 85 Z" fill="white" opacity="0.9"/>
      <rect x="40" y="50" width="20" height="8" rx="2" fill="white" opacity="0.7"/>
      <circle cx="42" cy="32" r="2" fill="black" opacity="0.6"/>
      <circle cx="58" cy="32" r="2" fill="black" opacity="0.6"/>
      <path d="M45 40 Q50 42, 55 40" stroke="black" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`,
  },
  {
    id: "professional-2",
    name: "Designer",
    category: "professional",
    gradient: "from-purple-400 to-pink-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="16" fill="white" opacity="0.95"/>
      <path d="M30 70 C30 58, 38 52, 50 52 C62 52, 70 58, 70 70 L70 80 L30 80 Z" fill="white" opacity="0.9"/>
      <circle cx="35" cy="25" r="4" fill="white" opacity="0.8"/>
      <circle cx="65" cy="30" r="3" fill="white" opacity="0.7"/>
      <path d="M35 48 L25 52 L30 58 Z" fill="white" opacity="0.85"/>
      <rect x="20" y="50" width="8" height="12" rx="2" fill="white" opacity="0.6"/>
      <circle cx="43" cy="33" r="1.5" fill="black" opacity="0.6"/>
      <circle cx="57" cy="33" r="1.5" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-3",
    name: "Desenvolvedor",
    category: "professional",
    gradient: "from-green-400 to-teal-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="17" fill="white" opacity="0.95"/>
      <path d="M28 72 C28 58, 37 50, 50 50 C63 50, 72 58, 72 72 L72 82 L28 82 Z" fill="white" opacity="0.9"/>
      <rect x="42" y="25" width="16" height="3" rx="1" fill="white" opacity="0.75"/>
      <path d="M35 60 L38 63 L35 66" stroke="white" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M65 60 L62 63 L65 66" stroke="white" stroke-width="2" fill="none" opacity="0.7"/>
      <line x1="48" y1="60" x2="52" y2="66" stroke="white" stroke-width="2" opacity="0.7"/>
      <circle cx="44" cy="33" r="2" fill="black" opacity="0.6"/>
      <circle cx="56" cy="33" r="2" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-4",
    name: "Gerente",
    category: "professional",
    gradient: "from-blue-400 to-indigo-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="19" fill="white" opacity="0.95"/>
      <path d="M24 76 C24 62, 34 52, 50 52 C66 52, 76 62, 76 76 L76 86 L24 86 Z" fill="white" opacity="0.9"/>
      <polygon points="45,45 55,45 52,40" fill="white" opacity="0.7"/>
      <rect x="35" y="48" width="8" height="4" rx="1" fill="white" opacity="0.65"/>
      <rect x="57" y="48" width="8" height="4" rx="1" fill="white" opacity="0.65"/>
      <circle cx="43" cy="32" r="2" fill="black" opacity="0.6"/>
      <circle cx="57" cy="32" r="2" fill="black" opacity="0.6"/>
      <path d="M44 40 Q50 43, 56 40" stroke="black" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`,
  },
  {
    id: "professional-5",
    name: "Médico",
    category: "professional",
    gradient: "from-red-400 to-rose-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="17" fill="white" opacity="0.95"/>
      <path d="M28 74 C28 60, 37 52, 50 52 C63 52, 72 60, 72 74 L72 84 L28 84 Z" fill="white" opacity="0.9"/>
      <circle cx="50" cy="22" r="8" fill="white" opacity="0.8"/>
      <rect x="48" y="18" width="4" height="8" fill="#ef4444" opacity="0.9"/>
      <rect x="46" y="20" width="8" height="4" fill="#ef4444" opacity="0.9"/>
      <path d="M35 60 L40 65 L35 70 L30 65 Z" fill="white" opacity="0.65"/>
      <circle cx="44" cy="33" r="2" fill="black" opacity="0.6"/>
      <circle cx="56" cy="33" r="2" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-6",
    name: "Advogado",
    category: "professional",
    gradient: "from-amber-400 to-orange-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="36" r="16" fill="white" opacity="0.95"/>
      <path d="M30 75 C30 62, 38 54, 50 54 C62 54, 70 62, 70 75 L70 85 L30 85 Z" fill="white" opacity="0.9"/>
      <path d="M35 50 L42 45 L42 54 Z" fill="white" opacity="0.7"/>
      <path d="M65 50 L58 45 L58 54 Z" fill="white" opacity="0.7"/>
      <rect x="44" y="54" width="12" height="6" rx="1" fill="white" opacity="0.8"/>
      <path d="M40 28 L35 22 L40 20 L45 22 Z" fill="white" opacity="0.65"/>
      <path d="M60 28 L65 22 L60 20 L55 22 Z" fill="white" opacity="0.65"/>
      <circle cx="44" cy="34" r="1.5" fill="black" opacity="0.6"/>
      <circle cx="56" cy="34" r="1.5" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-7",
    name: "Professor",
    category: "professional",
    gradient: "from-emerald-400 to-teal-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="18" fill="white" opacity="0.95"/>
      <path d="M26 74 C26 60, 36 50, 50 50 C64 50, 74 60, 74 74 L74 84 L26 84 Z" fill="white" opacity="0.9"/>
      <rect x="40" y="25" width="20" height="4" rx="2" fill="white" opacity="0.7"/>
      <circle cx="32" cy="60" r="6" fill="white" opacity="0.65"/>
      <rect x="30" y="58" width="4" height="4" fill="black" opacity="0.4"/>
      <path d="M75 55 L78 58 L75 61 M78 58 L72 58" stroke="white" stroke-width="2" fill="none" opacity="0.7"/>
      <circle cx="43" cy="33" r="2" fill="black" opacity="0.6"/>
      <circle cx="57" cy="33" r="2" fill="black" opacity="0.6"/>
      <path d="M46 41 Q50 43, 54 41" stroke="black" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`,
  },
  {
    id: "professional-8",
    name: "Engenheiro",
    category: "professional",
    gradient: "from-slate-400 to-slate-600",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="36" r="17" fill="white" opacity="0.95"/>
      <path d="M28 75 C28 61, 37 52, 50 52 C63 52, 72 61, 72 75 L72 84 L28 84 Z" fill="white" opacity="0.9"/>
      <path d="M35 20 L50 15 L65 20 L60 28 L40 28 Z" fill="white" opacity="0.75"/>
      <rect x="45" y="20" width="10" height="8" fill="#fbbf24" opacity="0.8"/>
      <path d="M25 60 L30 55 L35 60 L30 65 Z" fill="white" opacity="0.65"/>
      <rect x="28" y="58" width="4" height="4" fill="black" opacity="0.4"/>
      <circle cx="44" cy="34" r="2" fill="black" opacity="0.6"/>
      <circle cx="56" cy="34" r="2" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-9",
    name: "Arquiteto",
    category: "professional",
    gradient: "from-sky-400 to-blue-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="34" r="16" fill="white" opacity="0.95"/>
      <path d="M30 73 C30 60, 38 52, 50 52 C62 52, 70 60, 70 73 L70 82 L30 82 Z" fill="white" opacity="0.9"/>
      <rect x="68" y="55" width="10" height="16" rx="1" fill="white" opacity="0.65"/>
      <line x1="68" y1="59" x2="78" y2="59" stroke="black" stroke-width="1" opacity="0.3"/>
      <line x1="68" y1="63" x2="78" y2="63" stroke="black" stroke-width="1" opacity="0.3"/>
      <line x1="68" y1="67" x2="78" y2="67" stroke="black" stroke-width="1" opacity="0.3"/>
      <path d="M22 60 L28 56 L28 68 L22 68 Z" fill="white" opacity="0.7"/>
      <circle cx="44" cy="32" r="2" fill="black" opacity="0.6"/>
      <circle cx="56" cy="32" r="2" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-10",
    name: "Chef",
    category: "professional",
    gradient: "from-orange-400 to-red-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="38" r="16" fill="white" opacity="0.95"/>
      <path d="M30 75 C30 63, 38 55, 50 55 C62 55, 70 63, 70 75 L70 84 L30 84 Z" fill="white" opacity="0.9"/>
      <path d="M38 20 Q38 15, 42 15 Q42 20, 46 20 Q46 15, 50 15 Q50 20, 54 20 Q54 15, 58 15 Q58 20, 62 20 L60 30 L40 30 Z" fill="white" opacity="0.85"/>
      <rect x="38" y="28" width="24" height="6" rx="1" fill="white" opacity="0.9"/>
      <circle cx="25" cy="65" r="5" fill="white" opacity="0.65"/>
      <path d="M23 63 L27 67" stroke="black" stroke-width="1.5" opacity="0.4"/>
      <path d="M27 63 L23 67" stroke="black" stroke-width="1.5" opacity="0.4"/>
      <circle cx="44" cy="36" r="1.5" fill="black" opacity="0.6"/>
      <circle cx="56" cy="36" r="1.5" fill="black" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "professional-11",
    name: "Músico",
    category: "professional",
    gradient: "from-violet-400 to-purple-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="36" r="17" fill="white" opacity="0.95"/>
      <path d="M28 74 C28 61, 37 53, 50 53 C63 53, 72 61, 72 74 L72 83 L28 83 Z" fill="white" opacity="0.9"/>
      <ellipse cx="75" cy="62" rx="5" ry="8" fill="white" opacity="0.7"/>
      <path d="M75 54 L75 62 L80 60 L80 52 Z" fill="white" opacity="0.8"/>
      <circle cx="80" cy="52" r="3" fill="white" opacity="0.9"/>
      <path d="M22 58 Q22 52, 26 52 Q28 52, 28 56 L28 66 Q28 70, 26 70 Q22 70, 22 66 Z" fill="white" opacity="0.65"/>
      <circle cx="44" cy="34" r="2" fill="black" opacity="0.6"/>
      <circle cx="56" cy="34" r="2" fill="black" opacity="0.6"/>
      <path d="M46 42 Q50 44, 54 42" stroke="black" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`,
  },
  {
    id: "professional-12",
    name: "Fotógrafo",
    category: "professional",
    gradient: "from-pink-400 to-rose-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="16" fill="white" opacity="0.95"/>
      <path d="M30 72 C30 60, 38 53, 50 53 C62 53, 70 60, 70 72 L70 81 L30 81 Z" fill="white" opacity="0.9"/>
      <rect x="18" y="58" width="18" height="14" rx="2" fill="white" opacity="0.75"/>
      <circle cx="27" cy="65" r="5" fill="black" opacity="0.3"/>
      <circle cx="27" cy="65" r="3" fill="white" opacity="0.7"/>
      <rect x="32" y="58" width="4" height="3" rx="1" fill="white" opacity="0.8"/>
      <circle cx="22" cy="60" r="1.5" fill="#fbbf24" opacity="0.9"/>
      <circle cx="44" cy="33" r="2" fill="black" opacity="0.6"/>
      <circle cx="56" cy="33" r="2" fill="black" opacity="0.6"/>
    </svg>`,
  },

  // Categoria: Abstratos
  {
    id: "abstract-1",
    name: "Círculos",
    category: "abstract",
    gradient: "from-orange-400 to-red-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="25" fill="white" opacity="0.85"/>
      <circle cx="60" cy="60" r="20" fill="white" opacity="0.7"/>
      <circle cx="50" cy="30" r="8" fill="white" opacity="0.95"/>
      <circle cx="65" cy="45" r="5" fill="white" opacity="0.8"/>
    </svg>`,
  },
  {
    id: "abstract-2",
    name: "Geométrico",
    category: "abstract",
    gradient: "from-cyan-400 to-blue-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,20 70,40 50,60 30,40" fill="white" opacity="0.85"/>
      <rect x="35" y="55" width="30" height="20" rx="4" fill="white" opacity="0.7"/>
      <circle cx="50" cy="35" r="6" fill="white" opacity="0.95"/>
      <polygon points="50,45 55,50 50,55 45,50" fill="white" opacity="0.8"/>
    </svg>`,
  },
  {
    id: "abstract-3",
    name: "Ondas",
    category: "abstract",
    gradient: "from-teal-400 to-green-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 40 Q35 25, 50 40 T80 40 L80 60 Q65 75, 50 60 T20 60 Z" fill="white" opacity="0.85"/>
      <path d="M25 30 Q40 20, 55 30 T75 30" stroke="white" stroke-width="4" fill="none" opacity="0.7"/>
      <circle cx="50" cy="70" r="8" fill="white" opacity="0.8"/>
      <path d="M20 50 Q35 45, 50 50" stroke="white" stroke-width="3" fill="none" opacity="0.65"/>
    </svg>`,
  },
  {
    id: "abstract-4",
    name: "Estrela",
    category: "abstract",
    gradient: "from-yellow-400 to-orange-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,15 58,35 80,35 63,50 70,70 50,60 30,70 37,50 20,35 42,35" fill="white" opacity="0.85"/>
      <circle cx="50" cy="45" r="12" fill="white" opacity="0.7"/>
      <circle cx="50" cy="45" r="6" fill="white" opacity="0.95"/>
    </svg>`,
  },

  // Categoria: Minimalistas
  {
    id: "minimal-1",
    name: "Pessoa Simples",
    category: "minimal",
    gradient: "from-slate-400 to-slate-600",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="30" r="15" fill="white" opacity="0.9"/>
      <ellipse cx="50" cy="70" rx="20" ry="15" fill="white" opacity="0.75"/>
    </svg>`,
  },
  {
    id: "minimal-2",
    name: "Avatar Moderno",
    category: "minimal",
    gradient: "from-violet-400 to-purple-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="25" width="30" height="30" rx="15" fill="white" opacity="0.9"/>
      <rect x="30" y="55" width="40" height="25" rx="12" fill="white" opacity="0.75"/>
    </svg>`,
  },
  {
    id: "minimal-3",
    name: "Hexágono",
    category: "minimal",
    gradient: "from-emerald-400 to-teal-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,20 65,30 65,50 50,60 35,50 35,30" fill="white" opacity="0.85"/>
      <circle cx="50" cy="40" r="8" fill="white" opacity="0.95"/>
    </svg>`,
  },
  {
    id: "minimal-4",
    name: "Losango",
    category: "minimal",
    gradient: "from-rose-400 to-pink-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,25 70,45 50,65 30,45" fill="white" opacity="0.85"/>
      <polygon points="50,35 60,45 50,55 40,45" fill="white" opacity="0.7"/>
    </svg>`,
  },

  // Categoria: Criativos
  {
    id: "creative-1",
    name: "Artístico",
    category: "creative",
    gradient: "from-fuchsia-400 to-purple-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 70 Q50 30, 70 70 Q50 40, 30 70" fill="white" opacity="0.8"/>
      <circle cx="40" cy="45" r="8" fill="white" opacity="0.85"/>
      <circle cx="60" cy="55" r="6" fill="white" opacity="0.95"/>
      <circle cx="50" cy="35" r="4" fill="white" opacity="0.75"/>
    </svg>`,
  },
  {
    id: "creative-2",
    name: "Folha",
    category: "creative",
    gradient: "from-lime-400 to-green-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 20 C70 25, 75 45, 70 60 C65 75, 45 80, 30 70 C35 50, 40 30, 50 20 Z" fill="white" opacity="0.85"/>
      <path d="M45 35 Q55 40, 60 50" stroke="white" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M40 45 Q50 48, 58 58" stroke="white" stroke-width="1.5" fill="none" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "creative-3",
    name: "Raio",
    category: "creative",
    gradient: "from-amber-400 to-yellow-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="45,20 55,20 40,50 60,50 35,80 25,60 40,60 25,40 45,40" fill="white" opacity="0.85"/>
      <polygon points="48,25 52,25 45,42 55,42 48,55" fill="white" opacity="0.65"/>
    </svg>`,
  },
  {
    id: "creative-4",
    name: "Coração",
    category: "creative",
    gradient: "from-red-400 to-rose-500",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,75 C35,60 20,45 20,30 C20,20 30,15 40,20 C45,22 50,25 50,25 C50,25 55,22 60,20 C70,15 80,20 80,30 C80,45 65,60 50,75 Z" fill="white" opacity="0.85"/>
      <circle cx="35" cy="30" r="3" fill="white" opacity="0.6"/>
      <circle cx="65" cy="30" r="3" fill="white" opacity="0.6"/>
    </svg>`,
  },
];
