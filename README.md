# forge

MVP frontend para acompanhamento de PRs e PDI de desenvolvedores.

## Visão Geral

Aplicação SPA em React + TypeScript (Vite) consumindo apenas dados mockados locais. Permite:

- Listar PRs do desenvolvedor (/me/prs)
- Ver detalhes de um PR com resumo de IA e checklist
- Visualizar e acompanhar PDI (/me/pdi)
- Visualização "manager" mock (/users/:userId/prs) reutilizando a lista de PRs

## Stack

- React 19 + TypeScript (Vite)
- React Router DOM v7
- TailwindCSS + @tailwindcss/typography
- date-fns (utilidades de data)
- Sem backend (fixtures em `src/mocks`)

## Estrutura de Pastas Principal

```
src/
  components/        -> Componentes reutilizáveis (PrList, PrDetailDrawer, PdiView, etc)
  pages/             -> Páginas de rota (MyPrsPage, MyPdiPage, ManagerPrsPage)
  mocks/             -> Dados mock (prs.ts, pdi.ts)
  types/             -> Tipagens (pr.ts, pdi.ts)
  index.css          -> Estilos globais (Tailwind)
  App.tsx            -> Definição de rotas e layout
```

## Rotas

| Rota                 | Descrição                       |
| -------------------- | ------------------------------- |
| `/` / `/me/prs`      | Lista de PRs do usuário atual   |
| `/me/pdi`            | Página de acompanhamento do PDI |
| `/users/:userId/prs` | Modo "manager" (read-only)      |

## Tipagens Principais

`src/types/pr.ts`

```ts
export interface PullRequest {
  /* id, author, repo, title, timestamps, métricas básicas, resumo IA, checklist */
}
```

`src/types/pdi.ts`

```ts
export interface PdiPlan {
  userId;
  competencies;
  milestones;
  records;
  createdAt;
  updatedAt;
}
```

## Mocks

- `mockPrs` em `src/mocks/prs.ts`
- `mockPdi` em `src/mocks/pdi.ts`

Para adicionar mais PRs basta inserir novos objetos no array `mockPrs` respeitando a interface `PullRequest`.

## Componentes Chave

- `PrList`: Tabela filtrável de PRs (filtros por repositório e status)
- `PrDetailDrawer`: Drawer lateral com detalhes, resumo IA e checklist
- `PdiView`: Exibe competências, milestones e resultado do PDI

## Decisões de Design

- Light mode como padrão (tema atual em `tailwind.config.js` usando cores `surface` e `brand`)
- Gradientes suaves e cartões translúcidos substituídos por fundos sólidos no light mode
- Sem estado global complexo (dados mock simples em memória)
- Markdown simples (split por blocos em vez de parser completo) para evitar dependências extras no MVP

## Possíveis Próximos Passos

1. Adicionar ordenação por data e tempo de merge em `PrList`
2. Adicionar paginação ou virtualização se lista crescer
3. Implementar persistência de checklist / ações de PDI
4. Adicionar dark mode (basta reintroduzir paleta anterior e toggle de tema)
5. Substituir parsing manual de markdown por `marked` + sanitização (`dompurify`)
6. Adicionar testes unitários (Vitest + Testing Library)
7. Integrar autenticação e backend real (quando disponível)
8. Introduzir níveis atuais vs desejados no PDI (editar `records`)

## Como Rodar

Pré-requisitos: Node 20+.

Instalação e dev:

```bash
npm install
npm run dev
```

Build produção:

```bash
npm run build
npm run preview
```

## Convenções de Código

- Imports de tipos usam `import type` para compatibilidade com `verbatimModuleSyntax`
- Classes Tailwind priorizam semântica leve; evitar duplicação criando componentes quando necessário
- Evitar lógica complexa nos componentes de página; mover para hooks conforme escalar

## Adicionando Novos PRs

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

## Ajustando Tema

Arquivo: `tailwind.config.js`

- Paleta clara atual em `surface`.
- Para reativar dark mode: criar variantes e togglar classe `dark` no `<html>`.

## Limitações Atuais

- Nenhuma persistência: qualquer interação é efêmera
- Checklist não salva estado
- Sem paginação / skeleton loading
- Apenas 1 usuário "me" e view manager mockada

## Qualidade / Build

- `npm run build` gera artefatos em `dist/`
- Sem testes ainda (pendente)
- Lint base via ESLint config padrão Vite + TS

## Segurança

- Sem entrada de usuário dinâmica (baixo risco XSS). Atenção ao adicionar markdown parser futuramente.

## Contato / Handoff

Próximo agente deve:

1. Ler este README
2. Rodar `npm install && npm run dev`
3. Abrir rotas principais e validar mocks
4. Escolher qual próximo passo implementar da lista sugerida

---

MVP pronto para extensão.
