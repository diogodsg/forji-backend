# Forge Design System

Status: Implementado — sistema visual unificado seguindo padrões reais da aplicação Meu PDI.

## Princípios

1. **Clareza primeiro**: Tipografia legível, hierarquia visual clara.
2. **Leve e rápido**: Poucas dependências, baseado em Tailwind CSS.
3. **Extensível**: Tokens centralizados para futura expansão (dark mode, temas).
4. **Acessível por padrão**: Contraste mínimo AA, estados de foco visíveis.
5. **Consistente**: Design system implementado em toda aplicação.

## Tokens

### Cores

Fonte: `tailwind.config.js` (extend.colors)

**Core Brand Colors:**
| Token | Valor | Uso |
| ------------------ | --------- | -------------------------- |
| `brand.DEFAULT` | `#6366f1` | Ações primárias, ênfase |
| `brand.foreground` | `#ffffff` | Texto sobre brand |
| `brand.50` | `#eef2ff` | Backgrounds muito suaves |
| `brand.100` | `#e0e7ff` | Hover states, highlights |
| `brand.900` | `#312e81` | Dark mode, text emphasis |

**Surface System:**
| Token | Valor | Uso |
| ------------------ | --------- | -------------------------- |
| `surface.0` | `#ffffff` | Fundo puro (cards, modais) |
| `surface.50` | `#fafbfc` | Elevated surfaces |
| `surface.100` | `#f8fafc` | Fundo da aplicação |
| `surface.200` | `#eef2f6` | Realces suaves / hovers |
| `surface.300` | `#e2e8f0` | Bordas e divisores |
| `surface.400` | `#cbd5e1` | Inactive elements |

**Semantic Colors:**
| Token | Valor | Uso |
| ------------------ | --------- | -------------------------- |
| `success.500` | `#10b981` | Success states, confirmações |
| `success.50` | `#ecfdf5` | Success backgrounds |
| `warning.500` | `#f59e0b` | Warnings, atenção |
| `warning.50` | `#fffbeb` | Warning backgrounds |
| `error.500` | `#ef4444` | Errors, ações destrutivas |
| `error.50` | `#fef2f2` | Error backgrounds |

**Gradiente Brand Principal:** `from-indigo-600 via-sky-500 to-indigo-400`  
Aplicado em: botões ativos, elementos de destaque, progresso, avatars.

**Novos Gradientes:**

- **Success:** `from-emerald-500 to-teal-500`
- **Warning:** `from-amber-500 to-orange-500`
- **Neutral:** `from-slate-600 to-slate-700`

### Backgrounds

| Classe           | Uso                              |
| ---------------- | -------------------------------- |
| `bg-[#f8fafc]`   | Fundo principal das páginas      |
| `bg-surface-0`   | Cards, painéis, sidebar          |
| `bg-surface-100` | Seções secundárias, inputs hover |
| `bg-surface-200` | Estados hover, divisões          |

**Background Pattern Principal:**

```css
bg-[radial-gradient(circle_at_12%_18%,#dbe4ff_0%,#e5ecff_35%,#f1f5ff_55%,#f8fafc_70%)]
```

### Tipografia

**Família Recomendada:** `Geist, Inter, system-ui, sans-serif`

**Hierarquia Refinada:**

| Escala             | Tailwind Class                          | Uso                          | Peso |
| ------------------ | --------------------------------------- | ---------------------------- | ---- |
| **Display Large**  | `text-5xl font-bold tracking-tight`     | Hero sections, landing pages | 700  |
| **Display Medium** | `text-4xl font-bold tracking-tight`     | Page titles, major sections  | 700  |
| **Heading Large**  | `text-3xl font-semibold tracking-tight` | Main headings                | 600  |
| **Heading Medium** | `text-2xl font-semibold tracking-tight` | Section headings             | 600  |
| **Heading Small**  | `text-xl font-semibold`                 | Component headers            | 600  |
| **Subheading**     | `text-lg font-medium`                   | Subsections, metric labels   | 500  |
| **Body Large**     | `text-base font-normal`                 | Primary reading text         | 400  |
| **Body Medium**    | `text-sm font-normal`                   | Secondary text, descriptions | 400  |
| **Body Small**     | `text-xs font-medium`                   | Labels, captions, metadata   | 500  |
| **Caption**        | `text-[10px] font-medium tracking-wide` | Fine print, timestamps       | 500  |

