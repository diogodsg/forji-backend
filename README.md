# Forge

Plataforma (MVP) para acompanhar Pull Requests e evolução de Planos de Desenvolvimento Individual (PDI). Stack: **NestJS + Prisma/PostgreSQL** (backend) e **React 19 + Vite + TailwindCSS** (frontend). Inclui:

- Área do desenvolvedor (PRs e PDI próprio)
- Dashboard de manager (PRs + PDI dos subordinados)
- Área administrativa (gestão de contas, relacionamentos e permissões)

Arquitetura frontend migrou recentemente de um modelo "global components + global types" para **feature‑first** (cada domínio isola `types`, `hooks`, `components`).

## 🚀 Atualizações Mais Recentes (2025-09-29)

### ⚡ **OTIMIZAÇÃO CRÍTICA**: Manager Dashboard - De 10s para <1s

**Performance Revolucionária:**

- **Problema Resolvido**: `/management/dashboard/complete` demorava 10+ segundos
- **Causa**: N+1 queries com consultas sequenciais para cada subordinado
- **Solução**: Consultas bulk paralelas com maps para lookup O(1)

**Melhorias Implementadas:**

- **Consultas Bulk**: 3 consultas paralelas para todos os dados necessários
- **Eliminação N+1**: `findMany` com `{ id: { in: subordinateIds } }`
- **Estruturas Eficientes**: Maps para lookup rápido (`usersMap`, `teamsMap`, `pdiMap`)
- **Paralelização**: `Promise.all` para dashboard + teams simultâneos
- **Early Return**: Verificação rápida para listas vazias

**Impacto de Performance:**

| Métrica          | Antes              | Depois         | Melhoria                  |
| ---------------- | ------------------ | -------------- | ------------------------- |
| **Latência**     | ~10 segundos       | ~500ms-1s      | **90-95% redução**        |
| **Consultas DB** | 1 + 3×N queries    | 4 queries bulk | **Escalabilidade linear** |
| **Experiência**  | Múltiplos loadings | Loading único  | **UX unificada**          |

### 🎨 **REDESIGN COMPLETO**: Interface Admin com Cards

**Layout de Usuários Modernizado:**

- **Grid Responsivo**: 1 coluna (mobile) → 2 (tablet) → 3 (desktop)
- **Cards Informativos**: Avatar, nome, cargo, email e hierarquia
- **Campos Aprimorados**: Campo **cargo/posição** incluído na criação e exibição
- **Visual Hierarchy**: Badges coloridos para Admin/GitHub, informações hierárquicas organizadas
- **Hover Effects**: Transições suaves e ações contextuais

**Campo de Cargo Integrado:**

- **Modal de Criação**: Campo "Cargo/Posição" opcional no formulário
- **Backend Suportado**: DTO `AdminCreateUserDto` atualizado com `position?: string`
- **Exibição Completa**: Cargo aparece nos cards de usuários quando preenchido
- **Tipos Atualizados**: `CreateAdminUserInput` e interfaces compatíveis

### 🏗️ **CONSOLIDAÇÃO DE ENDPOINTS**: Manager Dashboard Unificado

**Eliminação de Múltiplos Loadings:**

- **Problema**: 3 chamadas de API separadas causando 2 steps de loading
- **Solução**: Novo endpoint `/management/dashboard/complete`
- **Hook Unificado**: `useManagerDashboardComplete` substitui 3 hooks diferentes
- **Dados Consolidados**: Subordinados + métricas + times em uma resposta

**Arquitetura Simplificada:**

```typescript
// ❌ ANTES (3 chamadas)
const legacy = useMyReports(); // /management/subordinates
const dashboard = useManagerDashboard(); // /management/dashboard
const allTeams = useAllTeamsWithDetails(); // /teams?details=true

// ✅ DEPOIS (1 chamada)
const complete = useManagerDashboardComplete(); // /management/dashboard/complete
```

### 🎯 **FUNCIONALIDADES APRIMORADAS**

**Colapso Flexível de Teams:**

- **Comportamento Anterior**: Forçava sempre um time aberto
- **Novo Comportamento**: Permite colapsar todos os times se desejado
- **UX Melhorada**: Usuário tem controle total sobre visualização

**Layout e Footer Corrigidos:**

- **Footer Elevado**: Problema de posicionamento resolvido com flexbox adequado
- **Layout Responsivo**: AppLayout otimizado com `flex flex-col` e `flex-1`
- **Densidade Visual**: Espaçamentos otimizados na página admin

### 🔧 **MELHORIAS TÉCNICAS DE BACKEND**

**Queries Otimizadas:**

- **Batch Loading**: Membros de múltiplas equipes em consulta única
- **Processamento Inteligente**: Separação de regras individuais vs. equipe
- **Memory Optimization**: Maps para agrupamento eficiente de dados
- **Type Safety**: Correções de BigInt vs Number casting

**Endpoints Robustos:**

- **Error Handling**: Tratamento adequado de listas vazias
- **Validation**: Parâmetros opcionais com parsing seguro
- **Performance**: Includes Prisma específicos para reduzir over-fetching

### 🎯 NOVA FUNCIONALIDADE PRINCIPAL: Sistema de Ciclos de PDI

**Interface Revolucionária com Abas Organizadas:**

- ✨ **Sistema de Ciclos Temporais** - Organize PDIs em períodos específicos com progresso automático
- 🔖 **Interface por Abas** - Navegação limpa separando Ciclos e PDI para reduzir sobrecarga visual
- ⚡ **Templates Rápidos** - Criação instantânea de ciclos (trimestres, semestres, sprints)
- 🎨 **Design Compacto** - Modais otimizados e interface mais eficiente
- 🚫 **Remoção de Duplicações** - Interface limpa sem botões redundantes

---

### �️ Sistema Administrativo Revolucionário

**Interface Admin Completamente Redesenhada:**

- **Navegação por Abas Moderna**: Interface com gradientes, animações e atalhos de teclado (Alt+1/2/3)
- **Tabs Temáticas**: Cores distintas para cada seção (Indigo/Usuários, Emerald/Equipes, Purple/Subordinados)
- **Loading States**: Transições suaves entre abas com indicadores visuais
- **Layout Padronizado**: Estrutura consistente com métricas no topo e containers glassmorphism
- **Breadcrumbs Contextuais**: Navegação clara mostrando seção ativa
- **Hover Effects**: Feedback visual aprimorado com sombras temáticas

### 🔐 Sistema de Subordinados Admin-Only

**Migração de Segurança Arquitetural:**

- **Acesso Restrito**: Gerenciamento de subordinados movido para área administrativa
- **Seletor de Usuários**: Interface para admins gerenciarem subordinados de qualquer usuário
- **Controle Centralizado**: Todas as regras hierárquicas em uma interface consolidada
- **Endpoints Protegidos**: Novos endpoints `/management/admin/*` com AdminGuard
- **Remoção de Rota**: `/management` removido da navegação geral por segurança

### 🐛 Correções Críticas de Backend

**Validação de Parâmetros Opcional:**

- **Erro Resolvido**: "Validation failed (numeric string is expected)" em `GET /management/admin/rules`
- **ParseIntPipe Opcional**: Correção da validação de query parameters opcionais
- **Tratamento de Erros**: BadRequestException apropriado para parâmetros inválidos
- **Compatibilidade**: Suporte tanto para busca específica (`?managerId=123`) quanto geral (sem parâmetros)

### �🔧 Sistema de Gerenciamento Aprimorado

**ManagementModule Totalmente Funcional:**

- **Reativado e Corrigido**: ManagementModule estava desabilitado devido a deadlocks de inicialização - agora totalmente funcional
- **Endpoint `/management/dashboard`**: Novo endpoint que retorna dados completos de subordinados (PRs + PDI + métricas)
- **Detecção Automática de Manager**: Campo `isManager` agora é calculado dinamicamente baseado em regras de gerenciamento existentes
- **Correção do Hook useMyReports**: Migrado de endpoint inexistente `/auth/my-reports` para `/management/subordinates`
- **PermissionService Integrado**: Correção da validação de acesso usando ManagementService

### 🎨 Interface de Criação de Regras Revolucionária

