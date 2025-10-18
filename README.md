# Forge

Plataforma gamificada para desenvolvimento de times e evolução de Planos de Desenvolvimento Individual (PDI). Stack: **NestJS + Prisma/PostgreSQL** (backend) e **React 19 + Vite + TailwindCSS** (frontend).

## 🎯 **Status Atual do Projeto**

**Versão:** v2.7.0 - Backend Integration Ready  
**Última Atualização:** 17 de outubro de 2025

### 🚀 Próxima Etapa: Integração Backend-Frontend

O projeto está pronto para integração completa entre backend e frontend:

- **✅ Backend**: NestJS + Prisma rodando (37 endpoints REST)
- **✅ Frontend**: React com mock data (100% funcional)
- **📋 Plano de Integração**: Documentação completa criada
- **�️ Roadmap**: 8 fases definidas (~4-5 semanas)

**📚 Documentos de Integração Completos:**

- 📊 [**INTEGRATION_OVERVIEW.md**](./INTEGRATION_OVERVIEW.md) - Visão geral em tabelas
- 📋 [**INTEGRATION_PLAN.md**](./INTEGRATION_PLAN.md) - Plano técnico completo (8 fases)
- 🔧 [**INTEGRATION_EXAMPLES.md**](./INTEGRATION_EXAMPLES.md) - Código pronto (11 exemplos)
- 🗺️ [**INTEGRATION_ROADMAP.md**](./INTEGRATION_ROADMAP.md) - Checklist visual (43 tarefas)
- 🚀 [**INTEGRATION_QUICKSTART.md**](./INTEGRATION_QUICKSTART.md) - Guia de início rápido
- 📊 [**INTEGRATION_EXECUTIVE_SUMMARY.md**](./INTEGRATION_EXECUTIVE_SUMMARY.md) - Para stakeholders
- 🏗️ [**INTEGRATION_ARCHITECTURE.md**](./INTEGRATION_ARCHITECTURE.md) - Diagramas visuais
- 📚 [**INTEGRATION_README.md**](./INTEGRATION_README.md) - Índice de documentação
- 🔤 [**shared-types/index.ts**](./shared-types/index.ts) - Tipos TypeScript compartilhados

**Total:** 8 documentos (~170 páginas) + tipos compartilhados

**Quick Start para Desenvolvimento:**

```bash
# Login como admin (mock)
Email: diego@forge.com
Senha: qualquer coisa

# Próximo passo: Implementar integração seguindo INTEGRATION_PLAN.md
```

## 🚨 **CHANGELOG RECENTE** - Outubro 2025

### ✨ **v2.6.0 - Mock-First Architecture: Admin & Auth Refactoring**

**📅 Data:** 16 de outubro de 2025

**🎯 Objetivo:** Refatoração completa dos sistemas de Admin e Auth para desenvolvimento independente de backend usando exclusivamente mock data.

---

#### 🔐 **Auth System Refactoring**

**🏗️ Decisão Arquitetural: Context API (não Zustand)**

**Por Que Context API é a Escolha Correta:**

- ✅ Auth é estado top-level essencial (necessário antes da árvore de componentes)
- ✅ Provider pattern é natural para auth (`<AuthProvider><App /></AuthProvider>`)
- ✅ Lógica de ciclo de vida complexa (useEffect para validação de token)
- ✅ Performance adequada (auth muda raramente - login/logout)
- ✅ Simplicidade e idiomático React (sem dependências extras)

**Zustand NÃO é necessário porque:**

- ❌ Auth não precisa de acesso fora de componentes React
- ❌ Não há benefício de performance (mudanças raras)
- ❌ Context API já resolve perfeitamente
- ❌ Aumentaria complexidade desnecessariamente
- ❌ Não precisa de DevTools para debug de auth

**📂 Arquivos Criados:**

```
/features/auth/
  └── data/
      └── mockAuth.ts          # Mock data layer (~180 linhas)
```

**📝 Arquivos Modificados:**

```
/features/auth/
  ├── hooks/
  │   └── useAuth.tsx          # AuthProvider refatorado (Context API)
  └── index.ts                 # Exports atualizados
```

**👥 Usuários Mock Disponíveis:**
| Email | Senha | Roles | Uso |
|-------|-------|-------|-----|
| diego@forge.com | qualquer | Admin + Manager | Testes admin |
| maria@forge.com | qualquer | Manager | Testes manager |
| ana@forge.com | qualquer | User | Testes user |
| carlos@forge.com | qualquer | User | Testes user |
| pedro@forge.com | qualquer | User | Testes user |

> **Nota:** No modo mock, QUALQUER senha é aceita para simplificar testes.

**⚡ Funcionalidades:**

- ✅ Login com email/senha (delay 500ms)
- ✅ Registro de novo usuário (delay 600ms)
- ✅ Validação de token ao montar (delay 300ms)
- ✅ Sessão persistente (localStorage)
- ✅ Logout limpa sessão
- ✅ Console logs informativos (✅/❌/👋/🔄)
- ✅ Validação de email duplicado
- ✅ Mensagens de erro apropriadas

**🔄 Antes vs Depois:**

```typescript
// ANTES (API)
const res = await api<{ access_token: string }>("/auth/login", {...});
storeToken(res.access_token);

// DEPOIS (Mock)
const { user, token } = await mockLogin(email, password);
localStorage.setItem(STORAGE_TOKEN_KEY, token);
setUser(user);
```

---

#### 👥 **Admin System Refactoring**

**🏗️ Decisão Arquitetural: React Hooks (não Zustand)**

**Por Que React Hooks Nativos:**

- ✅ Estado específico da feature (não global)
- ✅ Props drilling aceitável (hierarquia rasa)
- ✅ useState + useCallback são suficientes
- ✅ Sem necessidade de acesso fora de componentes
- ✅ Performance adequada (sem re-renders problemáticos)

**📂 Novo Hook Criado:**

```
/features/admin/hooks/
  └── useTeamManagement.ts     # Substitui useAdminTeams.ts (~350 linhas)
```

**🗑️ Arquivos Removidos:**

```
/features/admin/hooks/
  └── useAdminTeams.ts         # Arquivo corrompido removido
```

**🔕 Serviços Deprecated:**

```
/features/admin/services/
  ├── adminApi.ts              # Comentado no index.ts
  └── teamsApi.ts              # Comentado no index.ts
```

**📝 Componentes Atualizados (4):**

- `TeamsManagement.tsx` - Gerenciamento principal
- `HierarchyModal.tsx` - Modal de hierarquia
- `AdminCreateRuleModal.tsx` - Criação de regras
- `AdminSubordinatesManagement.tsx` - Gestão de subordinados

**📊 Mock Data Expandido:**

```typescript
mockTeams: TeamSummary[] = [
  { id: 101, name: "Frontend", members: 5, managers: 1 },
  { id: 102, name: "Backend", members: 4, managers: 1 },
  { id: 103, name: "Produto", members: 3, managers: 1 },
  { id: 104, name: "QA", members: 2, managers: 0 }
]
```

**⚡ API do Hook:**

```typescript
interface UseTeamManagementReturn {
  // Estado
  teams: TeamSummary[];
  filteredTeams: TeamSummary[];
  loading: boolean;
  error: string | null;
  metrics: TeamMetrics | null;
  selectedTeam: TeamDetail | null;
  filters: TeamFilters;

  // Ações
  refresh: () => Promise<void>;
  selectTeam: (teamId: number | null) => Promise<void>;
  createTeam: (data: CreateTeamInput) => Promise<TeamSummary>;
  updateTeam: (teamId: number, data: UpdateTeamInput) => Promise<void>;
  deleteTeam: (teamId: number) => Promise<void>;
  addMember: (teamId, userId, role) => Promise<void>;
  updateMemberRole: (teamId, userId, newRole) => Promise<void>;
  removeMember: (teamId, userId) => Promise<void>;
  updateFilters: (newFilters) => void;
}
```

**⏱️ Delays Simulados:**
| Operação | Delay | Razão |
|----------|-------|-------|
| refresh() | 300ms | Simular carregamento de lista |
| selectTeam() | 200ms | Simular busca de detalhes |
| createTeam() | 400ms | Simular criação + validação |
| updateTeam() | 400ms | Simular atualização |
| deleteTeam() | 500ms | Simular deleção |
| addMember/removeMember | 300ms | Simular mutação |

---

#### 📚 **Documentação Criada**

