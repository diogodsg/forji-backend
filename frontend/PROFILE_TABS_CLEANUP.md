# Profile Tabs Cleanup

## Resumo

Simplificação das abas do perfil do usuário, removendo as abas de Timeline e Configurações para manter apenas as abas essenciais: Gamificação e PDI.

## Data

2025-01-XX

## Motivação

- **Timeline duplicada**: As atividades já são exibidas na aba PDI através do `CurrentCyclePageOptimized`
- **Configurações redundante**: Existe uma rota dedicada `/settings` para configurações
- **Simplificação da UX**: Reduzir a complexidade visual e manter apenas as abas essenciais do perfil

## Mudanças Realizadas

### 1. Tipo ProfileTab Atualizado

**Arquivo**: `frontend/src/features/profile/types/profile.ts`

**Antes**:

```typescript
export type ProfileTab = "gamification" | "pdi" | "timeline" | "settings";
```

**Depois**:

```typescript
export type ProfileTab = "gamification" | "pdi";
```

### 2. Navegação das Abas Atualizada

**Arquivo**: `frontend/src/features/profile/components/ProfileTabNavigation.tsx`

**Removido**:

- Import de `FiClock` (ícone de Timeline)
- Import de `FiSettings` (ícone de Settings)
- Configuração da aba "timeline"
- Configuração da aba "settings"

**Abas mantidas**:

- ✅ Gamificação (FiStar)
- ✅ PDI (FiTarget)

### 3. ProfilePage Simplificado

**Arquivo**: `frontend/src/features/profile/components/ProfilePage.tsx`

**Removido**:

- Import de `TimelineSection`
- Import de `ConfigurationTab`
- Import do hook `useProfileTimeline`
- Uso do hook `useProfileTimeline` (timeline, timelineLoading, loadMore, hasMore, getPublicTimeline)
- Variável `displayTimeline`
- Variável `updatePrivacySettings` do hook useProfile
- Variável `privacySettings` da desestruturação de profileData
- Seção condicional `{activeTab === "timeline" && ...}`
- Seção condicional `{activeTab === "settings" && ...}`

**Mantido**:

- ✅ Aba de Gamificação com `GamificationTab`
- ✅ Aba de PDI com `CurrentCyclePageOptimized`

### 4. Exports Atualizados

**Arquivo**: `frontend/src/features/profile/components/index.ts`

**Removido**:

```typescript
export { TimelineSection } from "./TimelineSection";
export { ConfigurationTab } from "./ConfigurationTab";
```

### 5. Componentes Backup

**Arquivos criados**:

- `TimelineSection.tsx` → `TimelineSection.tsx.old`
- `ConfigurationTab.tsx` → `ConfigurationTab.tsx.old`

## Impacto

### Redução de Código

- **ProfilePage.tsx**: Redução de ~25 linhas (imports e seções removidas)
- **ProfileTabNavigation.tsx**: Redução de ~16 linhas (2 imports + 2 configurações de abas)
- **profile/types/profile.ts**: Tipo mais específico (2 opções ao invés de 4)

### Melhorias de UX

- Interface mais limpa e focada
- Menos navegação desnecessária
- Timeline acessível através da aba PDI
- Configurações acessíveis através da rota dedicada `/settings`

### Arquitetura

- Menos dependências entre componentes
- Componentes não utilizados preservados em `.old` para referência futura
- Type safety melhorado (ProfileTab agora só aceita "gamification" | "pdi")

## Verificação

- ✅ Zero erros de compilação TypeScript
- ✅ ProfilePage renderiza corretamente com 2 abas
- ✅ Navegação entre abas funcional
- ✅ Aba PDI usa `CurrentCyclePageOptimized` (unificado anteriormente)
- ✅ Aba Gamificação usa `GamificationTab`

## Padrão Seguido

Esta limpeza segue o mesmo padrão da unificação do PDI:

1. Identificar redundância
2. Atualizar tipos primeiro
3. Atualizar navegação
4. Simplificar componente principal
5. Fazer backup dos arquivos removidos
6. Atualizar exports
7. Documentar mudanças

## Próximos Passos

- [ ] Verificar se há outros lugares que referenciam as abas removidas
- [ ] Considerar criar link direto para `/settings` se necessário
- [ ] Avaliar se vale a pena adicionar link para "Ver todas atividades" na aba PDI