**Modal de Criação de Regras Completamente Redesenhado:**

- **Seleção Múltipla**: Criar regras para múltiplas equipes/usuários simultaneamente
- **Sistema Anti-Duplicação**:
  - Detecta automaticamente equipes/usuários já em regras existentes
  - Indicadores visuais (verde + "Já gerenciada/o") para itens existentes
  - Checkboxes desabilitados para prevenir duplicação
- **Busca Inteligente**: Campo de busca para filtrar equipes e usuários
- **Ações em Lote**:
  - "Selecionar Disponíveis" (só itens não duplicados)
  - "Limpar Seleção"
  - Contadores dinâmicos de disponibilidade
- **Resumo de Regras**: Painel informativo mostra regras existentes no topo do modal
- **Criação Paralela**: Múltiplas regras criadas simultaneamente com Promise.all

### 👥 Dashboard Manager Person-Centric Aprimorado

**Visibilidade Total de Pessoas Gerenciadas:**

- **Problema Resolvido**: Pessoas gerenciadas agora aparecem SEMPRE, mesmo sem organização em times
- **Nova Seção**: "Pessoas que Gerencio" com interface moderna e informativa
- **Cards Interativos**:
  - Avatar com iniciais personalizadas
  - Estatísticas de PRs com badges coloridos (merged/open/closed)
  - Status visual do PDI (existe/não existe + progresso %)
  - Click direto para página de detalhes
- **Interface Limpa**: Removido alerta redundante, foco na funcionalidade útil
- **Contexto Claro**: Subtítulo indica "Aguardando organização em times"

### �️ Gerenciamento de Subordinados Movido para Admin (2025-09-28)

**Mudança Arquitetural de Segurança:**

- **Migração Completa**: Gerenciamento de subordinados movido de `/management` para `/admin`
- **Acesso Restrito**: Apenas administradores podem configurar relações hierárquicas
- **Nova Aba Admin**: "🔗 Subordinados" integrada no painel administrativo
- **Endpoints Admin**: Novos endpoints `/management/admin/*` para operações privilegiadas
- **Segurança Aprimorada**: Admins podem gerenciar subordinados de qualquer usuário
- **Interface Consolidada**: Todas as regras do sistema visíveis em uma interface única
- **Rota Removida**: `/management` removida da navegação geral

**Benefícios de Segurança:**

- Centralização do controle hierárquico
- Prevenção de auto-atribuição de subordinados
- Auditoria completa das relações de gerenciamento
- Controle granular sobre estruturas organizacionais

### �🔄 Correções de Backend Críticas

**Problemas de Conectividade Resolvidos:**

- **Configuração de Banco**: Corrigida string de conexão para ambiente local (localhost vs remoto)
- **Endpoints Funcionais**: `/management/*` agora totalmente operacionais
- **Dados Completos**: Endpoint `/management/dashboard` retorna informações completas de subordinados
- **Performance**: Queries otimizadas para cálculo de métricas de PRs e PDI
- **Correção de Permissões**: PermissionService agora usa ManagementService para validar acesso de managers

**Novos Endpoints Implementados:**

```typescript
// Endpoints Gerais de Management
GET /management/dashboard        // Dados completos do manager (PRs + PDI + métricas)
GET /management/subordinates     // Lista subordinados efetivos
POST /management/rules           // Criar regra de gerenciamento
GET /management/rules            // Listar regras do manager atual
DELETE /management/rules/:id     // Remover regra específica

// Endpoints Admin (protegidos por AdminGuard)
POST /management/admin/rules                    // Criar regra para qualquer usuário
GET /management/admin/rules[?managerId=X]      // Listar regras específicas ou todas (corrigido)
DELETE /management/admin/rules/:id             // Remover qualquer regra
GET /management/admin/subordinates?managerId=X // Subordinados de qualquer usuário
GET /management/admin/dashboard?managerId=X    // Dashboard de qualquer manager
```

**Melhorias Técnicas:**

- **Validação Robusta**: Query parameters opcionais com parsing manual e BadRequestException
- **Circular Dependencies**: ForwardRef entre PermissionService e ManagementService
- **Type Safety**: Correção de comparações BigInt vs Number com casting apropriado
- **Dynamic Calculations**: `isManager` calculado em tempo real baseado em regras existentes
- **Optimized Queries**: Includes Prisma específicos para performance
- **Parallel Operations**: Promise.all para criação simultânea de múltiplas regras
- **Real-time Validation**: Verificação de duplicatas no frontend durante seleção
- **Modern UI Patterns**: CSS transitions, backdrop-blur, gradient shadows e animations

### 📋 Sistema PDI Revolucionário - Interface Colapsável (2025-09-28)

**Redesign Completo da Experiência PDI:**

**Seções Colapsáveis Implementadas:**

- **🎯 Key Results**: Seção totalmente colapsável com preview inteligente

  - Badge numerado com contador de objetivos
  - Preview visual dos primeiros KRs com critérios de sucesso
  - Cards com gradientes e numeração circular
  - Estado vazio informativo com call-to-action claro

- **💡 Competências & Resultados**: Seção unificada e colapsável

  - Badges coloridos para competências (verde) e avaliações (azul)
  - Layout em grid com seções distintas para cada tipo
  - Preview do conteúdo mostrando primeiras competências e níveis
  - Estados inteligentes baseados na existência de dados

- **📅 Acompanhamentos & Marcos**: Totalmente colapsável com estatísticas
  - Badge principal com contador de acompanhamentos
  - Badges secundários para tarefas (azul) e melhorias (âmbar)
  - Badge de "recentes" para marcos dos últimos 30 dias
  - Preview com cards mostrando título, data e estatísticas
  - Contador visual de tarefas e melhorias por marco

**Milestones com Subseções Colapsáveis:**

- **📝 Notas / Registro**: Área principal de markdown colapsável
- **🤖 Sugestões da IA**: Recomendações automáticas colapsáveis
- **✅ Tarefas / Próximos passos**: Lista de tasks colapsável
- **👍 Pontos Positivos**: Aspectos destacados colapsáveis
- **⚠️ Pontos de Melhoria**: Áreas para desenvolvimento colapsáveis
- **🔗 Referências**: Links e recursos externos colapsáveis

**Comportamentos Inteligentes:**

- **Estado Inicial Inteligente**: Seções abrem automaticamente se contêm dados
- **Modo Edição**: Todas as seções forçadamente abertas durante edição
- **Modo Visualização**: Seções livremente colapsáveis pelo usuário
- **Memória de Estado**: Sistema lembra preferências do usuário
- **Animações Suaves**: Transições de 300ms para melhor UX

**Design System Modernizado:**

- **Ícones React Icons**: Substituição completa de emojis por ícones profissionais

  - `FiTarget` para objetivos, `FiBarChart` para estatísticas
  - `HiLightBulb` para competências, `FiTrendingUp` para progresso
  - `FiCalendar` para datas, `FiCheckSquare` para tarefas
  - `FiClock` para tempo, `FiPlus` para adicionar, `FiTrash2` para remover

- **Paleta Temática Consistente**:

  - Indigo para KRs, Verde para competências, Azul para avaliações
  - Roxo para acompanhamentos, Âmbar para melhorias, Esmeralda para positivos

- **Componentes Visuais Aprimorados**:
  - Cards com gradientes suaves e bordas arredondadas
  - Badges numerados circulares para identificação
  - Seções coloridas para categorização visual
  - Preview informativos com estatísticas em tempo real

**Melhorias de UX:**

- **Interface mais limpa**: Seções vazias ficam colapsadas por padrão
- **Foco no conteúdo**: Usuário vê apenas o que importa
- **Navegação eficiente**: Menos scroll, mais organização
- **Edição completa**: Todos os campos acessíveis quando editando
- **Feedback visual**: Estados claros de carregamento e expansão
- **Responsividade**: Layout adapta-se a diferentes tamanhos de tela

### 📅 Sistema de Ciclos de PDI (2025-09-28)

**Gestão Temporal de Desenvolvimento:**

**Funcionalidades dos Ciclos:**