**5 Documentos Técnicos Completos:**

1. **AUTH_REFACTORING.md** (~300 linhas)

   - Decisão arquitetural Context vs Zustand
   - Fluxo de autenticação completo
   - API do AuthProvider
   - Usuários mock e exemplos
   - Lições de arquitetura

2. **AUTH_TESTING_GUIDE.md** (~200 linhas)

   - Como testar cada funcionalidade
   - Casos de teste automatizados
   - Checklist de validação
   - Troubleshooting completo

3. **AUTH_SUMMARY.md** (~150 linhas)

   - Resumo executivo
   - Comparação antes/depois
   - Métricas de qualidade
   - Benefícios alcançados

4. **ADMIN_MOCK_REFACTORING.md** (~250 linhas)

   - Hook useTeamManagement detalhado
   - Mock data expandido
   - Componentes atualizados
   - Próximos passos

5. **ARCHITECTURE_PATTERNS.md** (~300 linhas)
   - Comparação Admin vs Auth
   - Padrões consistentes
   - Quando usar cada abordagem
   - Guia para futuras features

---

#### 🎯 **Padrões Arquiteturais Estabelecidos**

**📋 Quando Usar Cada Abordagem:**

| Caso de Uso                              | Solução     | Exemplo               |
| ---------------------------------------- | ----------- | --------------------- |
| Estado global essencial                  | Context API | Auth, Theme           |
| Estado específico de feature             | React Hooks | Admin Teams, Settings |
| Estado verdadeiramente global + complexo | Zustand     | (nenhum caso ainda)   |

**🔧 Padrão de Mock Data:**

```
/features/[feature]/
  ├── data/
  │   └── mock[Feature].ts    # Mock data + helpers
  ├── hooks/
  │   └── use[Feature].tsx    # Custom hooks
  ├── types/
  │   └── [feature].ts        # TypeScript types
  └── components/             # UI components
```

**✅ Princípios Aplicados:**