**Números Tabulares:** Usar `font-mono` ou `tabular-nums` para métricas e dashboards.

**Brand Typography:**

- Logo: `text-2xl font-bold bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 bg-clip-text text-transparent`
- Aplicar `tracking-tight` em headings para melhor densidade visual

### Espaçamento

**Base 4px** (escala Tailwind). Padrões principais da aplicação:

| Contexto             | Classes                         |
| -------------------- | ------------------------------- |
| **Página Container** | `p-6`                           |
| **Card Padding**     | `p-4` (pequeno), `p-6` (padrão) |
| **Section Spacing**  | `space-y-6`, `space-y-8`        |
| **Component Gaps**   | `gap-3`, `gap-4`, `gap-6`       |
| **Header Spacing**   | `pb-6` (após headers)           |

### Borda / Radius / Elevação

| Token         | Valor   | Uso                        |
| ------------- | ------- | -------------------------- |
| `rounded`     | 0.25rem | Elementos pequenos         |
| `rounded-lg`  | 0.5rem  | Cards padrão               |
| `rounded-xl`  | 1rem    | Cards de destaque, avatars |
| `rounded-2xl` | 1.5rem  | Sections principais        |

**Sombras:**

- `shadow-sm`: Cards padrão
- `shadow-md`: Hover states, avatars
- `shadow-lg`: Elementos de destaque
- `shadow-xl`: Componentes elevados (sidebar)

**Bordas:** `border-surface-300` padrão | `border-surface-200` em cards ativos

### Estados de Interação

**Foco:** `focus:ring-2 focus:ring-indigo-400 focus:outline-none` em inputs e botões.

### Ícones

**Biblioteca:** React Icons - Lucide Icons (`lucide-react`) + Feather Icons fallback

**Por que Lucide?**

- ✅ Mais consistente e moderno que Feather
- ✅ Melhor otimização para tree-shaking
- ✅ Ícones mais refinados e atualizados
- ✅ Suporte a variações de peso

**Tamanhos Padronizados:**

| Tamanho     | Classes     | Uso                          | Contexto             |
| ----------- | ----------- | ---------------------------- | -------------------- |
| **Micro**   | `w-3 h-3`   | Badges, status indicators    | Inline elements      |
| **Small**   | `w-4 h-4`   | Botões, inputs, navegação    | UI controls          |
| **Default** | `w-5 h-5`   | Navegação principal, headers | Primary actions      |
| **Medium**  | `w-6 h-6`   | Cards de métricas, features  | Content emphasis     |
| **Large**   | `w-8 h-8`   | Avatars, hero sections       | Visual hierarchy     |
| **XLarge**  | `w-12 h-12` | Empty states, illustrations  | Strong visual impact |

**Ícones Principais da Aplicação:**

| Categoria      | Ícones                                   | Uso                         |
| -------------- | ---------------------------------------- | --------------------------- |
| **Navigation** | `Home`, `Target`, `Users`, `TrendingUp`  | Sidebar, menu principal     |
| **Actions**    | `Plus`, `Edit`, `Trash2`, `Save`         | CRUD operations             |
| **Status**     | `Check`, `X`, `AlertTriangle`, `Info`    | Feedback, notifications     |
| **Data**       | `BarChart3`, `PieChart`, `LineChart`     | Analytics, dashboards       |
| **User**       | `User`, `UserPlus`, `Settings`, `LogOut` | Profile, account management |
| **Growth**     | `Award`, `Star`, `Zap`, `Flame`          | Gamification, achievements  |

**Estados dos Ícones:**

| Estado       | Classes            | Uso                      |
| ------------ | ------------------ | ------------------------ |
| **Inactive** | `text-gray-400`    | Disabled, secondary      |
| **Default**  | `text-gray-600`    | Normal state             |
| **Active**   | `text-brand-600`   | Selected, current        |
| **On Brand** | `text-white`       | Over colored backgrounds |
| **Success**  | `text-success-600` | Positive actions         |
| **Warning**  | `text-warning-600` | Caution states           |
| **Error**    | `text-error-600`   | Destructive actions      |