- **🗓️ Ciclos Temporais**: Organize PDIs em períodos específicos (trimestres, semestres, sprints mensais)
- **📊 Progresso Temporal**: Visualização automática de progresso baseada em datas
- **🎯 Foco Direcionado**: Cada ciclo mantém suas próprias competências, KRs e marcos
- **🔄 Transições Inteligentes**: Estados de ciclo (Planejado → Ativo → Pausado → Concluído)
- **📈 Continuidade**: Migração automática de PDI existente para ciclo padrão

**Interface de Gerenciamento:**

- **✨ Criação Rápida**: Templates predefinidos (Trimestre, Semestre, Sprint Mensal)
- **⚡ Atalhos de Teclado**: Ctrl+N (novo ciclo), Esc (fechar), Ctrl+Enter (salvar)
- **🎨 Modal Compacto**: Interface otimizada ocupando menos espaço vertical
- **🔧 Edição Completa**: Modificação de título, descrição, datas e status
- **⚠️ Confirmação de Exclusão**: Modal de confirmação com aviso de perda de dados
- **📋 Estatísticas em Tempo Real**: Visualização de competências, KRs, marcos e registros por ciclo

**Estados e Transições de Ciclo:**

```
Planejado → Ativo → Pausado ↔ Concluído
     ↓         ↓       ↓
   Ativo → Concluído  Ativo
```

**Layout Visual:**

- **📋 Cards de Ciclo**: Design moderno com badges de status coloridos
- **⏰ Progresso Temporal**: Barra de progresso baseada em tempo decorrido
- **📊 Estatísticas PDI**: Contadores visuais de elementos em cada ciclo
- **🎨 Indicadores de Status**:
  - 🟢 Ativo (Em Andamento)
  - 🔵 Planejado (Agendado)
  - 🟡 Pausado
  - ✅ Concluído
  - 🔴 Atrasado

### 🔖 Interface por Abas - Organização Limpa (2025-09-28)

**Solução para Sobrecarga de Interface:**

**Problemas Resolvidos:**

- ❌ **Dois botões "Voltar"**: Duplicação removida para navegação limpa
- ❌ **Informações misturadas**: Ciclos e PDI competindo por atenção
- ❌ **Interface sobrecarregada**: Muitos elementos na tela simultaneamente

**Nova Arquitetura com Abas:**

- **🎯 Aba PDI**: Competências, Key Results, Marcos e Registros organizados
- **📅 Aba Ciclos**: Gerenciamento completo de ciclos de desenvolvimento
- **📊 Aba Estatísticas** (extensível): Para futuras métricas e relatórios

**Benefícios da Reorganização:**

- **🧠 Foco Cognitivo**: Uma funcionalidade principal por vez
- **🎨 Visual Clean**: Menos saturação, mais clareza
- **🧭 Navegação Intuitiva**: Ícones e descrições contextuais
- **⚡ Performance**: Renderização otimizada por contexto
- **🔄 Estado Preservado**: Alterações mantidas entre abas

**Design de Abas:**

```typescript
// Estrutura das Abas
📋 PDI          → Competências, objetivos e marcos
📅 Ciclos       → Gerencie ciclos de desenvolvimento
📊 Estatísticas → Progresso e métricas (futuro)
```

**Funcionalidades Mantidas:**

- ✅ Todas as funcionalidades de PDI preservadas
- ✅ Sistema de ciclos completamente funcional
- ✅ Auto-save e sincronização entre abas
- ✅ Estados de edição mantidos
- ✅ Atalhos de teclado funcionais

## 🚀 Melhorias Anteriores (2025-09-26)

### Refatoração Completa da Interface de Administração

**Interface Modernizada com UX Aprimorada:**

- **Métricas Cards**: Das4. Planejado: impedir edição até seleção## 🚀 Dicas de Desenvolvimento

**Para Administradores:**

- **Interface Moderna**: Acesse `/admin` para usar a nova interface com navegação por abas aprimorada
- **Atalhos de Teclado**: Use Alt+1 (Usuários), Alt+2 (Equipes), Alt+3 (Subordinados) para navegação rápida
- **Gerenciamento Centralizado**: Configure relações hierárquicas de qualquer usuário na aba Subordinados
- **Seletor de Usuários**: Interface intuitiva para escolher qual usuário gerenciar
- **Layout Consistente**: Design padronizado com glassmorphism e cores temáticas por seção

**Para Managers:**

- **Dashboard Totalmente Funcional**: Veja TODAS as pessoas que você gerencia, com ou sem times
- **Interface Person-Centric**: Cards interativos com dados em tempo real de PRs e PDI
- **Acesso Direto**: Click em qualquer pessoa para gerenciar seus detalhes
- **Seleção Múltipla**: Crie regras de gerenciamento para várias pessoas/equipes de uma vez
- **Anti-Duplicação**: Sistema inteligente previne criação de regras duplicadas

**Para Usuários PDI:**

- **Interface por Abas**: Navigate entre PDI e Ciclos usando a nova interface organizada
- **Gestão de Ciclos**: Organize desenvolvimento em períodos (trimestres, semestres, sprints)
- **Templates Rápidos**: Use templates predefinidos para criar ciclos rapidamente
- **Interface Colapsável**: Navigate entre seções colapsáveis para focar no que importa
- **KRs Modernos**: Use os novos Key Results com design aprimorado e badges numerados
- **Acompanhamentos Inteligentes**: Milestones com subseções colapsáveis para melhor organização
- **Estados Inteligentes**: Seções abrem automaticamente se contêm dados, permanecem fechadas se vazias
- **Edição Eficiente**: Modo edição mantém todas as seções abertas para acesso completo
- **Navegação Visual**: Use os ícones React Icons profissionais para identificação rápida
- **Atalhos de Ciclos**: Ctrl+N (novo ciclo), Ctrl+Enter (salvar), Esc (fechar modal)

**Para Desenvolvedores:**

- Arquitetura feature-first consolidada para novos componentes
- Backend com injeção de dependências corrigida e performance otimizada
- Hot reload funcional para desenvolvimento ágil
- Sistema colapsável reutilizável via `CollapsibleSectionCard` (shared component)
- Design system consistente com paleta temática por funcionalidade

**Teste das Funcionalidades:**

- **Admin Interface**: Login como admin → `/admin` → Use Alt+1/2/3 para navegar entre abas
- **Subordinados Admin**: Aba "Subordinados" → Selecione usuário → Gerencie suas relações hierárquicas
- **PDI com Abas**: Acesse `/me/pdi` → Navigate entre abas "PDI" e "Ciclos" → Interface organizada
- **Sistema de Ciclos**: Aba "Ciclos" → Crie ciclo (Ctrl+N) → Teste templates → Edite ciclos existentes
- **PDI Colapsável**: Aba "PDI" → Teste colapso/expansão das seções → Edite e veja comportamento
- **Milestones Organizados**: Crie acompanhamentos → Teste subseções colapsáveis (Notas, Tarefas, etc.)
- **KRs Modernizados**: Adicione Key Results → Veja badges numerados e previews informativos
- **Progresso Temporal**: Crie ciclos com datas → Veja barras de progresso automáticas
- **Estados de Ciclo**: Teste transições (Planejado → Ativo → Concluído)
- **Manager Dashboard**: `/manager` mostra pessoas gerenciadas mesmo sem organização em times
- **PDI Access**: Teste acesso a PDIs de subordinados (bug 403 Forbidden resolvido)
- **Criação de Regras**: Modal com seleção múltipla e prevenção de duplicatas
- **Keyboard Navigation**: Teste atalhos Alt+1/2/3 (admin) e Ctrl+N/Enter/Esc (ciclos)

### 🔮 Próximas Funcionalidades Planejadas

**Melhorias do Sistema de Ciclos:**

- **📊 Analytics de Ciclos**: Métricas de produtividade e conclusão por período
- **🔄 Ciclos Recorrentes**: Templates automáticos para ciclos repetitivos
- **📈 Comparação de Ciclos**: Visualizar evolução entre diferentes períodos
- **🎯 Metas por Ciclo**: Objetivos quantificáveis e tracking de alcance
- **📋 Relatórios de Ciclo**: Exportação de progresso e resultados em PDF/Excel

