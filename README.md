# Forge - Plataforma Gamificada para Desenvolvimento de Times

**Stack:** NestJS + Prisma/PostgreSQL (backend) | React 19 + Vite + TailwindCSS (frontend)

**Versão:** v3.1.0 - Sistema de Gestão Gerencial Completo  
**Última Atualização:** 25 de outubro de 2025

---

## 🎯 Status Atual

### Sistema de Gamificação + Gestão Gerencial 100% Funcional

- ✅ **Backend**: XP calculations, tracking e multi-tenant gamification
- ✅ **Frontend**: Animações de XP, confetti system e progress bars
- ✅ **Goal Management**: CRUD completo com XP rewards/penalties
- ✅ **Manager Dashboard**: Edição completa de PDI de subordinados
- ✅ **Activity Editing**: Sistema de edição de atividades 1:1
- ✅ **Real-time Updates**: Gamification profile atualiza automaticamente
- 🎮 **XP System**: +25 XP (metas), +50 XP (1:1s), +75 XP (mentorias), +100 XP (certificações)

### Quick Start

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Acesse http://localhost:5173
# Login: diego@forge.com (admin + manager)
# Login: maria@forge.com (manager)
```

---

## 🎮 Sistema de Gamificação

### XP Values & Rewards

| Ação               | XP       | Confetti       |
| ------------------ | -------- | -------------- |
| Criar Meta         | +25      | ✅ Default     |
| Excluir Meta       | -25      | ❌ None        |
| 1:1 Meeting        | +50      | ✅ Achievement |
| Mentoria           | +75      | ✅ Achievement |
| Certificação       | +100     | ✅ Level Up    |
| Update Competência | Variable | ✅ Variable    |

### Level Calculation

```typescript
// Formula: level = floor(sqrt(totalXP / 100))
// Exemplos:
//   100 XP → Level 1
//   400 XP → Level 2
//   900 XP → Level 3
```

### Arquitetura do Sistema

**Backend:**

```
backend/src/
├── gamification/           # Sistema de XP e leveling
│   ├── gamification.service.ts
│   ├── entities/xp-transaction.entity.ts
│   └── gamification.controller.ts
├── goals/                  # CRUD de metas com XP
├── cycles/                 # Gestão de ciclos
└── prisma/                 # Database schema + migrations
```

**Frontend:**

```
frontend/src/
├── components/
│   ├── XpFloating.tsx     # Animações de XP
│   ├── Confetti.tsx       # Sistema de confetti
│   └── Toast.tsx          # Sistema de feedback
├── features/cycles/
│   ├── hooks/             # useGamificationProfile
│   ├── components/        # Componentes específicos
│   └── types/             # TypeScript types
└── lib/api/               # API client + endpoints
```

---

## 🚀 Principais Funcionalidades

### 1. Sistema de Gamificação

- **Dashboard de Jogador**: Perfil com XP, level, badges e progresso
- **Sistema de Pontos**: XP automático por ações de desenvolvimento
- **Conquistas**: Badges desbloqueados por comportamentos específicos
- **Rankings de Equipe**: Leaderboards colaborativos (team-first)
- **Notificações Real-time**: Sistema completo de feedback imediato

### 2. Sistema de Gestão Gerencial (NOVO!)

**Edição Completa de PDI de Subordinados:**

- **Página Dedicada**: `/users/:userId/pdi/edit`
- **Verificação de Permissões**: Apenas gestores podem editar PDI de subordinados diretos
- **Interface Unificada**: Reutiliza componentes de `/development` com contexto gerencial
- **Hero Section Premium**: Avatar, estatísticas, progresso visual com gradientes
- **Gestão Completa**:
  - ✅ Criar/editar/deletar metas do subordinado
  - ✅ Criar/atualizar/deletar competências
  - ✅ Registrar atividades 1:1 (gestor como participante)
  - ✅ Editar atividades 1:1 existentes
  - ✅ Visualizar/deletar atividades

**Edição de Atividades:**

```typescript
// Sistema reutiliza modais de criação para edição
<OneOnOneRecorder
  isOpen={true}
  onClose={handleClose}
  onSave={handleSave}
  prefillData={{
    participant: "Ana Silva",
    date: "2025-10-25",
    workingOn: ["React", "TypeScript"],
    generalNotes: "Ótima evolução...",
    positivePoints: ["Proatividade", "Comunicação"],
    improvementPoints: ["Gestão de tempo"],
    nextSteps: ["Estudar hooks avançados"]
  }}
/>

