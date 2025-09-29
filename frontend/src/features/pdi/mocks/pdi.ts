import type { PdiPlan } from "..";

export const mockPdi: PdiPlan = {
  userId: "me",
  cycles: [],
  competencies: [
    "Front - React",
    "Front - State Management",
    "Front - Form Management",
  ],
  krs: [
    {
      id: "kr1",
      description:
        "Aumentar a maturidade de componentes reutilizáveis na codebase",
      successCriteria:
        "Ter pelo menos 5 componentes core padronizados com documentação básica e testes snapshot",
      currentStatus:
        "2 componentes core criados (Button, Dropdown) sem testes ainda",
      improvementActions: [
        "Adicionar testes de snapshot para Button e Dropdown",
        "Extrair tokens de espaçamento em arquivo central",
      ],
    },
  ],
  milestones: [
    {
      id: "m1",
      date: "2025-08-05",
      title: "Primeiro encontro (05/08/2025)",
      summary:
        "Competências técnicas definidas para desenvolvimento no ciclo.\n\nNão foram encontradas tasks da sprint alinhadas com as competências, por isso será feito um acompanhamento de perto nos PRs da dev para avaliação mais dedicada.\n\nSe surgir a oportunidade será definida uma parte da codebase para ser refatorada seguindo as boas práticas de desenvolvimento alinhado com as competências.\n\nExpectativas alinhadas.",
    },
    {
      id: "m2",
      date: "2025-08-22",
      title: "Segundo encontro (22/08/2025)",
      summary:
        "Primeiro retorno do ciclo:\nA partir dos PRs da sprint foram pontuados algumas questões para se trabalhar nas próximas implementações:",
      improvements: [
        "Composition Pattern: aplicar padrão em componentes genéricos de UI.",
        "Utilizar lib para merge de classes Tailwind.",
        "State Management: tornar hook useHandleUpload genérico e avaliar reducers.",
      ],
      resources: [],
      tasks: [
        {
          id: "t-m2-1",
          title: "Refatorar Dropdown usando Composition Pattern",
          done: true,
        },
        {
          id: "t-m2-2",
          title: "Introduzir tailwind-merge em componentes compartilhados",
        },
      ],
      suggestions: [
        "Extrair hook para lógica repetida de upload em 2 PRs recentes.",
        "Adicionar testes de snapshot para novos componentes de UI reutilizados.",
      ],
    },
    {
      id: "m3",
      date: "2025-09-09",
      title: "Terceiro encontro (09/09/2025)",
      summary:
        "Terceiro retorno do ciclo: A partir do código implementado para a feature de Sequências foram pontuados pontos positivos e pontos de melhoria.",
      positives: [
        "Aplicou corretamente o Composition Pattern no Dropdown (com pequenos pontos de melhoria).",
        "Passou a utilizar tailwind-merge para merge de classes.",
      ],
      improvements: [
        "Separação de responsabilidades (Domínio): mover entidades/constantes para camada de domínio.",
        "Separação de responsabilidades (Aplicação): extrair regras para hooks.",
      ],
      resources: [
        "https://dev.to/bespoyasov/clean-architecture-on-frontend-4311",
      ],
      tasks: [
        {
          id: "t-m3-1",
          title: "Extrair entidades de domínio para pasta domain/",
        },
        { id: "t-m3-2", title: "Separar regras em hooks dedicados" },
      ],
      suggestions: [
        "Padronizar nomenclatura de reducers (commit: refactor/state-names).",
        "Avaliar remoção de código morto detectado em 3 imports não usados.",
      ],
    },
  ],
  records: [
    { area: "Front - React", levelBefore: 3 },
    { area: "Front - State Management", levelBefore: 2 },
    { area: "Front - Form Management", levelBefore: 2 },
  ],
  createdAt: "2025-08-05",
  updatedAt: "2025-09-09",
};