**Melhorias de Interface e UX:**

- **📊 Aba Estatísticas**: Dashboard completo com métricas visuais de desenvolvimento
- **🔍 Busca Global**: Pesquisa unificada entre ciclos, competências e marcos
- **🏷️ Tags e Categorias**: Sistema de classificação para organização avançada
- **📱 Interface Mobile**: Otimização completa para dispositivos móveis
- **🌙 Modo Escuro**: Tema alternativo para uso prolongado

**Melhorias de Performance e Escalabilidade:**

- Implementar lazy loading na interface administrativa para grandes bases de usuários
- Cache inteligente para queries de subordinados e hierarquias
- Paginação automática nas listagens de usuários e times
- Otimização de queries de ciclos com índices temporais

**Sistema de Notificações:**

- Notificações em tempo real para mudanças de PDI e aprovações
- Dashboard de notificações para managers e administradores
- Alertas automáticos de proximidade de fim de ciclo
- Integração com webhooks para sistemas externos

**Relatórios e Analytics:**

- Dashboard executivo com métricas de desenvolvimento de equipes
- Relatórios de progresso de PDI exportáveis (PDF/Excel)
- Análise de tendências de Pull Requests por equipe/pessoa
- Comparativo de performance entre ciclos e equipes

**Integração e Automação:**

- Sincronização automática com GitHub/GitLab para dados de PR
- API webhooks para integração com sistemas de RH
- Automação de regras de gerenciamento baseadas em estrutura organizacional

### Próximos Itens Técnicos Recomendados

**Backend API:**

- Mover filtros de PR (repo/state/author) para o backend (where condicional + índices)
- Sort configurável (`sort=createdAt:desc|lines:asc`)
- DTO + validação para PDI/PRs (class-validator) para sanitizar payload antes de persistir JSON

**Frontend Avançado:**

- ✅ ~~Debounced auto-save PDI com status visual~~ (Implementado)
- ✅ ~~Sistema colapsável para PDI~~ (Implementado)
- ✅ ~~Substituição de emojis por ícones React Icons~~ (Implementado)
- Command Palette (Ctrl/⌘+K) para navegação rápida
- Dark mode toggle com persistência
- Export/import de PDI (JSON/Markdown)

**Performance e Qualidade:**

- ✅ ~~Reativação do ManagementModule~~ (Concluído)
- Testes automatizados E2E para funcionalidades críticas
- Lazy loading para grandes datasets administrativos
- Cache inteligente para hierarquias organizacionais
- **Tabela Simplificada**: Interface mais limpa com cards clicáveis para usuários
- **Filtros Avançados**: Busca por nome/email, filtro por status admin, ordenação por nome/data
- **Breadcrumb Navigation**: Navegação contextual clara
- **Quick View Modal**: Visualização rápida de detalhes do usuário com informações de hierarquia

**Melhorias de Usabilidade:**

- Cards de usuários totalmente clicáveis (removidos ícones de hover desnecessários)
- Click direto abre detalhes do usuário para edição
- Interface responsiva e moderna com TailwindCSS
- Feedback visual aprimorado para todas as ações

### Sistema de Gerenciamento de Subordinados Flexível

**Nova Arquitetura de Gestão:**

- **Regras de Gerenciamento Flexíveis**: Sistema baseado em regras individuais ou por equipe
- **ManagementRule Model**: Suporte a `TEAM` (gerenciar toda equipe) e `INDIVIDUAL` (gerenciar pessoa específica)
- **APIs RESTful**: Endpoints completos para criação, listagem e remoção de regras
- **Interface Administrativa**: Tela dedicada para configurar subordinados de forma intuitiva

**Funcionalidades Avançadas:**

- Verificação eficiente de relacionamentos hierárquicos
- Busca de subordinados efetivos (diretos + via equipe)
- Detalhamento da origem do relacionamento (individual vs. equipe)
- Sistema preparado para escalabilidade e governança empresarial

### Correções Críticas de Backend

**Problemas Resolvidos:**

- **Deadlock de Inicialização**: Corrigido problema de travamento durante boot do NestJS
- **Injeção de Dependências**: Migrado para padrão adequado do Nest.js com PrismaService
- **Campos de Perfil**: Adicionados campos `position` e `bio` na API de usuários
- **Comparação de IDs**: Corrigida inconsistência entre string/number IDs na edição de usuários
- **Compilação**: Removidas dependências problemáticas temporariamente até resolução de relações

**Melhorias de Performance:**

- API `/auth/users` otimizada com campos completos de perfil
- Queries Prisma simplificadas e eficientes
- Hot reload funcional para desenvolvimento ágil

### Tecnologias e Componentes Atualizados

**Frontend:**

- React 19 + Vite com hot reload otimizado
- TailwindCSS para design system consistente
- @headlessui/react para componentes acessíveis (modais, dropdowns)
- React Router v7 para navegação
- Arquitetura feature-first consolidada

**Backend:**

- NestJS com injeção de dependências corrigida
- Prisma ORM com schema estendido (ManagementRule, campos de perfil)
- PostgreSQL com migrações automatizadas
- JWT authentication com guards modulares
- Logging estruturado com contexto de requisições

**DevOps:**

- Docker multi-stage builds
- npm workspaces para monorepo
- TypeScript strict mode
- ESLint + Prettier configurados

### Dashboard de Manager - Refatoração Person-Centric (2025-09-26)

#### Mudanças Arquiteturais Principais

**Filosofia de Gestão Revisada:**

- **Antes**: Foco em times gerenciados → pessoas aparecem como membros de times
- **Depois**: Foco em pessoas gerenciadas → times aparecem apenas se contém pessoas gerenciadas

**Performance API Drasticamente Melhorada:**

```
Antes:  1 requisição (/teams) + N requisições (/teams/:id)
Depois: 1 requisição única (/teams?details=true)
Resultado: ~85% redução de chamadas de API
```

**Novo Endpoint Backend:**

- `GET /teams?details=true` - Retorna times completos com memberships
- Retrocompatível com `GET /teams` (sumário apenas)

#### Melhorias de UX/UI

**Header Modernizado:**

- Ícone com badge de contagem (verde: times organizados, âmbar: aguardando organização)
- Contextualização inteligente: "Gerenciando X pessoas em Y times" vs "Gerenciando X pessoas (aguardando organização em times)"
- Gradientes e micro-interações modernas

**Estados Visuais Refinados:**

- Loading sem interferência de alertas prematuros
- Alerta específico para pessoas sem times organizados com instruções detalhadas
- Distinção clara entre "Pessoas que gerencio" e "Outros membros do time"

**Navegação Aprimorada:**

- Cards clicáveis levam a páginas dedicadas (`/manager/users/:id`)
- Melhor aproveitamento de espaço comparado ao painel inline anterior

#### Limpeza Técnica Completa

**6 Arquivos Removidos (Código Morto):**

- `useAllTeams.ts`, `useMyTeams.ts`, `useDeferredLoading.ts`
- `TeamOverviewBar.tsx`, `ManagerHeader.tsx`, `ReportsSidebar.tsx`

**Impacto Mensurado:**

- ManagerDashboardPage: -6.9% bundle size (16.89kB → 15.73kB)
- ManagerUserEditPage: -9.7% bundle size (7.19kB → 6.49kB)
- Arquitetura 100% focada: apenas componentes e hooks ativamente usados

**Hook Unificado:**

```typescript
// Múltiplos hooks complexos → Hook único otimizado
const allTeams = useAllTeamsWithDetails(); // Uma call, dados completos
```

### Próximos Itens Recomendados

- Mover filtros de PR (repo/state/author) para o backend (where condicional + índices).
- Sort configurável (`sort=createdAt:desc|lines:asc`).
- Debounced auto-save PDI (PATCH incremental) com status visual (badge "Sincronizado / Pendente").
- DTO + validação para PDI/PRs (class-validator) para sanitizar payload antes de persistir JSON.
- ~~Reativação do ManagementModule com correção dos guards JWT~~ ✅ **CONCLUÍDO**
- ~~Implementação de endpoint para dados completos de manager dashboard~~ ✅ **CONCLUÍDO**
- ~~Sistema anti-duplicação para regras de gerenciamento~~ ✅ **CONCLUÍDO**

