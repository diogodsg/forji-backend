# Migração para Avatares Pixel Art DiceBear

## Resumo

Substituição do sistema de avatares baseado em emojis e SVGs customizados para avatares pixel art gerados pelo DiceBear, proporcionando uma aparência mais moderna, consistente e profissional.

## Data

Janeiro 2025

## Motivação

- **Visual mais profissional**: Pixel art tem apelo visual mais coeso e moderno
- **Consistência**: Todos os avatares seguem o mesmo estilo visual
- **Unicidade**: Cada seed gera um avatar único e reconhecível
- **Escalabilidade**: Sistema programático permite adicionar infinitos avatares
- **Performance**: Geração via biblioteca otimizada

## Tecnologia Utilizada

### DiceBear

- **Biblioteca**: `@dicebear/core` + `@dicebear/pixel-art`
- **Estilo**: Pixel Art (estilo retrô 8-bit)
- **Geração**: Baseada em seeds para consistência
- **Formato**: Data URI (base64) para performance

### Instalação

```bash
npm install @dicebear/core @dicebear/pixel-art
```

## Estrutura de Arquivos

### Novo Arquivo: `dicebearAvatars.ts`

**Localização**: `frontend/src/features/profile/data/dicebearAvatars.ts`

**Exports principais**:

- `DiceBearAvatarOption` (interface)
- `dicebearAvatarOptions` (40 avatares pré-definidos)
- `dicebearAvatarCategories` (5 categorias)
- `getDiceBearAvatarUrl(seed, size)` - Gera URL do avatar
- `getDiceBearAvatarById(id)` - Busca avatar por ID
- `generateCustomAvatar(seed, size)` - Gera avatar customizado

**Categorias**:

1. **Profissional** (💼) - 8 avatares: Executivo, Líder, Estrategista, Analista, Mentor, Consultor, Diretor, Especialista
2. **Criativo** (🎨) - 8 avatares: Artista, Designer, Inovador, Visionário, Criador, Músico, Escritor, Arquiteto
3. **Casual** (😊) - 8 avatares: Aventureiro, Explorador, Sonhador, Viajante, Amigável, Energético, Alegre, Tranquilo
4. **Natureza** (🌿) - 8 avatares: Floresta, Oceano, Montanha, Céu, Tempestade, Aurora, Deserto, Floresta
5. **Abstrato** (✨) - 8 avatares: Cósmico, Quantum, Digital, Neon, Cristal, Plasma, Holográfico, Estelar

## Mudanças nos Componentes

### 1. AvatarSelector.tsx

**Antes**:

```tsx
import {
  avatarOptions,
  avatarCategories,
  type AvatarOption,
} from "../data/avatars";
// Renderizava emojis em gradientes
<span className="text-2xl select-none">{avatar.emoji}</span>;
```

**Depois**:

```tsx
import {
  dicebearAvatarOptions,
  dicebearAvatarCategories,
  getDiceBearAvatarUrl,
} from "../data/dicebearAvatars";
// Renderiza imagens pixel art
<img src={getDiceBearAvatarUrl(avatar.seed, 120)} alt={avatar.name} />;
```

**Mudanças**:

- ✅ Import atualizado para DiceBear
- ✅ Categoria inicial mudou de "people" para "professional"
- ✅ Grid de avatares renderiza `<img>` ao invés de emojis
- ✅ Background mudou de gradiente para `bg-surface-100`
- ✅ Tamanho fixo de 120px para consistência visual

### 2. Avatar.tsx

**Antes**:

```tsx
import { svgAvatarOptions } from "../data/svgAvatars";
// Renderizava SVG via dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: avatar.svg }} />;
```

**Depois**:

```tsx
import {
  getDiceBearAvatarById,
  getDiceBearAvatarUrl,
} from "../data/dicebearAvatars";
// Renderiza imagem pixel art responsiva
<img
  src={getDiceBearAvatarUrl(avatar.seed, sizePixels[size])}
  alt={avatar.name}
/>;
```

**Mudanças**:

- ✅ Import atualizado para DiceBear
- ✅ Mapeamento de tamanhos em pixels: xs(24), sm(32), md(48), lg(64), xl(80), 2xl(96)
- ✅ Background mudou de gradiente para `bg-surface-100`
- ✅ Remoção do padding interno (p-2)
- ✅ Usa `object-cover` para melhor enquadramento