- **KISS** (Keep It Simple) - React nativo quando possível
- **DRY** (Don't Repeat Yourself) - Helpers reutilizáveis
- **YAGNI** (You Aren't Gonna Need It) - Sem over-engineering
- **Single Responsibility** - Separação clara de concerns

---

#### 📊 **Estatísticas da Refatoração**

**Auth System:**

- ✅ 2 arquivos criados
- ✅ 2 arquivos modificados
- ✅ 0 arquivos removidos
- ✅ ~180 linhas de mock data
- ✅ 5 usuários mock
- ✅ 5 documentos criados

**Admin System:**

- ✅ 1 hook criado (useTeamManagement.ts)
- ✅ 1 arquivo removido (useAdminTeams.ts)
- ✅ 4 componentes atualizados
- ✅ 2 serviços deprecated
- ✅ ~150 linhas de mock data expandido
- ✅ 4 times mock

**Qualidade:**

- ✅ 0 erros de compilação
- ✅ 0 warnings
- ✅ 100% TypeScript
- ✅ Console logs informativos
- ✅ Documentação excepcional

---

#### 🚀 **Benefícios Alcançados**

**Desenvolvimento:**

- ✅ **Independente de Backend** - Frontend evolui sozinho
- ✅ **Testes Rápidos** - Sem setup de servidor necessário
- ✅ **UX Realista** - Delays simulados de rede
- ✅ **Debugging Fácil** - Console logs descritivos

**Arquitetura:**

- ✅ **Decisões Documentadas** - Context vs Zustand explicado
- ✅ **Padrões Consistentes** - Admin e Auth seguem mesma estrutura
- ✅ **Código Limpo** - Separação de concerns clara
- ✅ **Manutenibilidade** - Fácil adicionar novas features

**Qualidade:**

- ✅ **Type Safety** - 100% TypeScript
- ✅ **Testabilidade** - Mock data simplifica testes
- ✅ **Performance** - React hooks otimizados
- ✅ **Developer Experience** - Documentação completa

---

#### ⚠️ **Limitações Conhecidas (Intencionais)**

**Auth Mock:**

- Qualquer senha aceita (simplifica testes)
- Novos usuários não persistem após reload
- Token não expira
- Sem refresh token

**Admin Mock:**

- Sem persistência de dados
- Times/membros resetam no reload
- Sem validações complexas de backend
- Mock data estático

> **Estas limitações são propositais para facilitar desenvolvimento e testes.**

---

#### 📖 **Como Usar**

**Testar Auth:**

```bash
# Login como admin
Email: diego@forge.com
Senha: 123

# Console mostrará:
✅ Login mock bem-sucedido: Diego Santos

# Recarregar mantém sessão:
✅ Usuário autenticado (mock): Diego Santos
```

**Testar Admin:**

```typescript
// Em qualquer componente
import { useTeamManagement } from "@/features/admin";

function MyComponent() {
  const { teams, loading, createTeam } = useTeamManagement();

  const handleCreate = async () => {
    await createTeam({ name: "Novo Time" });
    console.log("✅ Time criado (mock)");
  };
}
```

---

#### 🎓 **Lições de Arquitetura**

**Context API é Perfeito Para Auth Porque:**

1. Auth é singleton conceitual (um usuário por sessão)
2. Provider encapsula app naturalmente
3. useEffect + useState são suficientes
4. Não precisa de DevTools complexos
5. Performance não é gargalo

**React Hooks São Suficientes Para Features Porque:**

1. Estado específico não precisa ser global
2. Props drilling é aceitável em hierarquias rasas
3. useState + useCallback cobrem 90% dos casos
4. Menos dependências = menos complexidade
5. React nativo é mais fácil de entender

**Use Zustand Apenas Quando:**

- Estado verdadeiramente global com muitas ações
- Precisa de middleware customizado
- Acesso fora de componentes React
- DevTools são essenciais
- Performance crítica com muitas atualizações

> **Para Auth e Admin, React nativo é arquiteturalmente superior.**

---

#### 📖 **Documentação Técnica Completa**

**Leia os documentos detalhados para compreensão completa:**

1. **[AUTH_REFACTORING.md](./frontend/AUTH_REFACTORING.md)**

   - 📋 Decisão arquitetural Context vs Zustand
   - 🔄 Fluxo completo de autenticação
   - 📊 Diagrama de estados
   - 👥 Usuários mock disponíveis
   - 🎓 Lições de arquitetura

2. **[AUTH_TESTING_GUIDE.md](./frontend/AUTH_TESTING_GUIDE.md)**

   - ✅ Casos de teste passo a passo
   - 🧪 Suite de testes automatizados
   - 🐛 Troubleshooting completo
   - ⏱️ Delays e timings esperados

3. **[AUTH_SUMMARY.md](./frontend/AUTH_SUMMARY.md)**

   - 📊 Resumo executivo
   - 📈 Comparação antes/depois
   - 🎯 Métricas de qualidade
   - 🚀 Benefícios alcançados

4. **[ADMIN_MOCK_REFACTORING.md](./frontend/ADMIN_MOCK_REFACTORING.md)**

   - 🔧 Hook useTeamManagement detalhado
   - 📊 Mock data expandido
   - 🔄 Componentes atualizados
   - ⏭️ Próximos passos

5. **[ARCHITECTURE_PATTERNS.md](./frontend/ARCHITECTURE_PATTERNS.md)**
   - 🏗️ Comparação Admin vs Auth
   - 📋 Padrões consistentes
   - 🎯 Quando usar cada abordagem
   - 📚 Guia para futuras features

**Quick Start:**

```bash
# 1. Abra a aplicação
npm run dev

# 2. Faça login como admin
Email: diego@forge.com
Senha: 123

# 3. Verifique console
✅ Login mock bem-sucedido: Diego Santos

# 4. Navegue para Admin
# Todos os times carregam com mock data
✅ Times carregados (mock): 4
```

---

### ✨ **v2.5.0 - Cycles Architecture Revolution + Debug Panel**

### ✨ **v2.5.0 - Cycles Architecture Revolution + Debug Panel**

**🔧 Refatoração Completa da Arquitetura de Cycles:**

- **📂 Organização por Funcionalidade**: Componentes organizados em pastas semânticas:

  ```
  /features/cycles/components/
  ├── cycle-management/     # Gestão principal de ciclos
  ├── tracking-recorders/   # Gravadores de atividades
  ├── competency-management/ # Gestão de competências
  ├── ui-shared/           # Componentes reutilizáveis
  └── debug/               # Ferramentas de debug
  ```

- **⚡ CurrentCycleMain Decomposição**: Quebrado de **496 linhas** para **85 linhas** (83% redução):
  - `CycleHeader` - Header com título e ações
  - `CycleMetrics` - Métricas visuais do ciclo
  - `GoalsList` - Lista de metas interativas
  - `CompetenciesPreview` - Preview das competências
  - `NextSteps` - Próximos passos sugeridos
  - `RecentActivity` - Atividade recente do usuário
  - `EmptyState` - Estado vazio para primeiro acesso
  - `LoadingState` - Estado de carregamento
  - `CycleModals` - Gerenciamento centralizado de modais

**🐛 CycleDebugPanel - Ferramenta de Debug Avançada:**

- **📊 Visualização de Estado**: Hook state completo, goals summary, cycle data
- **⚡ Métricas de Performance**: Render count, render times, memory usage
- **🎮 Simulador de Ações**: Update goals, complete goals, log state, test errors
- **🔧 Info do Ambiente**: Viewport, user agent, modal states, timestamps
- **🎯 Características**:
  - Painel draggável no canto inferior direito
  - Z-index 60 (acima de sidebar/navbar)
  - Seções expansíveis com JSON viewers
  - Disponível apenas em desenvolvimento
  - Animações suaves e UX polida

**🎨 Design System v2.4 Compliance:**

- **Modal Patterns**: `max-w-3xl`, `max-h-[85vh]`, `shadow-xl`, `border-surface-300`
- **Violet Brand Colors**: `from-violet-600 to-violet-500` gradientes
- **Consistent Spacing**: Padding e margins padronizadas
- **Lucide Icons**: 100% ícones Lucide React

**🏗️ Benefícios da Refatoração:**

- ✅ **Manutenibilidade**: Componentes com responsabilidade única
- ✅ **Reutilização**: Componentes modulares e exportáveis
- ✅ **Testing**: Cada componente pode ser testado individualmente
- ✅ **Performance**: Bundle splitting e lazy loading otimizados
- ✅ **Developer Experience**: Debug panel para desenvolvimento eficiente
- ✅ **Code Quality**: Redução drástica de linhas e complexidade

### ✨ **v2.4.1 - Admin Dashboard Layout Revolution + Spacing Enhancements**

**🎨 Layout AdminDashboard Reorganizado:**

- **👥 Saúde dos Times - Linha Completa**: TeamsHealthGrid agora ocupa linha inteira para melhor visualização
- **📊 Layout Estratégico 2 Colunas**: Alertas Executivos e Insights Estratégicos dividem tela igualmente
- **📐 Estrutura Final Otimizada**:
  ```
  ┌─────────────────────────────────────────────────┐
  │           Company Health Overview                │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────┐
  │            Teams Health Grid                     │
  │          (Linha completa - todos os times)      │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────┐ ┌─────────────────────────┐
  │   Executive Alerts  │ │  Strategic Insights     │
  │    (Coluna 1/2)     │ │     (Coluna 2/2)        │
  └─────────────────────┘ └─────────────────────────┘
  ```

**🌟 Melhorias de Espaçamento Implementadas:**

- **AdminDashboard Principal**:

  - Espaçamento geral: `space-y-8` → `space-y-10`
  - Grid gaps: `gap-8` → `gap-10` em todos os layouts
  - Layout responsivo: `grid-cols-1 lg:grid-cols-2` para alertas/insights

- **CompanyHealthOverview**:

  - Padding: `p-6` → `p-8` para mais breathing room
  - Header spacing: `mb-6` → `mb-8`, `gap-3` → `gap-4`
  - Ícones maiores: `w-12 h-12` → `w-14 h-14`, `w-6 h-6` → `w-7 h-7`
  - Typography: Headers `text-xl` → `text-2xl`
  - Ring de saúde: `w-32 h-32` → `w-36 h-36`
  - Métricas: `text-3xl` → `text-4xl`, `w-16 h-16` → `w-18 h-18`

- **TeamsHealthGrid**:
  - Container padding: `p-6` → `p-8`
  - Header improvements: `mb-6` → `mb-8`, `gap-3` → `gap-4`
  - Cards spacing: `gap-4` → `gap-6`, `p-4` → `p-5`
  - Summary stats: `text-lg` → `text-xl`, `text-xs` → `text-sm`
  - Team health scores: `text-lg` → `text-xl`

**🎯 Benefícios do Novo Layout:**

- ✅ **Melhor foco nos times**: Grid com largura total permite visualizar mais cards
- ✅ **Equilíbrio visual**: Alertas e Insights têm importância igual
- ✅ **Breathing room**: Espaçamentos generosos eliminam sensação "espremida"
- ✅ **Hierarquia clara**: Fluxo visual top-down mais intuitivo
- ✅ **Responsividade**: Layout adapta bem em tablets e mobile

### ✨ **v2.4.0 - Design System Compliance + Nomenclatura Atualizada**

- **📊 Mini-Cards de Métricas Coloridos**:
  - Violet (Membros), Amber (Responsáveis), Slate (Dias de vida)
  - Gradientes sutis com hover effects e scale animations
  - Ícones Lucide React (Users, Crown, Calendar) seguindo Design System v2.3
- **🎯 Gradiente Responsável Refinado**:

  - Mudança de `from-amber-50 to-yellow-50` mais sutil
  - Header com gradiente forte, card interno branco para legibilidade
  - Backdrop blur no ícone: `bg-white/30 backdrop-blur-sm`

- **➕ Botão "Adicionar Membro" Destacado**:

  - Background branco com texto brand para alto contraste
  - Posicionamento no header do card de membros
  - Micro-interactions: scale effects e shadow progression
  - Ícone UserPlus (Lucide) ao invés de FiPlus

- **✨ Ícones Lucide Integrados**:
  - Substituição completa de react-icons por Lucide React
  - Consistência total com Design System v2.3
  - Cores semânticas: brand-600, amber-600, slate-600

**🎭 Micro-interactions Adicionadas:**

- Hover states com scale (105% hover, 95% active)
- Shadow transitions (sm → md)
- Color transitions suaves (duration-200)
- Cards de membros com hover border e background sutil

### ✨ **v2.4.0 - Design System Compliance + Nomenclatura Atualizada**

**🎨 Conformidade Total com Design System v2.0 (Violet):**

- Violet (Membros), Amber (Responsáveis), Slate (Dias de vida)
- Gradientes sutis com hover effects e scale animations
- Ícones Lucide React (Users, Crown, Calendar) seguindo Design System v2.3
- **🎯 Gradiente Responsável Refinado**:

  - Mudança de `from-amber-50 to-yellow-50` mais sutil
  - Header com gradiente forte, card interno branco para legibilidade
  - Backdrop blur no ícone: `bg-white/30 backdrop-blur-sm`

- **➕ Botão "Adicionar Membro" Destacado**:

  - Background branco com texto brand para alto contraste
  - Posicionamento no header do card de membros
  - Micro-interactions: scale effects e shadow progression
  - Ícone UserPlus (Lucide) ao invés de FiPlus

- **✨ Ícones Lucide Integrados**:
  - Substituição completa de react-icons por Lucide React
  - Consistência total com Design System v2.3
  - Cores semânticas: brand-600, amber-600, slate-600

**🎭 Micro-interactions Adicionadas:**

- Hover states com scale (105% hover, 95% active)
- Shadow transitions (sm → md)
- Color transitions suaves (duration-200)
- Cards de membros com hover border e background sutil

## 🚨 **CHANGELOG RECENTE** - Outubro 2025

### ✨ **v2.3.1 - Teams UI Quick Wins**

**🎨 Melhorias Visuais Implementadas (Quick Wins):**

- **� Gradientes Violet**: Cor principal da plataforma `from-violet-600 to-violet-500`
- **🎯 Ícones Unificados**: 100% Lucide React em todo sistema de equipes
- **📐 Cores Semânticas**: Uso correto de tokens violet-\* conforme design system
- **✨ Micro-interactions**: Hover effects e transitions padronizadas

**👑 Nomenclatura Atualizada - "Responsável" → "Líder":**

- **Hierarquia Clara**: Mudança de "Responsável" para "Líder" em toda plataforma
- **Terminologia Consistente**: líder/líderes ao invés de responsável(is)
- **Cards Diferenciados**: Visual amber/yellow mantido para destaque de líderes
- **Interface Intuitiva**: Nomenclatura mais clara e profissional

**🔧 Melhorias Técnicas:**

- **Performance**: Tree-shaking otimizado com Lucide Icons
- **Consistência**: Gradientes `from-violet-600 to-violet-500` padronizados
- **Acessibilidade**: Focus rings `ring-violet-500` conforme design system
- **Manutenibilidade**: Tokens centralizados facilitam futuras mudanças

### ✨ **v2.3.0 - Teams Management Revolution**

**👥 Novo Sistema de Gestão de Equipes:**

- **🎯 Interface Redesenhada**: Layout em duas colunas (35% configurações / 65% membros)
- **📊 Métricas Integradas**: Cards de estatísticas dentro das informações básicas
- **👑 Hierarquia Visual Clara**: Responsáveis com destaque dourado e badges diferenciados
- **🎨 Design System v2.3**: Gradientes violet/amber, espaçamentos otimizados
- **⚡ Navegação por Páginas**: Edição em tela completa ao invés de modais
- **🔄 Status da Equipe**: Radio buttons para ativar/arquivar equipes
- **📝 Informações Contextuais**: Tempo como responsável/membro, cargos, contatos
- **✨ Ações Inteligentes**: Promover a responsável, alterar, remover membros
- **🗑️ Interface Limpa**: Sem breadcrumbs, informações consolidadas em cards

**🎨 Componentes de Edição de Equipe:**

- **TeamEditView**: Tela completa com botão voltar e layout em duas colunas
- **Configurações (35%)**: Nome, descrição, status, estatísticas da equipe
- **Membros (65%)**: Seção de responsável destacada + lista de membros
- **Cards Diferenciados**:
  - Responsável: Background amber/yellow, badge de coroa, ações específicas
  - Membros: Background branco, opção de promover, badges violet
- **Informações Temporais**: "Responsável há X dias", "Membro há X meses"

**🚀 Melhorias de UX:**

- **Navegação Intuitiva**: Seta voltar sempre visível, sem confusão de modais
- **Ações Contextuais**: Botões adaptados ao papel (Alterar/Remover para responsável, Promover/Remover para membro)
- **Estados Vazios**: Mensagens claras quando não há membros
- **Responsividade Total**: Layout se adapta de desktop (2 colunas) a mobile (empilhado)

### ✨ **v2.2.0 - Teams Revolution + Design System Compliance**

**👥 Nova Página de Equipes Team-First:**

- **🎯 Layout 1-1-1 Equilibrado**: 3 colunas iguais (33% cada) para melhor distribuição visual
- **🔄 Multi-Persona Support**: Views adaptadas para colaboradores, managers e admins
- **📊 Minha Contribuição**: Card pessoal com XP, ranking, mentorias, badges e streak
- **🎯 Próximas Ações**: Sistema de tarefas pendentes com tipos e prioridades
- **⏰ Timeline da Equipe**: Eventos categorizados (badges, colaboração, XP, milestones)
- **🎯 Objetivos da Equipe**: Progresso visual com barras e status em tempo real
- **🐛 Debug Role Switcher**: Alternância runtime entre colaborador/manager/admin

**🗂️ Navbar Reorganizada Team-First:**

- **📋 Nova Estrutura**: Início → Desenvolvimento → Equipe → Classificação → Sistema → Admin
- **👥 Equipe Universal**: Disponível para TODOS os usuários (não mais só managers)
- **🏆 Classificação Team-First**: Ranking de equipes substituindo rankings individuais
- **📚 Sistema Educativo**: "Sistema" substituindo "Growth System" para clareza
- **🎯 Nomenclatura Brasileira**: "Desenvolvimento" e "Classificação" mais intuitivos

**🎨 Conformidade Total com Design System:**

- **🔄 Migração para Lucide React**: Substituição completa de SVGs inline por ícones Lucide
- **🎨 Tokens de Cores Corretos**: brand-600, success-600, warning-600, error-600, surface-\*
- **📐 Espaçamento Padronizado**: p-6, gap-8, space-y-8 seguindo grid 4px
- **🎯 Tipografia Hierárquica**: font-semibold para headers, text-xl/sm/xs consistentes
- **🚫 Zero Emojis**: Remoção completa substituindo por ícones profissionais
- **⚪ Status Indicators**: Círculos coloridos com fill-current para online/away/offline

**🔧 Melhorias Técnicas:**

- **📦 Lucide React Instalado**: Biblioteca oficial do design system para ícones
- **🎯 Componentes Otimizados**: MyContribution, UpcomingActions, TeamTimeline, TeamObjectives
- **⚡ Performance**: Build otimizado com tree-shaking de ícones
- **🎨 Consistência Visual**: 100% dos componentes /teams em conformidade

### ✨ **v2.1.1 - Sino de Notificação Funcional**

**🔔 Sistema de Notificações Implementado:**

- **🔔 Sino Interativo**: Botão de notificação totalmente funcional na TopNavbar
- **📱 Dropdown Inteligente**: Modal com notificações categorizadas e timestamps
- **🎨 Design System Compliant**: Interface seguindo violet design system v2.1
- **⚡ Auto-fechamento**: Click fora fecha automaticamente o dropdown
- **💫 Micro-interactions**: Hover effects e transições suaves
- **🏆 Tipos de Notificação**: XP ganho, badges conquistados, feedback recebido
- **📊 Contador Visual**: Badge pulsante indicando novas notificações
- **🎯 Estrutura Escalável**: Preparado para integração com API real

### ✨ **v2.1 - Sistema de Avatares SVG Profissionais**

**🎨 Avatares SVG Profissionais Implementados:**

- **🎨 26+ Avatares SVG**: Sistema completo com ilustrações vetoriais profissionais
- **📂 6 Categorias Organizadas**: Profissionais, Abstratos, Minimalistas, Criativos, Geométricos, Natureza
- **🚫 Remoção Completa de Emojis**: Migração total para ilustrações SVG sofisticadas
- **🔧 Seletor Unificado**: Interface elegante com tabs de categorias e grid responsivo
- **🎯 Gradientes Personalizados**: Cada avatar com sua própria paleta harmoniosa
- **⚡ Renderização Otimizada**: SVGs inline para performance máxima

### ✨ **v2.0 - Design System Revolution + Team-First**

**🎨 Design System v2.0 Implementado:**

- **🟣 Nova Identidade Visual**: Migração completa para Violet como cor principal
- **📝 Tipografia Geist**: Font moderna e otimizada para interfaces
- **🎨 Paleta Expandida**: Sistema completo de cores (50-900) + surface tokens
- **✨ Micro-interactions**: Hover effects, scales, rotações e transições suaves
- **🌟 Gradientes Refinados**: Transições suaves eliminando excessos visuais
- **🔧 Tailwind Avançado**: Configuração personalizada com tokens semânticos

**🎯 Interface Modernizada:**

- **📊 Card de Níveis Redesenhado**: Substituiu botão Commands por card interativo de progresso
- **🗂️ TopNavbar Otimizada**: Hierarquia visual aprimorada com foco na gamificação
- **🔔 Sino de Notificação**: Sistema completo de notificações em tempo real
- **🎮 Sidebar Refinada**: Navegação elegante com micro-interactions e tooltips removidos
- **🔄 Componentes Unificados**: Design system consistente em toda aplicação

**🏆 Filosofia Team-First Mantida:**

- **👥 Rankings de Equipe**: Sistema focado exclusivamente em colaboração
- **📚 Página Educativa**: Guia completo sobre XP e filosofia team-first
- **🤝 Badges Colaborativos**: Conquistas que incentivam trabalho conjunto
- **🎨 Interface Team-Centric**: Design priorizando sucesso coletivo

**💡 Melhorias na Experiência:**

- ✅ Visual mais profissional e maduro
- ✅ Redução de elementos chamativos desnecessários
- ✅ Foco aprimorado na progressão do usuário
- ✅ Consistência visual em toda plataforma
- ✅ Performance otimizada com transições inteligentes
- ✅ Avatares profissionais substituindo emojis
- ✅ Sistema de perfil completo com seleção avançada

**🎨 Sistema de Avatares Profissionais:**

**26+ Ilustrações SVG Categorizadas:**

- **👔 Profissionais (6)**: Executivo, Designer, Desenvolvedor, Analista, Gerente, Consultor
- **🎨 Abstratos (4)**: Ondas Fluidas, Malha Gradiente, Energia Espiral, Rede Neural
- **⚪ Minimalistas (4)**: Círculo, Quadrado, Triângulo, Hexágono
- **✨ Criativos (4)**: Estrela Cósmica, Paleta Artística, Loop Infinito, Explosão Criativa
- **🔷 Geométricos (4)**: Diamante, Cubo 3D, Tessalação, Estrutura Cristalina
- **🌿 Natureza (4)**: Folha Orgânica, Pico da Montanha, Onda do Oceano, Galhos de Árvore

**Interface de Seleção Avançada:**

- **🎯 Seletor Unificado**: Modal elegante com categorias em tabs
- **📱 Grid Responsivo**: Adaptação automática para diferentes telas
- **🎨 Preview em Tempo Real**: Visualização imediata das escolhas
- **✨ Micro-interactions**: Hover effects, scaling e transições suaves
- **🔍 Tooltips Informativos**: Nome dos avatares em hover
- **⚡ Performance Otimizada**: Renderização SVG inline para velocidade máxima

---

## 🎮 Plataforma Gamificada de Gestão de Times

Sistema completo que combina desenvolvimento profissional com elementos lúdicos para maximizar engajamento e crescimento. **Recentemente otimizado com layout AdminDashboard reorganizado e espaçamentos generosos para eliminar sensação "espremida".**

### 🏆 Sistema de Gamificação

- **⚡ Sistema de XP**: Pontos por ações (completar milestones, feedbacks, colaboração)
- **🎖️ Badges Inteligentes**: Conquistas automáticas baseadas em progresso
- **🏆 Team-First Leaderboards**: Rankings focados em equipes, promovendo colaboração
- **🎯 Levels Profissionais**: 100 níveis de Rookie a Master Professional
- **🔔 Notificações em Tempo Real**: Sistema completo de feedback imediato

**🎯 Nova Estrutura de Navegação Team-First:**

- **🏠 Início**: Dashboard personalizado por perfil
- **🎯 Desenvolvimento**: PDI individual (renomeado de "Meu Desenvolvimento")
- **👥 Equipe**: Para TODOS os usuários (team-first universal)
- **� Classificação**: Rankings de equipes (substituindo rankings individuais)
- **📚 Sistema**: Como funciona a gamificação (renomeado de "Growth System")
- **⚙️ Admin**: Administração (apenas para admins)

**Benefícios da Nova Organização:**

- **Team-First Real**: Equipe acessível para todos, não só managers
- **Ordem Estratégica**: Individual → Team → Competição → Educação → Admin
- **Nomenclatura Clara**: Termos brasileiros e intuitivos
- **Filosofia Consistente**: Colaboração antes de competição

### 👥 Sistema de Equipes Team-First

**Nova Página `/teams` Revolucionária:**

- **🎯 Multi-Persona Interface**: Views adaptadas para colaboradores, managers e admins
- **📊 Layout 1-1-1 Equilibrado**: 3 colunas iguais para distribuição visual otimizada
- **🔄 Debug Role Switcher**: Alternância runtime entre perfis para desenvolvimento

**Componentes Principais:**

1. **📈 Minha Contribuição**:

   - XP pessoal com percentual da equipe
   - Ranking individual dentro do contexto team-first
   - Métricas de mentorias, badges, streak e objetivos
   - Indicador de crescimento vs mês anterior

2. **📋 Próximas Ações**:

   - Tasks pendentes categorizadas por tipo e prioridade
   - Milestones PDI, oportunidades de mentoria, badges próximos
   - Interface de priorização visual com ícones Lucide

3. **⏰ Timeline da Equipe**:

   - Eventos categorizados (badges, colaboração, XP, milestones)
   - Agrupamento inteligente por período (hoje, ontem, semana)
   - Ícones consistentes seguindo design system

4. **🎯 Objetivos da Equipe**:
   - Progresso visual com barras coloridas
   - Status em tempo real (ativo, pausado, concluído, atrasado)
   - Métricas de performance coletiva

**🎨 Design System Compliance 100%:**

- **🔄 Ícones Lucide React**: Substituição total de emojis e SVGs inline
- **🎨 Cores Semânticas**: brand-600, success-600, warning-600, error-600
- **📐 Espaçamento Grid**: p-6, gap-8, space-y-8 seguindo padrão 4px
- **⚪ Status Indicators**: Círculos preenchidos para online/away/offline
- **📝 Tipografia Consistente**: Hierarquia clara com font-semibold/medium

**🔧 Sistema de Gestão de Equipes Admin:**

- **📋 TeamsManagement**: Interface completa de CRUD para equipes
- **🎯 Layout Estratégico**: Duas colunas otimizadas (35% info / 65% membros)
- **👑 Hierarquia Visual**: Responsáveis com destaque dourado, membros com cards brancos
- **📊 Métricas em Cards**: Estatísticas integradas (membros, responsáveis, dias de vida)
- **⚡ Navegação Fluida**: Edição em página completa com botão voltar
- **🎨 Gradientes Profissionais**: Violet para brand, amber/yellow para responsáveis
- **✨ Ações Contextuais**:
  - Responsável: Alterar, Remover
  - Membro: Promover a Responsável, Remover
  - Equipe: Ativar, Arquivar
- **📝 Informações Temporais**: Tempo como responsável/membro calculado automaticamente
- **🚫 Interface Limpa**: Sem breadcrumbs, informações consolidadas nos cards

### 🎯 **NOVO**: Filosofia Team-First

**Mudanças Revolucionárias Implementadas:**

- **🏆 Apenas Rankings de Equipe**: Removido ranking individual para promover colaboração
- **📊 Leaderboards Colaborativos**: Foco total em sucesso coletivo
- **👥 Badges Team-Oriented**: Conquistas que incentivam trabalho em equipe
- **� Interface Team-Centric**: Design que prioriza equipes sobre indivíduos
- **📚 Página Educativa**: Guia explicativo sobre XP e filosofia team-first

**Benefícios da Abordagem Team-First:**

- Reduz competição tóxica entre colegas
- Incentiva mentoria e ajuda mútua
- Promove crescimento conjunto
- Valoriza diferentes tipos de contribuição
- Cria ambiente de trabalho mais saudável

### 🎨 Design System v2.0 - Violet Revolution

**Identidade Visual Completamente Renovada:**

- **🟣 Paleta Violet**: Cor principal mudou para `violet-600` (#7c3aed) - mais profissional
- **🔤 Tipografia Geist**: Font system moderna, otimizada para legibilidade em interfaces
- **🎨 Tokens Sistematizados**:
  - **Brand Colors**: 50-900 scale completa baseada em violet
  - **Surface System**: 0-400 para backgrounds e layers
  - **Semantic Colors**: success, warning, error padronizados
- **✨ Micro-interactions Engine**:
  - Hover effects inteligentes (scale, rotate, translate)
  - Transições suaves (150-500ms)
  - Shadow system (soft, glow) contextual
- **🌟 Gradientes Refinados**: Eliminação de excessos visuais, transições suaves

**Interface Components Modernizados:**

- **📊 TopNavbar Redesigned**: Card de níveis interativo + sino de notificação funcional
- **🔔 Sistema de Notificações**: Dropdown completo com feedback em tempo real
- **🎮 Sidebar Refinada**: Micro-interactions, tooltips limpos, gradientes suaves
- **👤 User Menus**: Dropdowns elegantes com gradientes de header e hover effects
- **🎯 Progress Bars**: Animações fluidas com brand colors consistentes

**Benefícios da Nova Abordagem:**

- Visual mais maduro e profissional
- Redução significativa de elementos chamativos
- Consistência absoluta em toda plataforma
- Performance otimizada com transições inteligentes
- Hierarquia visual clara priorizando gamificação

### 🎨 Design System Modernizado

**Padronização Visual v2.1 (Violet System + SVG Avatars):**

- **🟣 Paleta Violet Unificada**: Cores consistentes seguindo `brand` tokens (50-900)
- **📝 Tipografia Geist**: Font system profissional substituindo Inter
- **📐 Espaçamento Harmonioso**: Grid system aprimorado com micro-interactions
- **🎯 Gradientes Brand**: `from-brand-500 to-brand-600` padronizado (suave)
- **🧱 Cards Sistematizados**: Estrutura base com hover effects e shadows
- **👤 PlayerCard v2.1**: Avatar SVG profissional, progresso e stats seguindo design system violet
- **🎨 Sistema de Avatares SVG**: 26+ ilustrações profissionais categorizadas
- **🔧 Seletor Avançado**: Interface moderna para escolha de avatares com categorias

### 🏠 Homepage Inteligente para Gestores

**Experiência Personalizada por Perfil:**

- **Homepage = Dashboard Adaptativo**: Interface que se adapta ao perfil do usuário
- **Para Colaboradores**: Dashboard gamificado com card de níveis em destaque
- **Para Gestores**: Dashboard ampliado com visão da equipe + card de progresso interativo
- **Para Admins (CEO)**: Dashboard executivo com layout reorganizado v2.4.1
  - Saúde dos Times em linha completa para máxima visibilidade
  - Alertas Executivos e Insights Estratégicos em layout 2 colunas equilibrado
  - Espaçamentos generosos eliminando sensação "espremida"
- **Design Unificado v2.0**: Base visual violet com informações contextuais
- **Responsive & Accessible**: Otimizado para todos os dispositivos com micro-interactions

**Seção de Gestão de Equipe (Apenas para Gestores):**

- **📊 Métricas da Equipe**: Total de pessoas, PDIs ativos, progresso médio
- **👥 Destaque da Equipe**: Top 3 pessoas com melhor progresso de PDI
- **🎯 Acesso Rápido**: Navegação direta para detalhes de cada subordinado
- **⚡ Performance**: Carregamento condicional apenas para gestores
- **📈 Dados em Tempo Real**: Sincronização com sistema de management

**🎮 Card de Níveis Interativo (Nova Feature):**

- **📊 Posicionamento Estratégico**: Lado esquerdo da TopNavbar para máxima visibilidade
- **🎯 Informações Completas**: Badge do nível + progresso XP atual/próximo
- **✨ Micro-interactions**: Hover effects, gradientes suaves, transições fluidas
- **🎨 Design System v2.0**: Paleta violet, typography Geist, shadows inteligentes

**👤 Acesso Rápido ao Perfil:**

- **🔗 Avatar Clicável**: Clique direto no avatar do top-right para acessar o perfil
- **📋 Menu Contextual**: Opção "Meu Perfil" no dropdown do usuário
- **⚡ Navegação Rápida**: Acesso imediato via `/me` para perfil próprio
- **🎨 Feedback Visual**: Hover effects e tooltips informativos

## 📊 Sistema PDI Revolucionário

### 🎯 Key Results Inteligentes

**5 Tipos de Critérios Específicos:**

- **Porcentagem** (0-100%): Campos numéricos com validação
- **Aumento** (valor inicial → meta): Campos separados para cálculo preciso
- **Diminuição** (valor inicial → meta): Cálculo de redução automático
- **Data** (prazo): Campo de data + dropdown de status
- **Texto** (qualitativo): Textarea livre para critérios descritivos

**Visualização de Progresso Automática:**

- Barra de progresso visual com cores dinâmicas
- Cálculo inteligente baseado no tipo de critério
- Validação robusta contra dados incompletos

### 🎮 Integração PDI + Gamificação

**XP Automático por Ações PDI:**

```typescript
XP_SYSTEM = {
  pdi_milestone_completed: 100,
  pdi_first_milestone: 50,
  pdi_competency_improved: 50,
  pdi_cycle_completed: 300,
  key_result_achieved: 150,
  pdi_updated: 25,
};
```

**Badges Automáticos:**

- 🏃 First Steps: Primeira milestone PDI completada
- 📈 Growth Mindset: 5 competências desenvolvidas
- 🎯 Goal Crusher: 10 key results alcançados
- 🔥 Consistent: 7 dias consecutivos de atividade

### 📅 Sistema de Ciclos de PDI

**Gestão Temporal de Desenvolvimento:**

- **🗓️ Ciclos Temporais**: Organize PDIs em períodos específicos
- **📊 Progresso Temporal**: Visualização automática baseada em datas
- **🎯 Foco Direcionado**: Cada ciclo mantém suas próprias competências
- **🔄 Transições Inteligentes**: Estados (Planejado → Ativo → Pausado → Concluído)

## 🏗️ Principais Funcionalidades

### 👥 Sistema de Equipes Team-First

1. **Dashboard de Equipe**: Interface multi-persona com views adaptadas por perfil
2. **Minha Contribuição**: Card pessoal mostrando impacto no contexto da equipe
3. **Timeline Colaborativa**: Eventos de equipe categorizados e agrupados temporalmente
4. **Objetivos Coletivos**: Metas de equipe com progresso visual e status
5. **Próximas Ações**: Sistema de tarefas contextualizadas por tipo e prioridade
6. **Debug Multi-Role**: Alternância runtime entre colaborador/manager/admin

**🎯 Componentes Team-First:**

- **Layout Equilibrado**: 3 colunas (33% cada) para distribuição visual otimizada
- **Contexto Universal**: Equipe acessível para todos os usuários, não só managers
- **Ícones Profissionais**: 100% Lucide React seguindo design system v2.2
- **Performance Otimizada**: Mock data estruturado para desenvolvimento ágil

### Frontend

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS v2.0** com design system violet personalizado
- **Geist Font** para tipografia profissional otimizada
- **React Router v7** para navegação
- **Arquitetura Feature-First**: Organização modular por domínio

### Backend

- **NestJS**: Framework Node.js modular
- **Prisma**: ORM type-safe com PostgreSQL
- **PostgreSQL**: Database relacional robusto
- **JWT Authentication**: Sistema de autenticação seguro

### Arquitetura Feature-First

```
src/features/
├── gamification/          # Sistema de gamificação
│   ├── components/        # UI components
│   ├── hooks/            # API integration
│   ├── context/          # Global state
│   └── types/            # TypeScript definitions
├── profile/              # Sistema de perfil e avatares
│   ├── components/       # Avatar, ProfileHeader, Selectors
│   ├── data/            # SVG avatars, categorias
│   └── types/           # Profile interfaces
├── pdi/                  # Sistema PDI
├── admin/                # Administração (Mock-First)
│   ├── components/       # UI components
│   ├── hooks/           # useTeamManagement.ts
│   ├── data/            # mockData.ts
│   └── types/           # TypeScript interfaces
├── auth/                 # Autenticação (Context API)
│   ├── components/       # LoginForm
│   ├── hooks/           # useAuth.tsx (Context)
│   ├── data/            # mockAuth.ts
│   └── types/           # AuthUser, AuthContextValue
└── shared/              # Shared utilities
```

### 🏗️ Padrões de Arquitetura de Estado

O projeto usa diferentes estratégias de gerenciamento de estado baseadas nas necessidades:

#### Context API (Auth)

**Usado para:** Estado global essencial e top-level

- ✅ `AuthProvider` - Autenticação e sessão do usuário
- ✅ `GamificationProvider` - Estado de gamificação global

**Por quê:**

- Estado necessário antes da árvore de componentes renderizar
- Provider pattern é natural e idiomático
- Performance adequada (mudanças raras)
- Não precisa de bibliotecas extras

#### React Hooks (Features)

**Usado para:** Estado específico de features

- ✅ `useTeamManagement` - Gestão de times (Admin)
- ✅ `useAdminUsers` - Gestão de usuários (Admin)
- ✅ Hooks de features específicas

**Por quê:**

- Estado não precisa ser global
- Props drilling aceitável em hierarquias rasas
- useState + useCallback cobrem 90% dos casos
- Simplicidade e menos dependências

#### Zustand (Quando Necessário)

**Usado para:** Estado complexo verdadeiramente global

- ⏳ Ainda não implementado no projeto
- 🎯 Reserve para casos que precisam de:
  - Middleware customizado
  - Acesso fora de componentes React
  - DevTools essenciais
  - Performance crítica com muitas atualizações

> **Regra de Ouro:** Use React nativo (Context/Hooks) primeiro. Adicione Zustand apenas quando houver necessidade comprovada.

### 🎭 Padrão Mock-First Development

Todas as features seguem o padrão Mock-First para desenvolvimento independente:

```
/features/[feature]/
  ├── data/
  │   └── mock[Feature].ts    # Mock data + helpers
  ├── hooks/
  │   └── use[Feature].tsx    # Custom hooks (mock-powered)
  ├── types/
  │   └── [feature].ts        # TypeScript types
  └── components/             # UI components
```

**Características:**

- ✅ Delays simulados (200-600ms) para UX realista
- ✅ Console logs informativos (✅/❌/🔄/👋)
- ✅ Sem persistência (dados resetam no reload)
- ✅ Helpers reutilizáveis (getMock*, mock* functions)

**Exemplos Implementados:**

- `mockAuth.ts` - 5 usuários pré-configurados
- `mockData.ts` - 4 times mock com memberships completos

## 🚀 Getting Started

### 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 🛠️ Instalação Rápida

```bash
# Clone do repositório
git clone https://github.com/Driva-tecnologia/forge.git
cd forge

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure suas variáveis
npx prisma generate
npx prisma migrate dev
npm run seed  # Cria dados iniciais + perfis de gamificação

# Frontend setup
cd ../frontend
npm install
cp .env.example .env  # Configure URL da API

# Executar em desenvolvimento
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### ⚙️ Configuração de Ambiente

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

### 🗄️ Database Setup

```bash
# Rodar migrações (inclui tabelas de gamificação)
npx prisma migrate dev

# Seed com dados de exemplo + perfis de gamificação
npm run seed

# Reset completo (se necessário)
npx prisma migrate reset
```

## 📖 Principais Funcionalidades

### 🎮 Sistema de Gamificação

1. **Dashboard de Jogador**: Perfil com XP, level, badges e progresso
2. **Sistema de Pontos**: XP automático por ações de desenvolvimento
3. **Conquistas**: Badges desbloqueados por comportamentos específicos
4. **Rankings de Equipe**: Leaderboards colaborativos focados em times
5. **Página Educativa**: Guia completo sobre XP e filosofia team-first
6. **Notificações Interativas**: Sistema completo de sino com dropdown funcional

**🎯 Filosofia Team-First:**

- Equipes em destaque no lugar de rankings individuais
- Badges colaborativos que incentivam trabalho em conjunto
- Interface redesenhada para promover colaboração
- Sistema educativo explicando benefícios da abordagem team-first

### 🏠 Homepage Inteligente

1. **Dashboard Adaptativo**: Interface personalizada por perfil de usuário
2. **Visão Individual**: Dashboard gamificado para desenvolvimento pessoal
3. **Visão de Gestor**: Seção adicional com métricas e equipe para managers
4. **Acesso Rápido**: Navegação direta para funcionalidades principais
5. **Métricas em Tempo Real**: Dados atualizados de progresso e conquistas

### 📊 PDI Modernizado

1. **Key Results Inteligentes**: 5 tipos de critérios com cálculo automático
2. **Competências Estruturadas**: 4 áreas fixas com 3 níveis cada
3. **Ciclos de Desenvolvimento**: Organização temporal por períodos
4. **Interface Colapsável**: Seções organizadas para melhor foco
5. **Timeline Aprimorada**: Histórico detalhado com atividades e marcos

### 🔐 Sistema Administrativo

1. **Gestão de Usuários**: Interface moderna com cards clicáveis
2. **Controle Hierárquico**: Configuração de relações de liderança
3. **Seleção Múltipla**: Criação de regras para várias pessoas/equipes
4. **Anti-Duplicação**: Sistema inteligente previne regras duplicadas
5. **Senhas Administrativas**: Admin pode alterar senhas de usuários
6. **Gestão de Equipes**:
   - Interface completa de CRUD para equipes
   - Visualização em duas colunas otimizada
   - Sistema de membros com papéis (Responsável/Membro)
   - Métricas integradas e ações contextuais
   - Navegação fluida com edição em página completa

## 📋 Guia de Uso

### Interface de Administração

- **Acesso**: Login como admin → `/admin`
- **Navegação**: Alt+1 (Usuários), Alt+2 (Equipes), Alt+3 (Subordinados)
- **Gestão**: Click em cards para editar perfis
- **Subordinados**: Configure relações hierárquicas centralizadamente

### Acesso ao Perfil

- **Avatar Clicável**: Clique direto no avatar (top-right) para acesso rápido ao perfil
- **Menu Dropdown**: Opção "Meu Perfil" no menu do usuário
- **URLs Diretas**: `/me` (próprio perfil) ou `/profile/:userId` (perfil de outro usuário)
- **Navegação Contextual**: Links automáticos em dashboards e listagens

### Dashboard de Manager

- **Visibilidade Total**: Todas as pessoas gerenciadas aparecem
- **Cards Interativos**: Dados em tempo real de atividades e PDI
- **Navegação Direta**: Click para acessar detalhes completos
- **Performance**: 85% mais rápido com API otimizada

### PDI e Ciclos

- **Acesso**: `/me/pdi` → Navegação por abas (PDI | Ciclos)
- **Edição**: Interface colapsável com seções inteligentes
- **Ciclos**: Ctrl+N (novo), Ctrl+Enter (salvar), Esc (fechar)
- **Auto-save**: Sincronização automática com status visual

## 🎯 Roadmap de Desenvolvimento

### Fase 2 - Features Avançadas

- 🎯 **Sistema de Desafios**: Challenges automáticos semanais/mensais
- 🏅 **Leaderboards Múltiplos**: Por equipe, departamento, especialidade
- 🤝 **Social Features**: Peer recognition, celebrações de conquistas
- 🎨 **Dark Mode**: Tema escuro seguindo design system v2.1 violet
- 🖼️ **Avatar Customization**: Editor avançado de avatares SVG
- 🎭 **Avatar Collections**: Seasonal e themed avatar packs

### Fase 3 - Integração Total

- 🔗 **Integração Git/PRs**: XP automático por atividade de código
- 📊 **Business Intelligence**: Métricas de ROI da gamificação
- 🤖 **Automação IA**: Desafios personalizados, coaching automático
- 🎮 **Command Palette**: Navegação rápida (⌘K) com design system v2.1
- 🎨 **Avatar AI Generator**: Geração automática de avatares personalizados
- 👥 **Team Avatar Themes**: Avatares coordenados por equipe

### Melhorias Técnicas Priorizadas

- **🔔 Sistema de Notificações Real**: Integração com WebSockets para notificações em tempo real
- **👥 API de Gestão de Equipes**: Endpoints completos para CRUD de teams com memberships
- Command Palette completo (Ctrl/⌘+K) com estilo violet
- Dark mode toggle seguindo tokens do design system v2.1
- Export/import de PDI com interface modernizada
- Testes automatizados E2E para componentes redesenhados
- Performance monitoring para micro-interactions
- Avatar caching e lazy loading otimizado
- Accessibility improvements para seletor de avatares
- **🔄 Sincronização Real-Time**: WebSocket para updates de equipes em tempo real

## 🛠️ Desenvolvimento e Contribuição

### Estrutura de Desenvolvimento

```bash
# Hot reload funcional para desenvolvimento ágil
cd backend && npm run start:dev
cd frontend && npm run dev

# Testes
npm test                # Backend - testes unitários
npm run test:e2e        # Backend - testes de integração
npm run test:cov        # Backend - cobertura
```

### Convenções de Código

- `import type` para diferenciar tipos
- Hooks isolam efeitos remotos e debounce
- Feature-first architecture para novos componentes
- TypeScript strict mode em todo o projeto

### APIs Principais

**Gamificação:**

- `POST /gamification/add-xp` - Adicionar XP por ação
- `GET /gamification/profile` - Perfil do jogador
- `GET /gamification/leaderboard` - Rankings de equipes (team-first)
- `GET /gamification/badges` - Sistema de badges

**PDI:**

- `GET /pdi/me` - PDI do usuário
- `PATCH /pdi/me` - Atualização parcial
- `GET /pdi/cycles/me/:cycleId` - Ciclo histórico
- `POST /pdi/cycles` - Criar novo ciclo

**Administração:**

- `GET /auth/users` - Lista de usuários
- `POST /auth/admin/create-user` - Criar usuário
- `POST /management/admin/rules` - Criar regra de liderança

## 🔒 Segurança e Qualidade

### Implementações de Segurança

- Hash bcrypt para senhas
- JWT com expiração (7 dias)
- Guards de autorização (Admin, Owner, Manager)
- Validação de dados com class-validator
- Sanitização de inputs

### Qualidade de Código

- ESLint + Prettier configurados
- TypeScript strict em todo o stack
- Logging estruturado com Pino
- Error boundaries no frontend
- Tratamento consistente de erros

## 📈 Performance e Observabilidade

### Otimizações Implementadas

- **Dashboard de Liderança**: Redução de 10s para <1s
- **Queries Bulk**: Eliminação de N+1 queries
- **Consultas Paralelas**: Promise.all para operações simultâneas
- **Memory Optimization**: Maps para lookup O(1)

### Logging e Monitoramento

- Logs estruturados com contexto de requisições
- Interceptores globais para timing e status
- BigInt serialization automática
- Tratamento específico de erros Prisma

## 🎮 Sistema de Gamificação Completo

### XP System (25+ tipos de ações)

```typescript
const XP_VALUES = {
  // PDI Actions
  pdi_milestone_completed: 100,
  pdi_competency_improved: 50,
  pdi_cycle_completed: 300,

  // Collaboration
  peer_feedback_given: 25,
  mentor_session_completed: 75,

  // Code & PRs
  pr_merged: 50,
  code_review_completed: 30,
  bug_fixed: 40,
};
```

### Badge System Automático

- **Conquistas por Milestone**: First Steps, Growth Mindset
- **Conquistas por Consistência**: Daily Streak, Weekly Warrior
- **Conquistas Sociais**: Team Player, Mentor Master
- **Conquistas Técnicas**: Code Warrior, Bug Hunter

### Leaderboard Team-First

- Rankings focados exclusivamente em equipes
- Trends visuais de progresso coletivo (↑↓→)
- Métricas de colaboração e crescimento conjunto
- Filtros por período temporal

## 💡 Próximos Itens Recomendados

### Frontend - Design System v2.1

- **🔔 API de Notificações**: Endpoints para listar, marcar como lida e configurar notificações
- **📡 WebSocket Integration**: Notificações em tempo real via WebSocket
- Command Palette com design violet para navegação rápida
- Dark mode seguindo tokens do design system v2.1
- Export/import de PDI com interface modernizada seguindo violet theme
- Indicators de sincronização granular com micro-interactions
- Lazy loading otimizado para componentes redesenhados
- Avatar editor avançado com customização SVG
- Sistema de caching inteligente para avatares
- Accessibility melhorado para seletor de avatares

### Backend

- **🔔 Sistema de Notificações**: API completa para notificações em tempo real
- **📡 WebSocket Support**: Integração para push notifications
- DTO + validation pipes para todas as APIs
- Endpoints granulares de PDI (patch por seção)
- Métricas agregadas de PR (/prs/metrics)
- Refresh token + rotação de chaves

### Qualidade

- **🔔 Testes de Notificação**: E2E tests para sistema de notificações
- Testes E2E automatizados para novos componentes v2.1
- Performance monitoring para micro-interactions
- Cache inteligente para hierarquias
- Sanitização markdown robusta
- Accessibility audit para design system violet
- Avatar performance optimization
- SVG rendering benchmarks

---

**MVP evoluído para Team-First Platform com Design System v2.4, Layout AdminDashboard Otimizado e Sistema de Notificações Completo.**

O Forge evoluiu de uma simples plataforma de PDI para uma **plataforma gamificada de gestão de times** completa, revolucionando tanto a abordagem tradicional de gamificação corporativa ao adotar uma **filosofia team-first** quanto o design visual com um **sistema v2.4 baseado em Violet**, agora incluindo um **sistema avançado de gestão de equipes com layout executivo otimizado** e **notificações em tempo real totalmente funcional**. Esta combinação única prioriza colaboração sobre competição individual enquanto oferece uma interface moderna, profissional e altamente interativa com **hierarquia visual clara, métricas integradas, navegação otimizada e espaçamentos generosos que eliminam sensação "espremida"**, criando um ambiente mais saudável, engajante e visualmente sofisticado para o desenvolvimento profissional e gestão de equipes.

---

## 📚 Documentação Técnica Detalhada

### 🔗 Integração Backend-Frontend (v2.7.0)

#### Plano de Integração Completo

- **[INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)** - Plano detalhado de integração (8 fases)

  - Setup inicial (API client + tipos)
  - Auth integration (login, registro, sessão)
  - Workspaces integration (CRUD + switch)
  - Users integration (admin system)
  - Teams integration (gestão completa)
  - Management integration (hierarquia)
  - Testing & error handling
  - Production readiness

- **[INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)** - Código pronto para implementação

  - API client base completo (Axios + interceptors)
  - Auth service refatorado (useAuth hook)
  - Users service (CRUD + paginação)
  - Teams service (CRUD + membros)
  - Management service (regras hierárquicas)
  - Toast notification system
  - Error handling patterns

- **[INTEGRATION_ROADMAP.md](./INTEGRATION_ROADMAP.md)** - Checklist visual e timeline

  - Progresso por fase (0-100%)
  - Checklist detalhado (43 tarefas)
  - Timeline de 4-5 semanas
  - Milestones e prioridades
  - Critérios de sucesso

- **[shared-types/index.ts](./shared-types/index.ts)** - Tipos TypeScript compartilhados
  - Auth types (User, Login, Register)
  - Workspace types (CRUD + Members)
  - User types (CRUD + Stats)
  - Team types (CRUD + Members)
  - Management types (Rules + Hierarchy)
  - Enum types (Roles, Status)

**Timeline Estimado:** 4-5 semanas (19-27 dias úteis)  
**Módulos:** Auth → Workspaces → Users → Teams → Management → Testing → Production

### 🏗️ Arquitetura & Padrões (v2.6.0)

#### Guias de Refatoração

- **[ARCHITECTURE_PATTERNS.md](./frontend/ARCHITECTURE_PATTERNS.md)** - Padrões consistentes entre features
  - Comparação Admin vs Auth
  - Quando usar Context API vs Hooks vs Zustand
  - Estrutura de arquivos padrão
  - Guia para futuras features

#### Auth System

- **[AUTH_REFACTORING.md](./frontend/AUTH_REFACTORING.md)** - Documentação completa do sistema de autenticação

  - Por que Context API é a escolha correta
  - Fluxo completo de autenticação
  - Mock data layer (5 usuários)
  - API do AuthProvider

- **[AUTH_TESTING_GUIDE.md](./frontend/AUTH_TESTING_GUIDE.md)** - Guia prático de testes

  - Casos de teste passo a passo
  - Suite de testes automatizados
  - Troubleshooting
  - Checklist de validação

- **[AUTH_SUMMARY.md](./frontend/AUTH_SUMMARY.md)** - Resumo executivo
  - Comparação antes/depois
  - Métricas de qualidade
  - Benefícios alcançados

#### Admin System

- **[ADMIN_MOCK_REFACTORING.md](./frontend/ADMIN_MOCK_REFACTORING.md)** - Sistema de administração
  - Hook useTeamManagement detalhado
  - Mock data expandido (4 times)
  - Componentes atualizados
  - Próximos passos

### 🎯 Quick Reference

#### Login de Teste (Mock)

```bash
# Admin + Manager
Email: diego@forge.com
Senha: qualquer coisa

# Manager
Email: maria@forge.com
Senha: qualquer coisa

# Usuário Normal
Email: ana@forge.com
Senha: qualquer coisa
```

#### Padrões de Código

```typescript
// ✅ BOM - Estado global essencial
<AuthProvider>
  <App />
</AuthProvider>;

// ✅ BOM - Estado específico de feature
const { teams, loading, createTeam } = useTeamManagement();

// ❌ EVITAR - Zustand desnecessário
// Use apenas quando Context/Hooks não são suficientes
```

#### Estrutura de Mock Data

```typescript
// /features/[feature]/data/mock[Feature].ts
export const mock[Items]: [Type][] = [...]
export function getMock[Items](): [Type][] { ... }
export function mock[Action](data): Promise<[Type]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ [Action] mock bem-sucedido')
      resolve(result)
    }, [delay]ms)
  })
}
```

### 📊 Estatísticas do Projeto

**v2.6.0 Mock-First Architecture:**

- 📝 1000+ linhas de documentação técnica
- 🔧 2 sistemas refatorados (Auth + Admin)
- 📚 5 documentos técnicos completos
- ✅ 0 erros de compilação
- 🎯 100% TypeScript

**Qualidade:**

- Context API para auth (decisão arquitetural documentada)
- React Hooks para features (simplicidade e performance)
- Mock data com delays realistas (200-600ms)
- Console logs informativos (✅/❌/🔄/👋)
- Padrões consistentes entre features

---

## 📞 Contato e Suporte

Para dúvidas técnicas ou contribuições, consulte a documentação específica de cada módulo em suas respectivas pastas ou abra uma issue no repositório.