**Micro-animações para Ícones:**

```css
/* Hover grow */
.icon-hover {
  @apply hover:scale-110 transition-transform duration-150;
}

/* Pulse for notifications */
.icon-pulse {
  @apply animate-pulse;
}

/* Spin for loading */
.icon-spin {
  @apply animate-spin;
}

/* Bounce for interactions */
.icon-bounce {
  @apply hover:animate-bounce;
}
```

## Componentes

### Estruturas Base

#### Page Layout

**Padrão Meu PDI:**

```tsx
<div className="min-h-full w-full bg-[#f8fafc] p-6 space-y-6">
  <header className="pb-6">{/* Header com ícone + título */}</header>
  {/* Conteúdo */}
</div>
```

#### Page Header

**Estrutura:**

```tsx
<div className="flex items-center gap-3">
  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
    <Icon className="w-5 h-5 text-white" />
  </div>
  <div>
    <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
      Título
    </h1>
    <p className="text-xs text-gray-500">Descrição</p>
  </div>
</div>
```

### Cards

#### Card Base

**Estrutura Padrão:**

```css
bg-white border border-surface-300 rounded-xl shadow-sm p-6
```

#### Card Variações

| Tipo              | Classes                                                              | Uso               |
| ----------------- | -------------------------------------------------------------------- | ----------------- |
| **Padrão**        | `rounded-xl border border-surface-300 bg-white shadow-sm p-6`        | Cards gerais      |
| **Elevated**      | `rounded-xl border border-surface-200 bg-white shadow-lg p-6`        | Cards importantes |
| **Flat**          | `rounded-xl border border-surface-200 bg-surface-50 p-6`             | Cards secundários |
| **Interactive**   | `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200` | Cards clicáveis   |
| **Glassmorphism** | `bg-white/80 backdrop-blur-md border border-white/20`                | Overlays modernos |
| **Metric**        | `bg-gradient-to-br from-surface-50 to-surface-100`                   | Cards de métricas |
| **Feature**       | `rounded-2xl bg-gradient-to-br from-brand-50 to-surface-50`          | Cards de destaque |

#### Micro-interações

**Bounce Effect:**

```css
hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150
```

**Glow Effect:**

```css
hover: shadow-[0_0_20px_rgba(99, 102, 241, 0.15)] transition-shadow duration-300;
```

**Magnetic Effect:**

```css
group-hover: translate-x-1 transition-transform duration-200;
```

#### SectionCard (Componente Padrão)

```tsx
<section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
  <header className="flex items-center justify-between">
    <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
      <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
        <Icon className="w-5 h-5" />
      </span>
      Título
    </h2>
  </header>
  {/* children */}
</section>
```

### Botões

#### Botão Primário

```css
inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 text-white font-medium text-sm h-10 px-4 transition hover:opacity-90 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60
```

#### Botão Secundário

```css
inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 px-4 transition hover:bg-surface-100 focus:ring-2 focus:ring-indigo-400
```

### Inputs

#### Input Padrão

```css
w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition
```

### Navegação

#### Sidebar Item Ativo

```css
bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 text-white shadow-xl transform scale-[1.02] ring-2 ring-indigo-200/50
```

#### Sidebar Item Inativo

```css
text-gray-700 hover:bg-surface-100 hover:text-gray-900 hover:scale-[1.01] hover:shadow-sm
```

## Melhorias Futuras

### 1. Sistema de Themes

- **Dark Mode:** Implementar tokens para modo escuro
- **High Contrast:** Versão para acessibilidade
- **Company Branding:** Permitir customização de cores por empresa

### 2. Componentes Avançados

- **Data Visualization:** Charts consistentes com o design system
- **Empty States:** Ilustrações e micro-copy padronizados
- **Loading States:** Skeletons e spinners unificados
- **Toast System:** Notificações não-intrusivas

### 3. Animações e Micro-interações

- **Page Transitions:** Transições suaves entre rotas
- **Scroll Animations:** Reveal effects para dashboards
- **Gesture Support:** Swipe actions em mobile
- **Haptic Feedback:** Para ações importantes