## 📋 Guia de Funcionalidades

### Interface de Administração Modernizada

- **Acesso**: Faça login com usuário admin e navegue para `/admin`
- **Métricas**: Dashboard com estatísticas em tempo real na parte superior
- **Gestão de Usuários**: Clique diretamente nos cards para abrir detalhes e editar perfis
- **Filtros**: Use a barra de busca e filtros para encontrar usuários rapidamente
- **Quick View**: Visualize hierarquias e informações detalhadas em modal

### Sistema de Gerenciamento de Subordinados (Admin Only)

- **Acesso Restrito**: `/admin` > Aba "🔗 Subordinados" (apenas administradores)
- **Controle Centralizado**: Configure relações hierárquicas para qualquer usuário
- **Seleção Múltipla**: Crie regras para várias equipes/usuários simultaneamente
- **Anti-Duplicação**: Sistema inteligente previne regras duplicadas com indicadores visuais
- **Busca Inteligente**: Filtre equipes e usuários em tempo real
- **Regras por Equipe**: Gerencie todos os membros de uma equipe automaticamente
- **Regras Individuais**: Adicione pessoas específicas como subordinados
- **Auditoria Completa**: Veja todas as regras do sistema com informações do manager responsável

### Edição de PDI e Perfis

- **Meu PDI**: Navegue para `/me/pdi` e clique em "Editar PDI" para modificar resultados
- **Perfis de Usuários**: Campos `position` e `bio` agora totalmente funcionais
- **Detalhes**: Informações completas de perfil disponíveis na edição

### Dashboard de Manager Person-Centric

- **Visibilidade Total**: Todas as pessoas gerenciadas aparecem, com ou sem organização em times
- **Seção "Pessoas que Gerencio"**: Interface moderna com cards interativos
- **Dados em Tempo Real**: PRs (merged/open/closed) e status de PDI atualizados
- **Navegação Direta**: Click em qualquer pessoa para acessar detalhes completos
- **Avatars Personalizados**: Iniciais com cores gradiente para cada pessoa
- **Foco em Pessoas**: Dashboard reorganizado para priorizar pessoas gerenciadas
- **Performance**: Carregamento 85% mais rápido com API otimizada (`/management/dashboard`)ervices`). Pastas legadas (`src/components`, `src/hooks`, `src/types`, `src/utils`) foram eliminadas ou migradas; novas implementações devem sempre residir em `src/features/<domínio>`.

## Visão Geral

### Frontend (Feature‑First)

Estrutura principal (exemplo abreviado):

```
src/features/
  pdi/
    types/pdi.ts
    hooks/... (usePdiEditing, useRemotePdi, etc)
    components/ (EditablePdiView, sections, editors, structure)
    lib/pdi.ts
  prs/
    types/pr.ts
    hooks/useRemotePrs.ts
    components/(PrList, PrDetailDrawer, PrStats, ...)
  auth/
    types/auth.ts
    hooks/useAuth.tsx
    components/LoginForm.tsx
  admin/
    types/user.ts (+ types.ts agregador)
    hooks/(useAdminUsers, useMyReports)
    components/(AdminGate, CreateUserModal, ManagerDrawer, ...)
