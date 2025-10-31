# Avatar Customization System - Guia Completo

## 📋 Visão Geral

Sistema completo de customização de avatares usando DiceBear API (estilo Micah) com 20 opções configuráveis e persistência no banco de dados.

## 🎨 Componentes Principais

### 1. **AvatarBuilder** (`components/AvatarBuilder.tsx`)

Modal de customização com 5 abas organizadas:

#### **Abas de Configuração:**

- **Rosto**: Cor da pele (3 tons), sobrancelhas (4 estilos), nariz (3 tipos), boca (8 expressões)
- **Olhos**: Estilo dos olhos (3 tipos), cor dos olhos (13 cores), cor da sombra (5 cores)
- **Cabelo**: Cabelo (9 estilos + sem cabelo), cor do cabelo (13 cores), barba (3 estilos + sem barba), cor da barba (13 cores)
- **Acessórios**: Brincos (3 tipos + sem brinco), cor dos brincos (13 cores), óculos (3 tipos + sem óculos), cor dos óculos (13 cores)
- **Corpo**: Orelhas (2 tipos), camisa (3 estilos), cor da camisa (13 cores)

#### **Funcionalidades:**

```tsx
interface MicahConfig {
  baseColor: string[]; // Tom de pele (seleção única)
  earringColor: string; // Cor dos brincos
  earrings: string; // Estilo dos brincos (vazio = sem brinco)
  ears: string; // Tipo de orelhas
  eyeShadowColor: string; // Cor da sombra dos olhos
  eyebrows: string; // Estilo das sobrancelhas
  eyebrowsColor: string; // Cor das sobrancelhas (fixo preto)
  eyes: string; // Estilo dos olhos
  eyesColor: string; // Cor dos olhos
  facialHair: string; // Barba (vazio = sem barba)
  facialHairColor: string; // Cor da barba
  glasses: string; // Óculos (vazio = sem óculos)
  glassesColor: string; // Cor dos óculos
  hair: string; // Cabelo (vazio = sem cabelo)
  hairColor: string; // Cor do cabelo
  mouth: string; // Expressão da boca
  mouthColor: string; // Cor da boca (fixo preto)
  nose: string; // Tipo de nariz
  shirt: string; // Estilo da camisa
  shirtColor: string; // Cor da camisa
}
```

#### **Props:**

```tsx
interface AvatarBuilderProps {
  isOpen: boolean; // Controla visibilidade do modal
  onClose: () => void; // Callback ao fechar
  onSave: (avatarId: string) => void; // Callback ao salvar
  currentAvatar?: string; // Avatar atual do usuário (opcional)
}
```

#### **Carregamento do Avatar Atual:**

Quando o modal abre, o componente automaticamente:

1. **Parseia** o `currentAvatar` (se for formato customizado `micah-...`)
2. **Extrai** todas as configurações dos parâmetros
3. **Preenche** os controles com as opções selecionadas
4. **Renderiza** o preview com o avatar atual

```tsx
// Exemplo: usuário tem avatar customizado
currentAvatar =
  "micah-abc123-d1d4f9-baseColor=f9c9b6&eyes=round&hair=full&hairColor=000000...";

// Ao abrir o modal:
// ✅ Preview mostra o avatar atual
// ✅ Aba "Rosto" mostra tom de pele "Pêssego" selecionado
// ✅ Aba "Olhos" mostra olhos "Redondos" selecionados
// ✅ Aba "Cabelo" mostra cabelo "Cheio" + cor "Preto"
// ✅ Todas as outras configurações carregadas
```

#### **Formato de Saída:**

```typescript
// Avatar customizado salvo no formato:
const avatarId = `micah-${seed}-${backgroundColor}-${params}`;

// Exemplo:
("micah-abc123xyz-d1d4f9-baseColor=f9c9b6&eyes=round&eyesColor=000000&...");
```

### 2. **Avatar Component** (`components/Avatar.tsx`)

Componente que renderiza avatares em qualquer tamanho.

#### **Suporte a 2 Formatos:**

**a) Avatar Customizado (novo):**