// Backend PATCH endpoint
PATCH /activities/:id
{
  title: "1:1 com Ana Silva",
  description: "Reunião 1:1 atualizada",
  oneOnOneData: {
    participantName: "Ana Silva",
    workingOn: [...],
    generalNotes: "...",
    positivePoints: [...],
    improvementPoints: [...],
    nextSteps: [...]
  }
}
```

**Fluxo Completo:**

1. Gestor acessa perfil do subordinado
2. Clica em "Editar PDI"
3. Sistema verifica permissões via `/management/check-if-managed/:userId`
4. Carrega dados do subordinado via endpoints dedicados:
   - `GET /management/subordinates/:id/cycle`
   - `GET /management/subordinates/:id/goals`
   - `GET /management/subordinates/:id/competencies`
   - `GET /management/subordinates/:id/activities`
5. Interface permite todas as operações CRUD
6. Ações registradas em nome do gestor
7. XP atribuído ao subordinado

### 3. Goal Management com XP

**Goal Creation:**

```typescript
// Backend: goals.service.ts
await this.gamificationService.addXP(userId, workspaceId, 25, "Goal created");

// Frontend: animação + confetti
triggerXpAnimation(25); // +25 XP floating + confetti
await refreshGamificationProfile(); // Real-time update
```

**Goal Deletion:**

```typescript
// Modal de confirmação com avisos de XP loss
<DeleteGoalModal xpLoss={25} onConfirm={handleDelete} />;

// XP removal (no confetti for negative XP)
triggerXpAnimation(-25); // Red floating XP, no confetti
```

### 4. Sistema PDI Revolucionário

**Key Results Inteligentes:**

- **Porcentagem** (0-100%): Campos numéricos com validação
- **Aumento** (valor inicial → meta): Cálculo preciso
- **Diminuição** (valor inicial → meta): Redução automática
- **Data** (prazo): Campo de data + dropdown de status
- **Texto** (qualitativo): Textarea livre

**Integração PDI + Gamificação:**

```typescript
XP_SYSTEM = {
  pdi_milestone_completed: 100,
  pdi_first_milestone: 50,
  pdi_competency_improved: 50,
  pdi_cycle_completed: 300,
  key_result_achieved: 150,
};
```

### 5. Sistema de Equipes Team-First

**Nova Página `/teams`:**

- **Multi-Persona Interface**: Views para colaboradores, managers e admins
- **Layout 1-1-1**: 3 colunas iguais (33% cada)
- **Minha Contribuição**: XP pessoal, ranking, mentorias, badges
- **Próximas Ações**: Tasks pendentes categorizadas
- **Timeline da Equipe**: Eventos categorizados temporalmente
- **Objetivos da Equipe**: Progresso visual com status

**Gestão de Equipes Admin:**

- Interface CRUD completa
- Layout 35% info / 65% membros
- Hierarquia visual (responsáveis destacados)
- Métricas integradas em cards
- Ações contextuais (promover, remover, alterar)

### 6. Homepage Inteligente

**Dashboard Adaptativo por Perfil:**

- **Colaboradores**: Dashboard gamificado pessoal
- **Gestores**: Dashboard + visão da equipe
- **Admins**: Dashboard executivo completo
  - Saúde dos Times (linha completa)
  - Alertas Executivos + Insights (2 colunas)
  - Espaçamentos generosos

---

## 🏗️ Arquitetura Técnica

### Backend (NestJS + Prisma)

**Database Schema Multi-tenant:**

```sql
-- Gamification Profile (per user + workspace)
model GamificationProfile {
  userId      String
  workspaceId String
  totalXP     Int @default(0)
  @@unique([userId, workspaceId])
}

-- XP Transaction Tracking
model XpTransaction {
  userId      String
  workspaceId String
  amount      Int     -- +25, -25, +50, etc.
  reason      String
  createdAt   DateTime @default(now())
}
```

### Frontend (React + TypeScript)

**Arquitetura Feature-First:**

```
src/features/
├── gamification/          # Sistema de gamificação
├── profile/              # Sistema de perfil e avatares
├── pdi/                  # Sistema PDI
├── admin/                # Administração
├── auth/                 # Autenticação (Context API)
└── shared/               # Utilities compartilhadas
```

**Padrões de Estado:**

- **Context API**: Auth, estado global essencial
- **React Hooks**: Features específicas (useTeamManagement)
- **Zustand**: Reserve para casos complexos (ainda não usado)

### Design System v2.0 - Violet Revolution

**Identidade Visual:**

- 🟣 **Paleta Violet**: `violet-600` (#7c3aed) como cor principal
- 🔤 **Tipografia Geist**: Font moderna otimizada
- 🎨 **Tokens Sistematizados**: Brand colors 50-900 + surface 0-400
- ✨ **Micro-interactions**: Hover, scale, rotate, shadow effects
- 🌟 **Gradientes Refinados**: Transições suaves

**Componentes Modernizados:**

- TopNavbar redesigned com card de níveis
- Sistema de notificações com dropdown
- Sidebar com micro-interactions
- Progress bars animados
- 26+ Avatares SVG profissionais (6 categorias)

---

## 🎯 Filosofia Team-First

### Mudanças Revolucionárias

- 🏆 **Apenas Rankings de Equipe**: Sem ranking individual
- 📊 **Leaderboards Colaborativos**: Foco em sucesso coletivo
- 👥 **Badges Team-Oriented**: Conquistas de colaboração
- 📚 **Página Educativa**: Guia sobre XP e team-first

**Benefícios:**

- Reduz competição tóxica
- Incentiva mentoria mútua
- Promove crescimento conjunto
- Ambiente de trabalho mais saudável

**Nova Navegação:**

- 🏠 **Início**: Dashboard personalizado
- 🎯 **Desenvolvimento**: PDI individual
- 👥 **Equipe**: Para TODOS os usuários
- 🏆 **Classificação**: Rankings de equipes
- 📚 **Sistema**: Guia de gamificação
- ⚙️ **Admin**: Administração

---

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# Clone
git clone https://github.com/Forji-tecnologia/forge.git
cd forge

# Backend
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run seed

# Frontend
cd ../frontend
npm install
cp .env.example .env

# Executar
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Configuração de Ambiente

**Backend (.env):**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/forge"
JWT_SECRET="your-jwt-secret"
FRONTEND_URL="http://localhost:5173"
```