```

Principais pontos:

- Hooks remotos: `useRemotePrs`, `useRemotePdi`, `useRemotePdiForUser`, `useMyReports`
- Estado de edição de PDI: `usePdiEditing` (reducer + ações) + `useAutoSave` (debounce / optimistic)
- Componentes de PDI segmentados em: `sections/`, `editors/`, `structure/` (responsabilidade clara)
- Navegação: React Router v7; layout base (`AppLayout`) com Sidebar; TopBar mobile
- Barrel `index.ts` em cada feature para exports públicos e isolamento interno

### Backend

1. Autenticação JWT (7d) + guards.
2. Modelos Prisma simples (User, PullRequest, PdiPlan) usando JSON para campos dinâmicos (milestones, krs, records) visando iteração rápida.
3. Permissões: acesso a PRs e PDI de subordinados apenas para managers listados ou próprio dono.

### Arquitetura Backend Atualizada (Set/2025)

Desde a refatoração recente o backend passou a ser estruturado em módulos de domínio desacoplados e serviços injetáveis:

- `PrismaModule` + `PrismaService`: provê um único client Prisma via DI (eliminado arquivo antigo `prisma.ts`). Facilita testes/mocks e centraliza lifecycle (hook `beforeExit`).
- Módulos de domínio: `AuthModule`, `PrsModule`, `PdiModule`, `TeamsModule`, além de `PermissionsModule` para regras de acesso.
- `PermissionService`: concentra lógica de "sou dono ou manager" e demais verificações, reduzindo repetição em controllers.
- Guard reutilizável `OwnerOrManagerGuard`: aplicado nas rotas que referenciam recursos de outro usuário, decide acesso (self / relação de manager) e loga allow/deny.
- `JwtAuthGuard` ajustado para usar DI de `PrismaService` (evitando import direto do client).
- Interceptores globais: `LoggingInterceptor` (tempo de execução, status, método, rota) + `BigIntSerializationInterceptor` (padroniza serialização de BigInt em JSON strings).
- Observabilidade: logs estruturados (Pino) agora também em serviços (`AuthService`, `PrsService`, `PdiService`) e no guard, com filtros, contagens e ids relevantes.
- Tratamento consistente de erros de unicidade: util `handlePrismaUniqueError` converte código `P2002` em `409 Conflict` com mensagem amigável (email, githubId).
- Removidas conversões manuais de BigInt para number em listagens de PR (delegado ao interceptor de serialização).

Benefícios principais: menor acoplamento entre controllers e infraestrutura, pontos únicos para autorização e logging, rastreabilidade das operações (cada ação relevante gera um log). Novo trabalho deve seguir o padrão: criar módulo de domínio e injetar `PrismaService` em vez de importar o client.

### Funcionalidades

- Registro / login / sessão (`/auth/*`).
- Administração: criar usuários, gerir managers, definir/remover `githubId`, promover a admin, remover usuário (PRs ficam órfãos).
- PRs: CRUD + filtro por dono (`?ownerUserId=`) + paginação server‑side.
- Dashboard usuário: PRs próprios + PDI.
- Dashboard manager: seleção de subordinado + abas PRs | PDI.
- PDI: competências, milestones (listas: melhorias, positivos, recursos, tarefas), key results, registros de evolução, sugestões (placeholder IA).
- Edição por seção independente; auto‑save com feedback visual (salvando / pendente / tudo salvo).

## Stack

Frontend

- React 19 + TypeScript (Vite)
- React Router DOM v7
- TailwindCSS + @tailwindcss/typography
- date-fns
- Vitest (testes iniciais)

Backend

- NestJS + @nestjs/jwt
- Prisma ORM + PostgreSQL (Docker)
- bcryptjs

Infra / Dev

- Docker Compose (Postgres em 5433)
- Prisma Migrations
- Script de seed (`script.sh`)

## Estrutura Atual (Resumo)

```
frontend/src/
  features/
    pdi/ ...
    prs/ ...
    auth/ ...
    admin/ ...
  pages/              -> Rotas (MyPdiPage, ManagerDashboardPage, etc.) consumindo apenas barrels de features
  layouts/            -> AppLayout, Sidebar, TopBar
  lib/                -> apiClient, helpers transversais
  mocks/              -> Dados mock (em processo de realocação gradual para dentro de cada feature)
  index.css / main.tsx

backend/
  prisma/             -> schema.prisma + migrations
  src/                -> módulos Nest (auth, prs, pdi, etc.)
  docker-compose.yml  -> Postgres
```

## Rotas Frontend

| Rota            | Descrição                                                  |
| --------------- | ---------------------------------------------------------- |
| `/` / `/me/prs` | Lista de PRs (autenticado)                                 |
| `/me/pdi`       | Página de acompanhamento do PDI                            |
| `/manager`      | Dashboard do manager (seleciona subordinado; abas PRs/PDI) |
| `/admin`        | Gestão de contas e relações (apenas para usuários admin)   |

## Endpoints Backend (principais)

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`,
  `GET /auth/my-reports`, `POST /auth/set-manager`, `POST /auth/remove-manager`

  Admin (somente admin):

  - `GET /auth/users` (lista usuários com managers/reports)
  - `POST /auth/admin/create-user` (cria usuário; aceita `isAdmin` opcional)
  - `POST /auth/admin/set-admin` (promove ou remove privilégio admin)
  - `POST /auth/admin/set-manager` (define um manager para um usuário)
  - `POST /auth/admin/remove-manager` (remove relação de manager)
  - `POST /auth/admin/set-github-id` (define ou remove githubId de um usuário; 409 em caso de duplicidade)
  - `POST /auth/admin/delete-user` (remove usuário; PRs ficam órfãos; PDI removido; relações gerenciais desconectadas)

- PRs (JWT): `GET /prs` (aceita `?ownerUserId=` com checagem de permissão), `GET /prs/:id`, `POST /prs`, `PUT /prs/:id`, `DELETE /prs/:id`
- PDI (JWT):
  - `GET /pdi/me` (404 se não existir)
  - `POST /pdi` (cria/substitui plano do usuário logado)
  - `PATCH /pdi/me` (atualização parcial)
  - `GET /pdi/:userId`, `PUT /pdi/:userId`, `DELETE /pdi/:userId` (somente dono ou manager)
- Teams (JWT):
  - `GET /teams` (lista sumário de times com contadores)
  - `GET /teams?details=true` (lista completa com memberships - otimizado para manager dashboard)
  - `GET /teams/mine` (times onde sou manager)
  - `GET /teams/:id` (detalhes de um time específico)
  - `POST /teams`, `PUT /teams/:id`, `DELETE /teams/:id` (CRUD - admin)

Permissões

- PRs filtrados por `ownerUserId` e PDI de outro usuário só podem ser acessados pelo próprio dono ou por alguém que esteja listado como seu manager.

Administração

- Campo `isAdmin` no modelo de usuário (Prisma) habilita acesso administrativo.
- Campo opcional `githubId` (login do GitHub) permite vincular automaticamente PRs importados: se o campo `user` do payload do PR (login GitHub) casar com `githubId` de um usuário, o `ownerUserId` é preenchido automaticamente.
- O primeiro usuário registrado no sistema é promovido automaticamente a admin.
- A página `/admin` permite criar contas e gerenciar relações de gestão.
- Atalho de teclado: `g` seguido de `a` navega para a página de administração (se o usuário for admin).
- Erros de unicidade (email ou githubId) retornam 409 com mensagem amigável.

## Tipagens

Agora vivem dentro de cada feature (`features/<domínio>/types/*.ts`). Exemplos: `features/prs/types/pr.ts`, `features/pdi/types/pdi.ts`, `features/admin/types/user.ts`.

Diretriz: nunca criar novo arquivo em `src/types`. Use o escopo da feature ou uma pasta `shared/` futura (ainda não necessária).

## Mocks

- `mockPrs` em `src/mocks/prs.ts`
- `mockPdi` em `src/mocks/pdi.ts`

Para adicionar mais PRs basta inserir novos objetos no array `mockPrs` respeitando a interface `PullRequest`.

## Componentes Chave (Exemplos)

**PDI (Sistema Colapsável Completo):**

- `EditablePdiView` - Orquestração principal com seções colapsáveis
- `CollapsibleSectionCard` - Componente base para seções colapsáveis (shared)
- `MilestonesSection` - Acompanhamentos com preview e estatísticas
- `MilestoneCard` - Cards individuais com subseções colapsáveis
- `KeyResultsEditor`/`KeyResultsView` - KRs com design modernizado
- `CompetenciesAndResultsSection` - Seção unificada colapsável
- `SaveStatusBar` - Indicador de sincronização

**PRs:**

- `PrList`, `PrDetailDrawer`, `PrStats`, `ProgressCharts`, `SummaryCards`

**Admin:**

- `AdminUserRow`, `ManagerDrawer`, `CreateUserModal`, `AdminGate`

**Auth:**

- `LoginForm`

## Decisões de Design / UI

**Layout e Navegação:**

- Light mode padrão; paleta `surface` minimalista
- Sidebar persistente desktop; TopBar só em mobile
- Redução de excesso de cores nas métricas (cards neutros com pontos de cor)
- PR stats com distribuição de linhas adicionadas/deletadas (barra empilhada)

**Sistema PDI Colapsável:**

- Interface colapsável para todas as seções principais (KRs, Competências, Acompanhamentos)
- Estado inicial inteligente: seções abrem automaticamente se contêm dados
- Modo edição força todas as seções abertas; modo visualização permite colapso livre
- Animações suaves de 300ms para transições de expansão/colapso
- Preview informativos com estatísticas em tempo real para seções colapsadas
- Milestones com subseções colapsáveis (Notas, Sugestões, Tarefas, Pontos Positivos/Melhoria, Referências)

**Design System:**

- Substituição completa de emojis por ícones `react-icons` profissionais
- Paleta temática consistente: Indigo (KRs), Verde (competências), Azul (avaliações), Roxo (acompanhamentos)
- Cards com gradientes suaves e bordas arredondadas
- Badges numerados circulares para identificação visual
- Componente `CollapsibleSectionCard` reutilizável para consistência

**Backend e Persistência:**

- AuthContext gerencia token + user
- PDI persiste no backend; UI desativou localStorage para PDI
- Debounced auto-save para melhor performance

**Área Administrativa:**

- Emojis removidos de ações/tabelas; padronizado com `react-icons`
- Cabeçalhos da tabela de equipes sem ícones (texto simples para legibilidade)
- Picker de gerentes via portal fixo no `document.body` (evita scrollbars indesejados)
- Botão de alternar admin desativado para o próprio usuário logado (prevenção de auto-remoção)

## Próximos Passos Sugeridos

Backend/API

1. DTO + validation pipes (auth, prs, pdi)
2. Endpoints granulares de PDI (patch por bloco/milestone)
3. `/prs/metrics` agregadas (tempo merge, churn, distribuição estados)
4. (Concluído) Observabilidade básica: logging estruturado + request id + logs de domínio
5. Métricas de desempenho simples (latências agregadas /p95) via sumarização de logs (futuro)

Frontend 6. Command Palette (Ctrl/⌘+K) 7. Dark mode toggle 8. Persistência de checklist / notas de review de PR 9. Export / import de PDI (JSON / Markdown) 10. Indicators de sincronização por seção (granular)

Qualidade / Segurança 11. Testes E2E (Nest + frontend smoke) 12. Refresh token + revogação 13. Sanitização markdown robusta

## Como Rodar (Full Stack)

Pré-requisitos: Node 20+.

### Backend

Pré-requisitos: Docker / Node 20+

Subir Postgres:

```bash
cd backend
docker compose up -d
```

Configurar `.env` (exemplo):

```
DATABASE_URL="postgresql://forge_user:forge_pass@localhost:5433/forge_db"
JWT_SECRET="dev_jwt_secret"
```

Instalar dependências e aplicar migrações:

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

Seed de dados (mock completo + reset de banco):

```bash
# do diretório raiz do projeto
bash script.sh
```

O script irá:

- Subir o Postgres (via Docker) se necessário e aguardar disponibilidade
- Resetar o schema via Prisma (ou via SQL com docker em fallback)
- Aguardar a API ficar pronta antes de disparar requests
- Criar o admin (primeiro usuário) e obter token
- Criar usuários (manager + 2 devs) via endpoint admin e vincular relações
- Popular PRs variados (open/merged/closed) em frontend/backend
- Criar um PDI completo para cada dev

### Frontend

Instalação e dev:

```bash
cd frontend
npm install
npm run dev
```

Build produção:

```bash
cd frontend
npm run build
npm run preview
```

## Convenções de Código

- `import type` para diferenciar tipos.
- Reducer centraliza mutações de PDI; evitar state derivado duplicado.
- Hooks isolam efeitos remotos e debounce.
- Extração de componentes de layout/estrutura em `pdi/*` reduz acoplamento.

## Adicionando Novos PRs (Mock / Durante Transição)

```ts
mockPrs.push({
  id: "ID_UNICO",
  author: "dev",
  repo: "repo-name",
  title: "Título do PR",
  created_at: new Date().toISOString(),
  state: "open",
  lines_added: 0,
  lines_deleted: 0,
  files_changed: 0,
  ai_review_summary:
    "Resumo Geral\n\nPontos fortes:\n...\nPontos fracos/risco:\n...",
  review_comments_highlight: ["Item 1", "Item 2"],
});
```

### Exemplo de Payload de Criação/Atualização de PR (API)

Campos snake_case são mapeados internamente para camelCase; datas terminadas em `_at` são convertidas para Date:

```json
{
  "id": 987654321,
  "repo": "org/repo",
  "number": 42,
  "title": "Improve performance of X",
  "state": "open",
  "user": "github-login",
  "created_at": "2025-09-13T10:15:00Z",
  "updated_at": "2025-09-13T10:20:00Z",
  "total_additions": 120,
  "total_deletions": 30,
  "total_changes": 150,
  "files_changed": 8
}
```

Se `ownerUserId` não for enviado e `user` corresponder ao `githubId` de um usuário, o vínculo é atribuído automaticamente.

## Ajustando Tema

Arquivo: `tailwind.config.js`

- Paleta clara atual em `surface`.
- Para reativar dark mode: criar variantes e togglar classe `dark` no `<html>`.

## Persistência Local

O PDI passou a persistir no backend. O uso de `localStorage` foi desativado na tela de PDI para evitar conflito com o estado remoto.

## Limitações Atuais

- PDI salvo como blob único (PUT/PATCH) – falta granularidade.
- Checklist / review notes de PR não persiste.
- Falta DTO/validation pipes (payloads PR/PDI aceitam `any`).
- Sem refresh token / rotação de chave JWT.
- Sanitização markdown mínima.
- Métricas agregadas de PR ausentes.
- Sugestões de PDI ainda placeholder (IA).

## Qualidade / Build / Testes

- Frontend: `npm run build` / `npm run dev`
- Backend: `npm run start:dev`
- Testes atuais concentrados em reducer de PDI; utilidades migradas para `features/pdi/lib`
- Planejar: testes de hooks remotos (mock fetch), auto‑save com timers, edge cases de milestones
- ESLint + TS estritos (`strict`, `noUnusedLocals`)

## Segurança

- Hash bcrypt para senhas (backend)
- JWT simples (7d) sem refresh; renovar estratégia depois
- Sanitização limitada (inputs ainda não validados por DTO)

* Entrada de usuário limitada a campos de texto simples; markdown ainda é ingênuo (baixa superfície de XSS). Revisar sanitização ao adotar parser real.

## Contato / Handoff

Próximo agente deve:

1. Configurar backend (.env + docker compose up) e rodar migrações
2. Criar usuário via /auth/register (curl ou frontend) e validar /auth/me
3. Criar/atualizar PRs (POST /prs) e verificar listagem no frontend
4. Escolher item da lista "Possíveis Próximos Passos" (priorizar DTO + filtros) e implementar

---

MVP pronto para extensão.

## Mudanças Recentes (Resumo)

- Administração
  - Modal de criação de usuário reestruturado (grid responsivo, overlay corrigido).
  - Tabela simplificada (Usuário | Permissões | Gerentes) com header fixo e gerência inline.
  - Atribuição de manager via menu/botão “+ Adicionar gerente”; nomes longos com truncamento e tooltip.
  - Erro de e-mail duplicado tratado como 409 (mensagem amigável no frontend).
- Navegação e páginas
  - Sidebar renovada com ícones (react-icons), visual mais consistente e logout destacado.
  - Páginas de PRs e PDI com iconografia e tabelas/cartões refinados.
- PDI
  - Seção “Resultado” agora totalmente editável: nível antes/depois, evidências, adicionar/remover linhas.
  - Adição rápida a partir de competências existentes ou criação manual de nova área.
- Admin / GitHub
  - Adicionados campo `githubId` ao usuário e edição inline na página `/admin`.
  - Vinculação automática de PRs pelo login GitHub (`user` do PR -> `githubId` do usuário) quando `ownerUserId` não for enviado.
  - Ação de remoção de usuário (soft para PRs: apenas anula ownerUserId) disponível na UI admin.

### Dashboard de Manager (Atualizações 2025-09-14)

| Alteração               | Antes                                                                      | Depois                                                    | Benefício                                         |
| ----------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| Métricas de topo        | 3 cards separados (Subordinados / PRs / PDIs) ocupando altura considerável | Barra horizontal única `TeamOverviewBar`                  | Menor consumo vertical, leitura sequencial rápida |
| Detalhes de subordinado | Drawer lateral sobreposto                                                  | Painel em fluxo (inline) abaixo da grade                  | Menos compressão lateral, contexto preservado     |
| KPI card / tab          | Exibido (sem dados maduros)                                                | Removido                                                  | Redução de ruído visual                           |
| Componentes legados     | `ManagerMetricCards`, `ReportDrawer`                                       | Removidos do codebase                                     | Simplificação e menor bundle                      |
| Estado loading          | Traço ou conteúdo “saltando” rapidamente                                   | Skeletons com atraso mínimo (`useDeferredLoading`) + fade | Percepção de fluidez, ausência de flicker         |

### Admin (Atualizações 2025-09-24)

- Removidos ícones dos cabeçalhos de colunas nas tabelas (ex.: Equipes) para reduzir ruído visual.
- Substituídos emojis por ícones do `react-icons` em ações (ex.: remoção de usuário).
- Corrigido comportamento do seletor de Gerentes: agora é renderizado em portal com posicionamento absoluto relativo à âncora, evitando ativação de scroll horizontal/vertical no container da tabela.
- Prevenido auto‑remoção de privilégios: o admin logado não pode remover seu próprio acesso admin (toggle desativado na própria linha).

#### Novo Componente: `TeamOverviewBar`

Características:

- Estrutura compacta (título + 3 métricas linearizadas com separadores sutis `|` / `•`).
- Não fixa (rola com o conteúdo para não competir com o header global futuro).
- Sem interatividade; foco em leitura imediata.
- Tipografia reduzida com `tabular-nums` nos valores para estabilidade visual.

#### Skeleton & Carregamento Diferido

Implementado hook `useDeferredLoading(delay=~120ms, minVisible=~300ms)` que:

1. Só exibe skeleton se a requisição ultrapassar o delay (evita “flash”).
2. Mantém skeleton tempo mínimo para evitar troca abrupta.
3. Aplica fade de opacidade ao transicionar lista de cards (0.55 ➜ 1).

Skeletons criados:

- `TeamOverviewBar` placeholders (blocos curtos de valor + label).
- `ReportCardSkeleton`: avatar circular neutro, linhas de texto, badges opacas e barra de progresso parcial.

#### Limpeza de Código

- Removidos arquivos: `ManagerMetricCards.tsx`, `ReportDrawer.tsx`.
- Exports eliminados do barrel `features/manager/index.ts` para prevenir import acidental.
- Build verificado pós-removal (nenhum consumidor quebrado).

#### Evoluções Futuras (Sugestões)

- Deep link para subordinado e aba (`/manager?user=<id>&tab=pdi`).
- Lazy load do painel de detalhes (code splitting) quando usuário é selecionado.
- Indicadores de atualização em background (ex.: pequena animação de progress bar sob a barra de overview).
- Métricas agregadas adicionais (lead time médio, throughput semanal) quando endpoint consolidado estiver pronto.

> **Nota (2025-09-26)**: `TeamOverviewBar` e `useDeferredLoading` foram removidos durante refatoração person-centric. Ver seção "Dashboard de Manager - Refatoração Person-Centric" para detalhes da nova implementação.

### Novidades Técnicas

- PRs: Paginação server-side (`GET /prs?page=1&pageSize=20`) retornando `{ items, total, page, pageSize }` e frontend ajustado para usar `serverPaginated` em `PrList`.
- PRs: Filtro inclusivo para PDI / visão de subordinado: quando `ownerUserId` é enviado, a busca inclui PRs cujo `ownerUserId` seja o usuário OU cujo login GitHub (`user`) case com `githubId` do usuário.
- PRs: Hook `useRemotePrs` agora envia page/pageSize e processa resposta paginada.
- PDI: Salvamento otimista no `EditablePdiView` com rollback em caso de falha (antes ficava sem feedback). Fallback POST quando PATCH retorna 404.
- PDI: Edição via manager usa `saveForUserId` (PUT `/pdi/:userId`). Garantir que o manager selecione explicitamente o subordinado correto antes de editar.
- Admin: Removidos imports React obsoletos para build mais limpo (React 19 JSX transform).
- Infra: Ajustes menores de tipagem e prevenção de BigInt vs number em filtros de PRs.
- Backend: Modularização (PrismaModule + módulos de domínio) concluída; guard `OwnerOrManagerGuard` substitui verificações manuais; introduzido `LoggingInterceptor` e logs de serviço; util de erro único Prisma para respostas 409 consistentes; remoção de client Prisma direto de arquivos de domínio.

### Atualizações PDI (2025-09-14)

#### UX de Resultados / Competências

- Editor de Resultados redesenhado em cards: cada competência agora tem um bloco com título, seleção de nível Antes / Depois (0–5), barra de evolução com gradiente mostrando progresso e delta textual (+N / Sem mudança / regressão).
- Valores não definidos exibem traço "—" ao invés de forçar 0; barra só aparece quando há pelo menos um lado definido.
- Botão Limpar explícito para remover nível (removido comportamento implícito de clique para limpar que causava confusão).
- Acessibilidade: navegação por teclado (Arrow Left/Right, Home/End, Delete/Backspace/Space para limpar) via radiogroup; foco visível; mensagens úteis para leitores de tela.
- Área de evidências estilizada, placeholder claro incentivando exemplos.
- Novo componente de adição (AddResultBar): sugestões filtradas conforme digitação, chips rápidos (até 10 disponíveis), detecção de duplicado com feedback visual e aria-live para sucesso/erro.
- Destaque visual temporário (pulse + borda verde) no card recém-adicionado para reforçar feedback.

#### Autosave & Merge

- Introduzido campo local `lastEditedAt` (apenas no frontend) em cada record para evitar que respostas de PATCH atrasadas revertam mudanças recentes.
- Estratégia `mergeServerPlan` compara timestamps por record quando a seção de resultados está em edição e preserva o valor mais recente local.
- Sanitização antes do envio: `lastEditedAt` removido no hook `useAutoSave` para evitar `400 Bad Request` devido ao `ValidationPipe (forbidNonWhitelisted)` no backend.

#### Validação / Backend

- O erro 400 identificado vinha do envio de campos extras (`lastEditedAt`) não presentes em `PdiCompetencyRecordDto` (whitelist + forbidNonWhitelisted). Ajuste feito no frontend; alternativa futura seria estender DTO ou desativar `forbidNonWhitelisted` (não recomendado agora).

#### Próximas Melhorias Potenciais

- Persistir `lastEditedAt` no backend (opcional) para auditoria e merge mais robusto colaborativo.
- Animação de scroll automática para card recém-adicionado (foco acessível).
- Chips de evidência (parse de linhas prefixadas com `- `) com remoção individual.
- Undo rápido para remoção de competência (toast com timeout).
- Diff visual quando houver regressão (ex: cor âmbar na barra parcial regressiva).

#### Testes Recomendados (a adicionar)

- Caso de merge: servidor retorna valor antigo após alteração local -> garantir que merge mantém local.
- Sanitização: função que prepara payload remove `lastEditedAt` e outros campos desconhecidos.
- Acessibilidade: snapshot de roles/ARIA nos botões de nível.

## 🧪 Testes e Validação

### Backend Tests

Para executar os testes do backend:

```bash
cd backend
npm test                # Testes unitários
npm run test:e2e        # Testes de integração
npm run test:cov        # Cobertura de código
```

**Casos de Teste Implementados:**

- Criação de regras de gerenciamento (`management.service.test.ts`)
- Cálculo dinâmico de subordinados
- Autenticação e autorização
- Queries complexas com Prisma

### Testando Funcionalidades Novas (2025-09-28)

**Sistema de Gerenciamento:**

```bash
# 1. Testar criação de múltiplas regras
POST /management/rules
Body: { personIds: [1,2], teamIds: [3] }

# 2. Verificar dashboard do manager
GET /management/dashboard
# Deve retornar: subordinados + PRs + PDI stats

# 3. Testar anti-duplicação
# Tentar criar regra já existente - deve falhar graciosamente
```

**Frontend Multi-Select:**

- Abrir modal "Adicionar Regra"
- Selecionar múltiplas pessoas/equipes
- Verificar que duplicatas não aparecem na lista
- Confirmar criação em lote (Promise.all)

**Validação Completa:**

```bash
# 1. Setup inicial
bash script.sh  # Popula dados completos

# 2. Login como admin
POST /auth/login { "username": "admin", "password": "admin123" }

# 3. Criar manager e devs via admin panel
# 4. Testar fluxo completo de gerenciamento
# 5. Validar dashboard com dados reais
```

### Frontend Refactor (Feature PRs & Shared Layer)

- Introduzida pasta `frontend/src/shared` contendo apenas componentes verdadeiramente genéricos (layout / UI atômica): `PaginationFooter`, `StatCard`, `LinesDeltaCard`, `SidePanel`, `Badge`.
- Removido código morto: componentes antigos `ProgressCharts` e `SummaryCards` (ficarão para futura reimplementação quando endpoint de métricas existir).
- Extraídas partes reutilizáveis da feature de PRs (paginação, cards, painel lateral) para reduzir duplicação futura entre PRs, PDI e Admin.
- Criado util de status específico de PR em `features/prs/lib/status.ts` (antes estava incorretamente em `shared/lib`). Mantém `shared` neutro de domínio.
- Padronizados imports via barrels (`@/shared`, `@/features/prs`).
- Adicionado `Badge` genérica com helper `semanticStatusBadge` para mapear estados sem acoplar lógica de PR.
- Documentação TSDoc mínima aplicada aos componentes compartilhados (foco em responsabilidade e props principais).

### Fluxo de Paginação de PRs

Requisição:

```
GET /prs?page=2&pageSize=50
Authorization: Bearer <token>
```

Opcional `ownerUserId` para filtrar subordinado (aplica checagem de permissão). Retorno:

```json
{
  "items": [
    {
      /* PullRequest */
    }
  ],
  "total": 137,
  "page": 2,
  "pageSize": 50
}
```

Limites: `page >= 1`, `pageSize` máximo 200 (valores maiores são normalizados para 200).

### Fluxo de Persistência de PDI

Self:

- PATCH `/pdi/me` para atualizações parciais.
- POST `/pdi` faz upsert: cria se inexistente ou substitui campos informados.

Manager editando subordinado:

- PUT `/pdi/:userId` (substitui blob completo). UI envia apenas campos atuais.

Estratégia atual: enviar o blob completo (milestones/KRs/records). Futuro: endpoints granulares (ex.: `PATCH /pdi/:userId/milestones/:id`).

### Observações sobre Edição de PDI via Manager

Se notar que ao editar está modificando o próprio PDI do manager:

1. Verifique se um subordinado foi realmente selecionado (estado `currentId`).
2. Confirme a URL da requisição (`PUT /pdi/<idDoReport>`).
3. Garanta que a lista de reports não inclui o próprio manager.
4. Planejado: impedir edição até seleção explícita (todo).

### Próximos Itens Recomendados

- Mover filtros de PR (repo/state/author) para o backend (where condicional + índices).
- Sort configurável (`sort=createdAt:desc|lines:asc`).
- Debounced auto-save PDI (PATCH incremental) com status visual (badge “Sincronizado / Pendente”).
- DTO + validação para PDI/PRs (class-validator) para sanitizar payload antes de persistir JSON.

Dicas rápidas

- Para testar administração, faça login com um usuário admin e abra `/admin`.
- Na página Meu PDI (`/me/pdi`), clique em “Editar PDI” para habilitar a edição da seção “Resultado”. Salve para persistir no backend.