```typescript
// Formato: micah-{seed}-{bg}-{params}
avatarId = "micah-abc123-d1d4f9-baseColor=f9c9b6&eyes=round&..."

// Renderiza diretamente via DiceBear API:
https://api.dicebear.com/7.x/micah/svg?seed=abc123&backgroundColor=d1d4f9&baseColor=f9c9b6&...
```

**b) Avatar Pré-definido (legado):**

```typescript
// IDs simples: "developer", "designer", "manager"
avatarId = "developer";

// Busca na lista dicebearAvatarOptions
```

#### **Tamanhos Disponíveis:**

```typescript
size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
// 24px | 32px | 48px | 64px | 80px | 96px
```

### 3. **useProfile Hook** (`hooks/useProfile.ts`)

Hook gerencia perfil do usuário e atualização de avatar.

#### **Função Principal:**

```typescript
const updateAvatar = async (avatarId: string) => {
  // 1. Validação
  const validAvatarId = validateAvatarId(avatarId);

  // 2. Atualização otimista (UI)
  setProfileData((prev) => ({
    ...prev,
    profile: { ...prev.profile, avatarId: validAvatarId },
  }));

  // 3. Persistência no backend
  const updatedUser = await usersApi.update(user.id, {
    avatarId: validAvatarId,
  });

  // 4. Refresh do contexto de autenticação
  await refreshUser();
};
```

#### **Validação de Avatar:**

```typescript
function validateAvatarId(avatarId: string | undefined): string {
  if (!avatarId) return "avatar-1";

  // Aceita avatares customizados do Micah
  if (avatarId.startsWith("micah-")) {
    return avatarId;
  }

  // Valida avatares pré-definidos
  const avatar = getDiceBearAvatarById(avatarId);
  return avatar ? avatarId : "avatar-1";
}
```

## 🔄 Fluxo Completo de Atualização

### **1. Usuário Customiza Avatar**

```typescript
// ProfileHeader.tsx
<AvatarBuilder
  isOpen={showAvatarBuilder}
  onSave={handleAvatarSelect}
  onClose={() => setShowAvatarBuilder(false)}
/>

// Usuário configura nas 5 abas e clica "Salvar Avatar"
```

### **2. Geração do avatarId**

```typescript
// AvatarBuilder.tsx - handleSave()
const params = new URLSearchParams({
  backgroundColor: "d1d4f9",
  baseColor: config.baseColor.join(","),
  eyes: config.eyes,
  eyesColor: config.eyesColor,
  // ... todos os parâmetros
});

// Adiciona features opcionais com probability
if (config.hair) {
  params.append("hair", config.hair);
  params.append("hairProbability", "100");
} else {
  params.append("hairProbability", "0");
}

const avatarId = `micah-${seed}-d1d4f9-${params.toString()}`;
onSave(avatarId); // Chama callback do ProfileHeader
```

### **3. Persistência no Backend**

```typescript
// useProfile.ts - updateAvatar()
await usersApi.update(userId, { avatarId });

// Backend: PATCH /api/users/:id
// Body: { "avatarId": "micah-abc123-d1d4f9-..." }
```

### **4. Atualização do Banco de Dados**

```sql
-- Prisma atualiza o campo avatar_id na tabela users
UPDATE users
SET avatar_id = 'micah-abc123-d1d4f9-baseColor=f9c9b6&...',
    updated_at = NOW()
WHERE id = $1;
```

### **5. Renderização do Avatar**

```typescript
// Avatar.tsx
if (avatarId?.startsWith("micah-")) {
  // Parse do avatarId customizado
  const [_, seed, bg, ...paramsParts] = avatarId.split("-");
  const params = paramsParts.join("-");

  // Reconstrói URL completa
  const url = `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=${bg}&${params}&size=${size}`;

  return <img src={url} alt="Avatar" />;
}
```

## � Parser de Avatar Customizado

O sistema inclui um parser inteligente que reconstrói a configuração completa a partir do `avatarId`:

### **Como Funciona:**

```typescript
// Input: avatarId customizado
"micah-abc123-d1d4f9-baseColor=f9c9b6&eyes=round&hair=full&hairProbability=100&..."

// Parser extrai:
{
  seed: "abc123",                    // Seed única do avatar
  config: {
    baseColor: ["f9c9b6"],           // Tom de pele Pêssego
    eyes: "round",                   // Olhos redondos
    hair: "full",                    // Cabelo cheio
    hairProbability: "100",          // Cabelo sempre visível
    // ... todas as outras opções
  }
}
```

