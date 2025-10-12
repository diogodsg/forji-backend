export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  category: "people" | "animals" | "nature" | "objects" | "symbols";
}

export const avatarOptions: AvatarOption[] = [
  // People & Emotions
  {
    id: "professional",
    name: "Profissional",
    emoji: "👨‍💼",
    gradient: "from-indigo-600 via-sky-500 to-indigo-400",
    category: "people",
  },
  {
    id: "developer",
    name: "Desenvolvedor",
    emoji: "👨‍💻",
    gradient: "from-violet-500 to-purple-600",
    category: "people",
  },
  {
    id: "designer",
    name: "Designer",
    emoji: "👨‍🎨",
    gradient: "from-pink-500 to-rose-600",
    category: "people",
  },
  {
    id: "scientist",
    name: "Cientista",
    emoji: "👨‍🔬",
    gradient: "from-emerald-500 to-teal-600",
    category: "people",
  },
  {
    id: "engineer",
    name: "Engenheiro",
    emoji: "👨‍🔧",
    gradient: "from-amber-500 to-orange-600",
    category: "people",
  },
  {
    id: "student",
    name: "Estudante",
    emoji: "👨‍🎓",
    gradient: "from-blue-500 to-cyan-600",
    category: "people",
  },
  {
    id: "teacher",
    name: "Professor",
    emoji: "👨‍🏫",
    gradient: "from-green-500 to-emerald-600",
    category: "people",
  },
  {
    id: "happy",
    name: "Feliz",
    emoji: "😊",
    gradient: "from-yellow-400 to-orange-500",
    category: "people",
  },
  {
    id: "cool",
    name: "Legal",
    emoji: "😎",
    gradient: "from-slate-600 to-slate-700",
    category: "people",
  },
  {
    id: "thinking",
    name: "Pensativo",
    emoji: "🤔",
    gradient: "from-indigo-500 to-blue-600",
    category: "people",
  },

  // Animals
  {
    id: "cat",
    name: "Gato",
    emoji: "🐱",
    gradient: "from-orange-400 to-red-500",
    category: "animals",
  },
  {
    id: "dog",
    name: "Cachorro",
    emoji: "🐶",
    gradient: "from-amber-400 to-yellow-600",
    category: "animals",
  },
  {
    id: "lion",
    name: "Leão",
    emoji: "🦁",
    gradient: "from-yellow-500 to-orange-600",
    category: "animals",
  },
  {
    id: "eagle",
    name: "Águia",
    emoji: "🦅",
    gradient: "from-slate-700 to-gray-800",
    category: "animals",
  },
  {
    id: "wolf",
    name: "Lobo",
    emoji: "🐺",
    gradient: "from-gray-600 to-slate-700",
    category: "animals",
  },
  {
    id: "fox",
    name: "Raposa",
    emoji: "🦊",
    gradient: "from-orange-500 to-red-600",
    category: "animals",
  },
  {
    id: "panda",
    name: "Panda",
    emoji: "🐼",
    gradient: "from-gray-800 to-black",
    category: "animals",
  },
  {
    id: "unicorn",
    name: "Unicórnio",
    emoji: "🦄",
    gradient: "from-pink-400 via-purple-500 to-indigo-500",
    category: "animals",
  },

  // Nature
  {
    id: "tree",
    name: "Árvore",
    emoji: "🌳",
    gradient: "from-green-600 to-emerald-700",
    category: "nature",
  },
  {
    id: "flower",
    name: "Flor",
    emoji: "🌸",
    gradient: "from-pink-400 to-rose-500",
    category: "nature",
  },
  {
    id: "sun",
    name: "Sol",
    emoji: "☀️",
    gradient: "from-yellow-400 to-orange-500",
    category: "nature",
  },
  {
    id: "moon",
    name: "Lua",
    emoji: "🌙",
    gradient: "from-indigo-600 to-purple-700",
    category: "nature",
  },
  {
    id: "star",
    name: "Estrela",
    emoji: "⭐",
    gradient: "from-yellow-300 to-yellow-500",
    category: "nature",
  },
  {
    id: "fire",
    name: "Fogo",
    emoji: "🔥",
    gradient: "from-red-500 to-orange-600",
    category: "nature",
  },
  {
    id: "lightning",
    name: "Raio",
    emoji: "⚡",
    gradient: "from-blue-400 to-purple-600",
    category: "nature",
  },

  // Objects & Technology
  {
    id: "rocket",
    name: "Foguete",
    emoji: "🚀",
    gradient: "from-blue-500 to-purple-600",
    category: "objects",
  },
  {
    id: "gear",
    name: "Engrenagem",
    emoji: "⚙️",
    gradient: "from-gray-600 to-slate-700",
    category: "objects",
  },
  {
    id: "diamond",
    name: "Diamante",
    emoji: "💎",
    gradient: "from-cyan-400 to-blue-500",
    category: "objects",
  },
  {
    id: "crown",
    name: "Coroa",
    emoji: "👑",
    gradient: "from-yellow-400 to-amber-500",
    category: "objects",
  },
  {
    id: "trophy",
    name: "Troféu",
    emoji: "🏆",
    gradient: "from-yellow-500 to-orange-600",
    category: "objects",
  },
  {
    id: "target",
    name: "Alvo",
    emoji: "🎯",
    gradient: "from-red-500 to-pink-600",
    category: "objects",
  },
  {
    id: "book",
    name: "Livro",
    emoji: "📚",
    gradient: "from-blue-600 to-indigo-700",
    category: "objects",
  },
  {
    id: "bulb",
    name: "Lâmpada",
    emoji: "💡",
    gradient: "from-yellow-400 to-amber-500",
    category: "objects",
  },

  // Symbols & Abstract
  {
    id: "infinity",
    name: "Infinito",
    emoji: "♾️",
    gradient: "from-purple-600 to-blue-600",
    category: "symbols",
  },
  {
    id: "peace",
    name: "Paz",
    emoji: "☮️",
    gradient: "from-green-500 to-teal-600",
    category: "symbols",
  },
  {
    id: "yin_yang",
    name: "Yin Yang",
    emoji: "☯️",
    gradient: "from-gray-800 to-slate-900",
    category: "symbols",
  },
  {
    id: "atom",
    name: "Átomo",
    emoji: "⚛️",
    gradient: "from-blue-500 to-cyan-600",
    category: "symbols",
  },
  {
    id: "recycle",
    name: "Reciclagem",
    emoji: "♻️",
    gradient: "from-green-600 to-emerald-700",
    category: "symbols",
  },
];

export const avatarCategories = [
  { id: "people", name: "Pessoas", icon: "👤" },
  { id: "animals", name: "Animais", icon: "🐾" },
  { id: "nature", name: "Natureza", icon: "🌿" },
  { id: "objects", name: "Objetos", icon: "🎯" },
  { id: "symbols", name: "Símbolos", icon: "✨" },
] as const;
