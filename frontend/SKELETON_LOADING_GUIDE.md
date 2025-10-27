# Skeleton Loading Components - Página de Ciclo

Implementação completa de skeleton loadings para a página de ciclo seguindo o design system da Forge.

## 🎨 Design System Compliance

- **Cores**: Surface palette (surface-200, surface-300) seguindo tokens de design
- **Bordas**: Rounded-2xl para cards, rounded-lg para elementos menores
- **Animações**: Shimmer effect suave com gradiente + pulse effect
- **Espaçamento**: Sistema consistente com mb-8, space-y-4, etc.
- **Sombras**: shadow-sm para elevação sutil

## 📦 Componentes Criados

### Base Components (`Skeleton.tsx`)

- `Skeleton` - Container base com animação pulse
- `SkeletonText` - Texto com animação shimmer
- `SkeletonAvatar` - Avatar circular com shimmer
- `SkeletonCard` - Card básico com conteúdo placeholder

### Page Skeletons (`Skeleton.tsx`)

- `SkeletonHeroSection` - Seção hero com avatar + progress ring
- `SkeletonQuickActions` - Barra de ações rápidas (4 botões)
- `SkeletonGoalsDashboard` - Dashboard de metas com progress bars
- `SkeletonCompetencies` - Grid de competências 2x2
- `SkeletonActivitiesTimeline` - Timeline de atividades
- `SkeletonCyclePage` - Página inteira (loading inicial)

### Modal Skeletons (`ModalSkeletons.tsx`)

- `SkeletonGoalCreatorModal` - Modal de criação de metas
- `SkeletonActivityDetailsModal` - Detalhes de atividade
- `SkeletonCompetencyUpdateModal` - Atualização de competência
- `SkeletonModal` - Modal genérico

### Utilities (`LoadingStates.tsx`)

- `ConditionalSection` - Wrapper que mostra skeleton ou conteúdo
- `CycleSectionLoadings` - Helper para loading states por seção
- `useLoadingStates` - Hook para detectar estados de loading

## 🚀 Implementação na Página

### Estados de Loading Suportados

```typescript
interface LoadingState {
  cycle?: boolean; // Página inteira
  goals?: boolean; // Dashboard de metas
  competencies?: boolean; // Seção de competências
  activities?: boolean; // Timeline de atividades
  gamification?: boolean; // Hero section (XP/level)
}
```

### Uso no CyclePageContent

```tsx
<CyclePageContent
  // ... props existentes
  loading={{
    goals: loading.goals,
    competencies: loading.competencies,
    activities: loading.activities,
    gamification: gamificationLoading,
  }}
/>
```

### Loading Hierarchy

1. **Page Level**: `loading.cycle` → `SkeletonCyclePage`
2. **Section Level**: Individual skeletons por seção
3. **Component Level**: Loading states internos dos componentes

## 🎭 Animações

### Shimmer Effect (Tailwind Config)

```javascript
animation: {
  shimmer: "shimmer 2s ease-in-out infinite",
},
keyframes: {
  shimmer: {
    "0%": { "background-position": "200% 0" },
    "100%": { "background-position": "-200% 0" },
  },
},
```

### Classes CSS

- `animate-pulse` - Container base
- `animate-shimmer` - Elementos internos com gradient
- `bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200`

## 🧪 Testing

Criado `SkeletonDemo.tsx` para testar todos os skeleton states:

- Toggles para ativar/desativar loading por seção
- Visualização lado a lado de skeleton vs conteúdo real
- Útil para desenvolvimento e QA

## 📱 Estados Implementados

### CyclePageStates.tsx

- ✅ Loading: `SkeletonCyclePage` (página inteira)
- ✅ Error: Card de erro com design system
- ✅ Empty: Estado vazio melhorado

### CyclePageContent.tsx

- ✅ Hero: `ConditionalSection` com `SkeletonHeroSection`
- ✅ Goals: `ConditionalSection` com `SkeletonGoalsDashboard`
- ✅ Competencies: `ConditionalSection` com `SkeletonCompetencies`
- ✅ Activities: `ConditionalSection` com `SkeletonActivitiesTimeline`

## 🎯 Benefícios

1. **UX Melhorada**: Loading states informativos ao invés de spinners
2. **Performance Percebida**: Usuário vê a estrutura da página imediatamente
3. **Design Consistency**: Todos skeletons seguem o design system
4. **Modular**: Loading states independentes por seção
5. **Acessível**: Mantém estrutura semântica durante loading
6. **Reusável**: Componentes podem ser usados em outras páginas

## 📊 Metrics de Loading

A implementação permite tracking granular:

- Tempo de carregamento por seção
- Seções que carregam mais devagar
- Otimização de performance dirigida por dados

## 🔧 Customização

Todos os skeleton components aceitam:

- `className` para styling adicional
- Props específicas como `width`, `height`, `size`
- Fácil extensão para novos layouts