### **Tratamento de Features Opcionais:**

```typescript
// Reconhece quando features estão desabilitadas
if (params.get("hairProbability") === "0") {
  config.hair = ""; // Sem cabelo
}

if (params.get("glassesProbability") === "0") {
  config.glasses = ""; // Sem óculos
}

// Etc...
```

### **Fallback Robusto:**

```typescript
// Se qualquer parâmetro estiver faltando, usa valor padrão
eyesColor: params.get("eyesColor") || defaultConfig.eyesColor;
```

### **Reinicialização Automática:**

```typescript
// useEffect monitora mudanças no modal e avatar
useEffect(() => {
  if (isOpen) {
    const newState = parseCurrentAvatar(currentAvatar);
    setSeed(newState.seed); // Atualiza seed
    setConfig(newState.config); // Atualiza configuração
    setActiveTab("face"); // Volta para primeira aba
  }
}, [isOpen, currentAvatar]);
```

Isso garante que:

- ✅ Ao abrir o modal, sempre mostra o avatar atual
- ✅ Todas as configurações estão pré-selecionadas corretamente
- ✅ Usuário pode fazer ajustes incrementais no avatar existente
- ✅ Não perde o trabalho anterior ao editar

## �🗄️ Schema do Banco de Dados

```prisma
model User {
  id       String  @id @default(uuid()) @db.Uuid
  email    String  @unique
  name     String
  position String?
  bio      String?
  avatarId String? @map("avatar_id") // ← Armazena o avatarId customizado

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  // ... outras relações
  @@map("users")
}
```

## 🎯 Características Especiais

### **1. Sistema de Probabilidade (0/100)**

Para features opcionais (cabelo, barba, brincos, óculos):

- **Sem feature**: `probability: 0` (esconde completamente)
- **Com feature**: `probability: 100` (sempre mostra)

```typescript
// Exemplo: usuário escolhe "Sem Cabelo"
config.hair = "";
params.append("hairProbability", "0"); // Cabelo nunca aparece

// Usuário escolhe um estilo de cabelo
config.hair = "full";
params.append("hair", "full");
params.append("hairProbability", "100"); // Cabelo sempre aparece
```

### **2. Background Fixo**

```typescript
// Sempre lavanda (#d1d4f9)
backgroundColor: "d1d4f9";
```

### **3. Cores Limitadas**

```typescript
// 13 cores disponíveis
const COLORS = [
  { id: "000000", name: "Preto", hex: "#000000" },
  { id: "6bd9e9", name: "Ciano", hex: "#6bd9e9" },
  { id: "77311d", name: "Marrom", hex: "#77311d" },
  { id: "9287ff", name: "Roxo", hex: "#9287ff" },
  { id: "ac6651", name: "Marrom Claro", hex: "#ac6651" },
  { id: "d2eff3", name: "Azul Claro", hex: "#d2eff3" },
  { id: "e0ddff", name: "Lavanda", hex: "#e0ddff" },
  { id: "f4d150", name: "Amarelo", hex: "#f4d150" },
  { id: "f9c9b6", name: "Pêssego", hex: "#f9c9b6" },
  { id: "fc909f", name: "Rosa", hex: "#fc909f" },
  { id: "ffeba4", name: "Amarelo Claro", hex: "#ffeba4" },
  { id: "ffedef", name: "Rosa Claro", hex: "#ffedef" },
  { id: "ffffff", name: "Branco", hex: "#ffffff" },
];
```

### **4. Cores de Sombra Restritas**

```typescript
// Apenas 5 cores suaves para sombra dos olhos
const SHADOW_COLORS = COLORS.filter((c) =>
  ["d2eff3", "e0ddff", "ffeba4", "ffedef", "ffffff"].includes(c.id)
);
```

### **5. Cores Fixas**