**Frontend (.env):**

```env
VITE_API_URL="http://localhost:3000"
```

---

## 📊 APIs Principais

### Gamificação

```typescript
POST / gamification / add - xp; // Adicionar XP
GET / gamification / profile; // Perfil do jogador
GET / gamification / leaderboard; // Rankings de equipes
GET / gamification / badges; // Sistema de badges
```

### Gestão Gerencial (NOVO!)

```typescript
GET / management / check -if -managed / :userId; // Verificar se é gestor
GET / management / subordinates / :id / cycle; // Ciclo do subordinado
GET / management / subordinates / :id / goals; // Metas do subordinado
GET / management / subordinates / :id / competencies; // Competências
GET / management / subordinates / :id / activities; // Atividades
```

### Atividades

```typescript
POST / activities; // Criar atividade (1:1, mentoria, etc)
PATCH / activities / :id; // Editar atividade
DELETE / activities / :id; // Deletar atividade
GET / cycles / :cycleId / activities; // Listar atividades do ciclo
```

### PDI

```typescript
GET    /pdi/me                       // PDI do usuário
PATCH  /pdi/me                       // Atualização parcial
GET    /pdi/cycles/me/:cycleId       // Ciclo histórico
POST   /pdi/cycles                   // Criar novo ciclo
```

### Administração

```typescript
GET / auth / users; // Lista de usuários
POST / auth / admin / create - user; // Criar usuário
POST / management / admin / rules; // Criar regra de liderança
```

---

## 🔒 Segurança e Qualidade

### Segurança

- Hash bcrypt para senhas
- JWT com expiração (7 dias)
- Guards de autorização (Admin, Owner, Manager)
- Validação com class-validator
- Sanitização de inputs

### Qualidade

- ESLint + Prettier configurados
- TypeScript strict mode
- Logging estruturado com Pino
- Error boundaries no frontend
- 0 erros de compilação

---

## 📈 Performance

### Otimizações Implementadas

- **Dashboard de Liderança**: 10s → <1s (90% redução)
- **Queries Bulk**: Eliminação de N+1 queries
- **Consultas Paralelas**: Promise.all
- **Memory Optimization**: Maps para lookup O(1)

### Logging

- Logs estruturados com contexto
- Interceptores globais para timing
- BigInt serialization automática
- Tratamento específico de erros Prisma

---

## 🎯 Roadmap

### ✅ Funcionalidades Implementadas (v3.1.0)

1. **Sistema de Gestão Gerencial**

   - ✅ Verificação de permissões manager → subordinado
   - ✅ Página dedicada de edição de PDI
   - ✅ CRUD completo de metas pelo gestor
   - ✅ CRUD completo de competências pelo gestor
   - ✅ Registro de atividades 1:1 pelo gestor
   - ✅ Edição de atividades 1:1 existentes
   - ✅ Hero section premium com estatísticas
   - ✅ Reutilização de componentes de criação para edição

2. **Sistema de Edição de Atividades**
   - ✅ Modal de edição reutiliza componentes de criação
   - ✅ Prefill de dados com mapeamento completo
   - ✅ Backend PATCH endpoint com UpdateActivityDto
   - ✅ Modo de edição visual diferenciado (título, botão)
   - ✅ Edição disponível apenas para atividades 1:1 (por enquanto)

### Próximas Features

1. **Sistema de Notificações Real-time**

   - WebSocket integration
   - Push notifications
   - API completa