### 4. Responsividade Aprimorada

- **Mobile-first:** Redesign para melhor experiência mobile
- **Tablet Layouts:** Aproveitamento de espaço em tablets
- **Desktop Optimization:** Layouts eficientes para telas grandes

### 5. Performance

- **Font Loading:** Estratégia otimizada de carregamento
- **Icon Optimization:** Tree-shaking e lazy loading
- **CSS-in-JS:** Considerar Stitches ou similar para runtime

## Próximos Passos

1. **Implementar Geist Font** ✅
2. **Expandir sistema de cores** ✅
3. **Migrar para Lucide Icons** (próximo)
4. **Criar biblioteca de componentes** (planning)
5. **Implementar dark mode** (futuro)

---

_Design System v2.0 - Atualizado em 12/10/2025_
| ------------------- | ------------------------------------------------------------------- |
| **Hover Primário** | `hover:opacity-90` (gradientes) ou `hover:bg-surface-100` (sólidos) |
| **Ativo Navegação** | Gradiente brand + `shadow-xl transform scale-[1.02]` |
| **Loading Estado** | Skeleton components com `animate-pulse` |
| **Erro Input** | `border-red-300 bg-red-50` + texto `text-red-600` |
| **Disabled** | `opacity-60 cursor-not-allowed` |
| **Focus Ring** | `ring-2 ring-indigo-400` |

### Gamificação

#### PlayerCard

**Estrutura Principal:**

```tsx
<div className="bg-white border border-surface-300 rounded-xl shadow-lg p-6">
  {/* Avatar com gradiente brand */}
  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-sky-500 to-indigo-400 rounded-lg flex items-center justify-center text-white shadow-sm border border-surface-300">
    <FiUser className="w-8 h-8" />
  </div>

  {/* Level badge */}
  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-sky-500 to-indigo-400 rounded-lg flex items-center justify-center shadow-sm border border-white">
    <span className="text-white font-bold text-xs">{level}</span>
  </div>
</div>
```

#### Avatar System

**Tamanhos Padronizados:**

- `w-7 h-7`: Sidebar, navegação
- `w-10 h-10`: Cards de lista, reportes
- `w-12 h-12`: Headers, identity sections
- `w-20 h-20`: PlayerCard principal

**Estilo Base:**

```css
bg-gradient-to-br from-indigo-600 via-sky-500 to-indigo-400 rounded-lg flex items-center justify-center text-white font-bold shadow-sm
```

#### Progress Bars

**Estrutura:**

```tsx
<div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
    style={{ width: `${percentage}%` }}
  />
</div>
```

#### Badges & Indicators

**Badge Básico:**

```css
inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700
```

**Streak Indicator:**

```css
bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 text-white px-2 py-1 rounded text-xs font-bold
```

### StatCards

#### StatCard (SharedComponent)

```tsx
<div className="relative rounded-2xl border border-surface-300/70 bg-white shadow-md px-4 py-3 flex flex-col transition-transform duration-200 ease-out hover:scale-[1.04] hover:shadow-lg">
  <div className="flex items-center gap-1.5">
    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
    <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
      {label}
    </span>
  </div>
  <span className="font-semibold text-lg text-gray-800 mt-1">{value}</span>
</div>
```

#### Metric Card com Ícone

```tsx
<div className="flex items-center gap-4 rounded-xl border border-surface-300/70 bg-white/80 backdrop-blur px-4 py-3 shadow-sm">
  <div className="h-11 w-11 flex items-center justify-center rounded-lg bg-indigo-100">
    <Icon className="w-5 h-5 text-indigo-600" />
  </div>
  <div className="flex flex-col leading-tight">
    <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
      {label}
    </span>
    <span className="text-lg font-semibold text-gray-800 tabular-nums">
      {value}
    </span>
  </div>
</div>
```

### Timeline de Ciclos PDI

Sistema de visualização cronológica para acompanhar evolução profissional através de ciclos PDI.

#### Timeline Container