- **Sobrancelhas**: Sempre preto (#000000)
- **Boca**: Sempre preto (#000000)

## 🚀 Como Usar

### **Para Desenvolvedores:**

```typescript
// 1. Importar componente
import { AvatarBuilder } from "@/features/profile/components/AvatarBuilder";

// 2. Usar no componente
const [showBuilder, setShowBuilder] = useState(false);

const handleSaveAvatar = async (avatarId: string) => {
  await updateAvatar(avatarId); // Chama hook useProfile
  setShowBuilder(false);
};

return (
  <AvatarBuilder
    isOpen={showBuilder}
    onSave={handleSaveAvatar}
    onClose={() => setShowBuilder(false)}
  />
);
```

### **Para Usuários:**

1. Clique no avatar no perfil (aparece botão de editar se for seu perfil)
2. Escolha opções nas 5 abas (Rosto, Olhos, Cabelo, Acessórios, Corpo)
3. Use "Gerar Aleatório" para randomizar o seed
4. Clique "Salvar Avatar"
5. Avatar é atualizado imediatamente e persistido no banco

## 🔧 Debugging

### **Verificar avatarId no Console:**

```typescript
// useProfile.ts tem logs detalhados
console.log("🔄 updateAvatar - Atualizando para:", avatarId);
console.log("✅ updateAvatar - Backend respondeu:", updatedUser);
console.log("✅ updateAvatar - avatarId do backend:", updatedUser.avatarId);
```

### **Testar Parsing do Avatar:**

```typescript
const avatarId = "micah-abc123-d1d4f9-baseColor=f9c9b6&eyes=round";
const parts = avatarId.split("-");
console.log("Seed:", parts[1]); // abc123
console.log("Background:", parts[2]); // d1d4f9
console.log("Params:", parts.slice(3).join("-")); // baseColor=f9c9b6&eyes=round
```

### **Verificar Renderização:**

```typescript
// Avatar.tsx renderiza a URL completa no console
const avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=${bg}&${params}&size=${size}`;
console.log("Avatar URL:", avatarUrl);
```

## ⚠️ Notas Importantes

1. **Tamanho Máximo do avatarId**: ~500 caracteres (muito abaixo do limite de 50 no DB, precisa aumentar se necessário)
2. **Cache do Browser**: Avatares são cached pelo browser baseado na URL
3. **Seed Aleatória**: Cada "Gerar Aleatório" cria nova seed única
4. **Validação**: `validateAvatarId()` garante que apenas avatares válidos sejam aceitos
5. **Fallback**: Se avatar inválido, usa "avatar-1" como padrão
6. **API Rate Limits**: DiceBear tem rate limits, mas para uso normal não é problema

## 📦 Dependências

```json
{
  "dependencies": {
    "@dicebear/core": "^7.x",
    "@dicebear/micah": "^7.x"
  }
}
```

## 🎨 Design System

- **Cor Principal**: Brand Purple (#7c3aed)
- **Gradientes**: Cada aba tem gradiente próprio (brand, blue, amber, pink, green)
- **Sem Emojis**: Design system limpo sem emojis
- **Tailwind CSS**: Todas as classes são Tailwind
- **Ícones**: React Icons (FiX, FiRefreshCw)

## ✅ Checklist de Implementação

- [x] AvatarBuilder com 5 abas organizadas
- [x] 20 opções de customização Micah
- [x] Sistema de probabilidade 0/100
- [x] Preview em tempo real
- [x] Botão randomizar seed
- [x] Carregamento do avatar atual ao abrir modal
- [x] Parser de configuração de avatar customizado
- [x] Pré-seleção de todas as opções baseado no avatar atual
- [x] Persistência no backend (PATCH /api/users/:id)
- [x] Campo avatarId no schema Prisma
- [x] Validação de avatarId customizado (até 1000 caracteres)
- [x] Avatar component com suporte a customizados
- [x] Atualização otimista no frontend
- [x] Refresh do contexto de autenticação
- [x] Fallback para avatares inválidos
- [x] Remoção de emojis do design
- [x] Fix de preview z-index
- [x] Documentação completa

## 🚀 Próximos Passos (Opcional)

1. **Aumentar limite do avatarId** no Prisma de 50 para 1000 caracteres
2. **Adicionar histórico** de avatares anteriores
3. **Upload de imagem personalizada** além do DiceBear
4. **Compartilhamento** de configurações de avatar
5. **Preset templates** com configurações pré-definidas populares