2. **Timeline Actions**

   - Repetir atividades passadas
   - Edição de mentorias e certificações
   - Agendamento de atividades

3. **Advanced Gamification**

   - Achievements system (milestones)
   - Streak tracking
   - Leaderboards avançados

4. **Enhanced Analytics**
   - XP analytics dashboard
   - Goal completion trends
   - Team performance insights

### Melhorias Técnicas

- WebSocket para real-time updates
- Edição de todos os tipos de atividades (mentoring, certification)
- Command Palette (⌘K)
- Dark mode
- Export/import de PDI
- Testes E2E automatizados
- Sistema de notificações in-app

---

## 📚 Documentação Técnica

### Gamificação

- [GAMIFICATION_SYSTEM_COMPLETE.md](./GAMIFICATION_SYSTEM_COMPLETE.md)
- [GOAL_MANAGEMENT_COMPLETE.md](./GOAL_MANAGEMENT_COMPLETE.md)
- [ANIMATION_SYSTEM.md](./ANIMATION_SYSTEM.md)
- [XP_TRACKING_ARCHITECTURE.md](./XP_TRACKING_ARCHITECTURE.md)

### Gestão Gerencial (NOVO!)

- Sistema de edição gerencial de PDI implementado
- Verificação de permissões manager → subordinado
- Endpoints dedicados em `/management/subordinates/:id/*`
- Reutilização de componentes com contexto gerencial

### Arquitetura

- [ARCHITECTURE_PATTERNS.md](./frontend/ARCHITECTURE_PATTERNS.md)
- [AUTH_REFACTORING.md](./frontend/AUTH_REFACTORING.md)
- [ADMIN_MOCK_REFACTORING.md](./frontend/ADMIN_MOCK_REFACTORING.md)

### Integração Backend-Frontend

- [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)
- [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)
- [INTEGRATION_ROADMAP.md](./INTEGRATION_ROADMAP.md)

---

## 💡 Padrão Mock-First Development

Todas as features seguem desenvolvimento independente:

```
/features/[feature]/
  ├── data/mock[Feature].ts    # Mock data + helpers
  ├── hooks/use[Feature].tsx   # Custom hooks
  ├── types/[feature].ts       # TypeScript types
  └── components/              # UI components
```

**Usuários Mock:**

```typescript
// Admin + Manager
Email: diego@forge.com
Senha: qualquer coisa

// Manager
Email: maria@forge.com
Senha: qualquer coisa

// Usuário
Email: ana@forge.com
Senha: qualquer coisa
```

---

## 🎓 Lições de Arquitetura

### Context API vs Hooks vs Zustand

**Use Context API quando:**

- Estado global essencial (Auth, Theme)
- Provider pattern natural
- Performance adequada (mudanças raras)

**Use React Hooks quando:**

- Estado específico de feature
- Props drilling aceitável
- useState + useCallback suficientes

**Use Zustand quando:**

- Estado verdadeiramente global complexo
- Middleware customizado necessário
- Acesso fora de componentes React
- Performance crítica

---

## 📊 Estatísticas do Projeto

**Qualidade:**

- ✅ 0 erros de compilação
- ✅ 0 warnings
- ✅ 100% TypeScript
- ✅ 1000+ linhas de documentação
- ✅ Sistema de edição gerencial completo

**Arquitetura:**

- ✅ Feature-first organization
- ✅ Mock-first development
- ✅ Design system v2.0 compliance
- ✅ Multi-tenant support
- ✅ Reutilização de componentes para edição

**Performance:**

- ✅ 90% redução em queries críticas
- ✅ Real-time updates
- ✅ Micro-interactions otimizadas
- ✅ SVG avatares inline
- ✅ Endpoints dedicados para gestores

---

## 🤝 Contribuição

### Estrutura de Desenvolvimento

```bash
# Hot reload
cd backend && npm run start:dev
cd frontend && npm run dev

# Testes
npm test          # Unitários
npm run test:e2e  # Integração
npm run test:cov  # Cobertura
```

### Convenções

- `import type` para tipos
- Feature-first architecture
- TypeScript strict mode
- Mock-first para novas features

---

**MVP evoluído para Team-First Platform com Gamificação e Gestão Gerencial Completa.**

O Forge revolucionou a gestão de times ao combinar gamificação inteligente (+25 a +100 XP por ação) com filosofia team-first (rankings colaborativos), design system violet profissional, sistema completo de goals com XP tracking em tempo real, e **novo sistema de gestão gerencial** que permite aos managers editarem completamente o PDI de seus subordinados - incluindo metas, competências e atividades - tudo em uma interface unificada e intuitiva. Uma plataforma que promove colaboração sobre competição individual em um ambiente moderno, engajante e altamente interativo, com ferramentas poderosas para gestores.

```

```
