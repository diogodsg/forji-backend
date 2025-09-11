# Forge Design System (MVP)

Status: MVP inicial — foco em consistência visual simples, iterável.

## Princípios

1. Clareza primeiro: tipografia legível, hierarquia óbvia.
2. Leve e rápido: poucas dependências, Tailwind utilitário.
3. Extensível: tokens centralizados para futura expansão (dark mode, temas).
4. Acessível por padrão: contraste mínimo AA, foco visível.
5. Iterativo: documentar antes de complexificar.

## Tokens

### Cores

Fonte: `tailwind.config.js` (extend.colors)

| Token              | Valor     | Uso                     |
| ------------------ | --------- | ----------------------- |
| `brand.DEFAULT`    | `#6366f1` | Ações primárias, ênfase |
| `brand.foreground` | `#ffffff` | Texto sobre brand       |
| `surface.0`        | `#ffffff` | Fundo puro (cards)      |
| `surface.100`      | `#f8fafc` | Fundo da aplicação      |
| `surface.200`      | `#eef2f6` | Realces suaves / hovers |
| `surface.300`      | `#e2e8f0` | Bordas e divisores      |

Gradientes decorativos: gerados ad hoc via `bg-[radial-gradient(...)]` e `bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400`.

### Tipografia

Family: `Inter, system-ui, sans-serif`.

| Escala (Tailwind)         | Uso                          |
| ------------------------- | ---------------------------- |
| `text-xs` / `text-[10px]` | Metadados, labels auxiliares |
| `text-sm`                 | Texto padrão denso           |
| `text-base`               | Texto de leitura             |
| `text-lg`                 | Destaques leves              |
| `text-xl`–`text-2xl`      | Títulos seções / headers     |
| `text-4xl`                | Marca / hero login           |

Font-weight: 400 normal, 500/600 headings, 700/800 para marca.

### Espaçamento

Base 4px (escala Tailwind). Principais padrões:

- Containers internos: `px-4`/`px-6` e `py-6`/`py-8`.
- Cards: `p-4` pequenos, `p-6` médios, `p-8` destaque (login).
- Gaps de layout principais: `gap-4`, `gap-6`, `gap-8`.

### Borda / Radius / Elevation

| Token        | Valor                                     |
| ------------ | ----------------------------------------- |
| `rounded`    | 0.25rem (mínimo inputs)                   |
| `rounded-md` | 0.375rem (botões)                         |
| `rounded-lg` | 0.5rem (cards padrão)                     |
| `rounded-xl` | 1rem (cards destaque, definido em config) |

Sombras:

- `shadow-sm` (default do Tailwind) — uso leve.
- `shadow-soft` (custom) — ações primárias ativas / highlight nav.

Bordas: `border-surface-300` (ou `border-surface-300/80` para translucidez).

### Foco

Padrão: `focus:ring-2 focus:ring-indigo-400 focus:outline-none` em inputs e botões.

### Ícones / Ilustrações

Sem lib de ícones ainda. Texto e micro-elementos textuais substituem ícones temporariamente.

## Componentes (MVP)

### Botão Primário

Classe base: `inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm h-10 px-4 transition focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed`.

Variações futuras: secundário (outline), destrutivo, ghost.

### Card

Estrutura: `bg-white/80 backdrop-blur-sm border border-surface-300 rounded-lg shadow-sm p-6`.

Destaque (login): `rounded-xl` + moldura gradiente externa + blur leve.

### Input

`w-full px-3 py-2 rounded border border-surface-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm transition`.

### Navegação Topo

Container fixo com translucidez: `border-b border-surface-300/80 bg-white/80 backdrop-blur`. Itens navegação: base `px-3 py-2 rounded text-sm font-medium`, ativo com `bg-indigo-600 text-white shadow-soft`, inativo `text-gray-600 hover:bg-surface-200`.

### Login Layout

Grid responsiva (`md:grid-cols-5`), lado esquerdo hero + claims, lado direito card.
Gradientes radiais suaves para profundidade: opacidades 60–70%.

## Estados

| Estado          | Padrão visual                                                                |
| --------------- | ---------------------------------------------------------------------------- |
| Hover primário  | Tom brand escurece (`bg-indigo-700`)                                         |
| Ativo navegação | Fundo brand + sombra soft                                                    |
| Loading botão   | Spinner minimal `border-2 border-white/60 border-t-transparent animate-spin` |
| Erro input      | Container aviso `bg-red-50 border border-red-200 text-red-600`               |
| Disabled        | `opacity-60 cursor-not-allowed`                                              |

## Acessibilidade

- Labels explícitos nos inputs.
- Botões com `aria-label` quando texto não é autoexplicativo (ex: toggle senha).
- Contraste mantido (brand #6366f1 sobre branco > 4.5:1 em texto normal com peso). Validar novamente ao ajustar paleta.

## Grid / Layout

Largura máxima principal: `max-w-6xl` em páginas internas. Login usa `max-w-5xl` para composição hero.

## Persistência Visual

Dados editáveis persistem via localStorage; UI deve comunicar instantaneidade (sem loaders artificiais exceto feedback de login fictício).

## Roadmap UI

1. Estados de skeleton para listas de PR.
2. Tema dark (reaproveitar tokens criando `dark:` variantes, toggle no header).
3. Biblioteca de ícones (ex: Lucide) com guidelines de uso (tamanho 16 / 20px).
4. System de espaçamento semântico (ex: `--space-1..n`).
5. Tokens de tipografia via CSS vars para fácil theming.
6. Paleta de feedback expandida (success/warning/info).
7. Componentes: Tabs, Toast, Dialog, Dropdown.
8. Motion: transições sutis padronizadas (dur 150–250ms, easing `ease-out` / `ease-in-out`).

## Uso e Evolução

Manter este documento atualizado a cada introdução de novo token ou variante. Antes de adicionar lib de UI, tentar compor com utilitários existentes para evitar acoplamento prematuro.

---

Última atualização: (preencher automaticamente em pipeline futura).