### 3. data/index.ts

**Adicionado**:

```tsx
export {
  dicebearAvatarOptions,
  dicebearAvatarCategories,
  getDiceBearAvatarUrl,
  getDiceBearAvatarById,
  generateCustomAvatar,
  type DiceBearAvatarOption,
} from "./dicebearAvatars";
```

## Características do Sistema DiceBear

### Seeds Inteligentes

Cada avatar tem um seed descritivo que reflete sua personalidade:

- `"executive-blue"` → Visual profissional e confiável
- `"artist-creative"` → Visual artístico e único
- `"cosmic-space"` → Visual abstrato e espacial

### Geração Determinística

O mesmo seed sempre gera o mesmo avatar, garantindo consistência entre sessões.

### Responsividade

Avatares são gerados no tamanho exato necessário:

```typescript
const sizePixels = {
  xs: 24, // Ícones pequenos
  sm: 32, // Badges
  md: 48, // Default
  lg: 64, // Cards
  xl: 80, // Headers
  "2xl": 96, // Modais/Perfis
};
```

### Performance

- Data URIs evitam requisições HTTP adicionais
- Tamanhos otimizados reduzem payload
- Geração acontece apenas quando necessário

## Compatibilidade

### Mantém Interface Existente

```typescript
interface AvatarProps {
  avatarId?: string;        // ✅ Mesmo formato
  size?: "xs" | "sm" | ... // ✅ Mesmas opções
  className?: string;       // ✅ Mesma customização
  showName?: boolean;       // ✅ Mesmo comportamento
}
```

### Migração de IDs

Os IDs antigos não são compatíveis. Usuários existentes receberão o primeiro avatar da lista como fallback até escolherem um novo.

**Estratégia de Migração**:

1. Sistema detecta ID antigo
2. Mostra avatar padrão
3. Usuário recebe notificação suave para escolher novo avatar
4. Opcionalmente: criar mapeamento de IDs antigos → novos

## Benefícios

### Visual

- ✅ Estilo coeso pixel art em todos os avatares
- ✅ Aparência profissional e moderna
- ✅ Maior diferenciação entre usuários
- ✅ Tema retrô/gaming que engaja usuários

### Técnico

- ✅ Sistema extensível (fácil adicionar novos avatares)
- ✅ Performance otimizada (data URIs)
- ✅ Biblioteca mantida e testada
- ✅ Zero dependencies adicionais de imagens

### UX

- ✅ 40 opções diferentes organizadas em 5 categorias
- ✅ Nomes descritivos facilitam escolha
- ✅ Visual consistente em todos os tamanhos
- ✅ Transições suaves e animações mantidas

## Próximos Passos

### Opcional - Melhorias Futuras

1. **Avatar Customizado**: Permitir usuário inserir seed personalizado
2. **Mais Estilos**: Adicionar outros estilos do DiceBear (adventurer, lorelei, etc)
3. **Animações**: Explorar animações SVG para avatares interativos
4. **Badges**: Adicionar badges/flair em cima dos avatares
5. **Preview em Tempo Real**: Mostrar preview ao hover nas categorias

### Migração de Dados

```sql
-- Opcional: Script para resetar avatares antigos
UPDATE users
SET avatar_id = 'professional-1'
WHERE avatar_id NOT IN (
  SELECT id FROM dicebear_avatars
);
```

## Testes Recomendados

- [ ] Seletor de avatar abre e mostra 5 categorias
- [ ] Cada categoria mostra 8 avatares
- [ ] Avatar selecionado mostra indicador visual
- [ ] Avatar renderiza corretamente em todos os tamanhos (xs → 2xl)
- [ ] ClickableAvatar mostra overlay "Editar" no hover
- [ ] Performance: avatares carregam rapidamente
- [ ] Avatar fallback funciona quando ID não existe

## Arquivos Preservados

Os arquivos antigos foram mantidos para referência:

- ✅ `avatars.ts` (emojis) - mantido
- ✅ `svgAvatars.ts` (SVG customizados) - mantido
- ✅ `SVGAvatarSelector.tsx` - mantido
- ✅ `UnifiedAvatarSelector.tsx` - mantido

Estes podem ser removidos em limpeza futura se não houver dependências.
