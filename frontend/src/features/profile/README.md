# Profile Feature - Sistema de Perfil 3.0

Sistema completo de perfil para a plataforma Forji, seguindo o design system v2.0 violet e a filosofia team-first.

## 🎯 Visão Geral

O novo sistema de perfil oferece uma experiência rica e personalizável que combina:

- **Perfil Profissional**: Informações básicas, bio e posição
- **Sistema de Gamificação**: XP, níveis, badges e conquistas
- **Timeline de Atividades**: Histórico de conquistas e marcos
- **Configurações de Privacidade**: Controle granular de visibilidade
- **Interface Adaptativa**: Perfil público vs privado com diferentes níveis de acesso

## 🏗️ Arquitetura

Seguindo a arquitetura feature-first do projeto:

```
src/features/profile/
├── components/           # Componentes UI
│   ├── ProfilePage.tsx          # Página principal (sem aba PDI)
│   ├── ProfileHeader.tsx        # Cabeçalho com avatar, info e botão PDI para gestores
│   ├── StatsGrid.tsx           # Grid de estatísticas
│   ├── TimelineSection.tsx     # Timeline de atividades
│   ├── ProfileTabNavigation.tsx # Sistema de tabs (apenas Gamificação)
│   ├── GamificationTab.tsx     # Tab de gamificação
│   └── ConfigurationTab.tsx    # Configurações de privacidade
│   └── index.ts
├── hooks/                # Hooks para API
│   ├── useProfile.ts           # Hook principal do perfil
│   ├── useProfileStats.ts      # Estatísticas do perfil
│   ├── useProfileTimeline.ts   # Timeline de atividades
│   └── index.ts
├── types/                # Definições TypeScript
│   ├── profile.ts              # Tipos principais
│   └── index.ts
└── index.ts              # Exportações principais
```

## 🎨 Design System

Implementado seguindo o design system v2.0 violet:

### Cores Principais

- **Brand**: `violet-600` (#7c3aed) como cor principal
- **Surface**: Tons de cinza para backgrounds
- **Semantic**: Verde (success), amarelo (warning), vermelho (error)

### Componentes Estilizados

- **Cards**: Rounded-xl com shadow-soft e hover effects
- **Gradientes**: `from-brand-500 to-brand-600` suaves
- **Micro-interactions**: Hover scales, transitions 200-300ms
- **Typography**: Font Geist para headers, weights consistentes

## 📱 Funcionalidades

### 1. ProfileHeader

- Avatar customizável com placeholder
- Informações pessoais (nome, cargo, bio)
- Status indicators (próprio perfil, colega de equipe)
- Progresso de nível com barra animada
- Badges de team e streak
- **Novo**: Botão "Editar PDI" para gestores

### 2. Sistema de Tabs

- **Gamificação**: Stats, badges e conquistas

### 3. Botão Editar PDI para Gestores

- **Localização**: No ProfileHeader para gestores visualizando subordinados
- **Comportamento**: Redireciona para `/users/{userId}/pdi/edit`
- **Condição**: Visível apenas quando `!isCurrentUser && canViewPrivateInfo`
- **Design**: Gradiente verde com ícone de target e emoji

### 4. Controle de Privacidade

- **4 Níveis**: Private, Team, Company, Public
- **Controle Granular**: Badges, stats, timeline separadamente
- **Settings Adicionais**: Team contributions, streak visibility

### 5. Timeline Inteligente

- **Filtros**: Por tipo de atividade
- **Paginação**: Load more com lazy loading
- **Visibilidade**: Público vs privado automático
- **Rich Content**: XP gains, metadata, timestamps

## 🔌 Integração

### Hooks Existentes

```typescript
// Integração com gamificação
import { usePlayerProfile } from "@/features/gamification";

// Integração com auth
import { useAuth } from "@/features/auth";
```

### Rotas Registradas

```typescript
// Perfil próprio
/profile

// Perfil de terceiros
/profile/:userId
/users/:userId/profile-new
```

## 📊 Dados Mock

Atualmente implementado com dados mock para desenvolvimento:

### ProfileStats

```typescript
{
  totalXP: 2500,
  currentLevel: 8,
  levelProgress: { current: 650, required: 1000, percentage: 65 },
  completedPDIs: 3,
  activePDIs: 1,
  completionRate: 85,
  teamContributions: 12,
  badgesEarned: 8
}
```

### Timeline Entries

- Badge conquests
- Level ups
- PDI milestones
- Team contributions
- Key results

## 🚀 Próximos Passos

### Backend Integration

1. **API Endpoints**: Implementar endpoints reais
2. **Upload de Avatar**: Sistema de upload de imagens
3. **Privacy Settings**: Persistência das configurações
4. **Timeline Real**: Integração com sistema de atividades

### Melhorias de UX

1. **Edit Profile Modal**: Modal para editar perfil
2. **Badge Details**: Modal com detalhes dos badges
3. **Export Profile**: Export de dados do perfil
4. **Dark Mode**: Suporte ao tema escuro

### Performance

1. **Image Optimization**: Lazy loading de avatars
2. **Virtual Scrolling**: Timeline com muitas entradas
3. **Caching**: Cache inteligente de dados do perfil

## 🎯 Como Usar

### Navegação

```typescript
// Ir para seu próprio perfil
navigate("/profile");

// Ver perfil de outro usuário
navigate(`/profile/${userId}`);
```

### Import Components

```typescript
import { ProfilePage, useProfile } from "@/features/profile";
```

### Hook Usage

```typescript
const { profileData, loading, error, isCurrentUser } = useProfile(userId);
```

## 🔒 Segurança e Privacidade

- **Controle de Acesso**: Verificação automática de permissões
- **Dados Sensíveis**: Configurações apenas para usuário próprio
- **Managers**: Acesso especial conforme hierarquia (botão Editar PDI)
- **Public View**: Filtros automáticos para visitantes

---

**Status**: ✅ Implementado e funcional
**Versão**: 1.0.0
**Compatibilidade**: Design System v2.0 + Team-First Philosophy