```tsx
<div className="space-y-6">
  {filteredCycles.map((cycle, index) => (
    <div key={cycle.id} className="relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-surface-200 -z-10"></div>
      )}

      {/* Cycle Card */}
      <div className="rounded-2xl border border-surface-300 bg-white shadow-sm overflow-hidden">
        {/* Status & Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Status Indicator */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center border-2 border-white shadow-sm">
              <FiCheckCircle className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {cycle.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{cycle.description}</p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

#### Status Indicators

| Status      | Background      | Text Color        | Ícone           |
| ----------- | --------------- | ----------------- | --------------- |
| `planned`   | `bg-gray-100`   | `text-gray-500`   | `FiClock`       |
| `active`    | `bg-blue-100`   | `text-blue-600`   | `FiPlay`        |
| `paused`    | `bg-yellow-100` | `text-yellow-600` | `FiPause`       |
| `completed` | `bg-green-100`  | `text-green-600`  | `FiCheckCircle` |
| `archived`  | `bg-gray-200`   | `text-gray-600`   | `FiArchive`     |

#### Badge Rarity Colors

```tsx
const badgeRarityColors = {
  common: "bg-gray-100 text-gray-600 border-gray-300",
  rare: "bg-blue-100 text-blue-600 border-blue-300",
  epic: "bg-purple-100 text-purple-600 border-purple-300",
  legendary: "bg-yellow-100 text-yellow-600 border-yellow-300",
};
```

#### Timeline Stats Cards

```tsx
<div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
      <FiCalendar className="w-5 h-5 text-indigo-600" />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">
        {stats.totalCycles}
      </div>
      <div className="text-sm text-gray-600">Ciclos Total</div>
    </div>
  </div>
</div>
```

#### Navegação Timeline

- **Atalho**: `G + T` para acessar timeline
- **Rotas**: `/pdi/timeline` (própria) e `/pdi/timeline/:userId` (outros usuários)
- **Filtros**: Status, período, competências, exibição de badges/feedback

## Acessibilidade

- **Labels Explícitos**: Todos inputs com labels ou aria-label
- **Focus Visível**: Ring indigo consistente (`focus:ring-2 focus:ring-indigo-400`)
- **Contraste**: Brand #6366f1 mantém contraste 4.5:1+ sobre branco
- **Navegação por Teclado**: Atalhos `G + [tecla]` implementados (H=Dashboard, D=PDI, T=Timeline, L=Leaderboard, M=Manager, A=Admin)
- **Semântica**: Uso correto de elementos semânticos HTML

## Grid / Layout

| Contexto           | Largura Máxima | Responsividade                  |
| ------------------ | -------------- | ------------------------------- |
| **Páginas Gerais** | `max-w-6xl`    | Grid responsivo                 |
| **Login/Hero**     | `max-w-5xl`    | `md:grid-cols-5`                |
| **Cards Grid**     | Auto           | `sm:grid-cols-2 lg:grid-cols-3` |
| **Stat Grid**      | Auto           | `sm:grid-cols-2 lg:grid-cols-4` |

## Performance & UX

- **Transições Suaves**: `transition-all duration-200` padrão
- **Hover Effects**: `hover:scale-[1.04]` em cards interativos
- **Progress Animado**: `duration-1000 ease-out` em barras de progresso
- **Loading States**: Skeleton components com design consistente

## Implementação

### Classes Utilitárias Customizadas

**Background Pattern Principal:**

```css
.bg-app-pattern {
  background: radial-gradient(
    circle at 12% 18%,
    #dbe4ff 0%,
    #e5ecff 35%,
    #f1f5ff 55%,
    #f8fafc 70%
  );
}
```

**Gradiente Brand:**

```css
.bg-brand-gradient {
  background: linear-gradient(to right, #4f46e5, #0ea5e9, #6366f1);
}
```

### Manutenção

**Checklist de Implementação:**

- [ ] Usar surface tokens ao invés de cores hardcoded
- [ ] Aplicar gradiente brand em elementos de destaque
- [ ] Manter hierarquia de ícones (3px, 4px, 5px, 6px, 8px)
- [ ] Implementar estados hover/focus consistentes
- [ ] Seguir padrão de cards (rounded-xl, border-surface-300)
- [ ] Validar contraste em novos componentes

---

**Última atualização**: Outubro 2025 - Baseado na implementação real do Meu PDI
