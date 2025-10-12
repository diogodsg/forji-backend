export interface CompetencyLevel {
  level: number;
  name: string;
  description: string;
  indicators: string[];
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  levels: CompetencyLevel[];
}

export interface CompetencyArea {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  competencies: Competency[];
}

export const COMPETENCY_AREAS: CompetencyArea[] = [
  {
    id: "technical",
    name: "Competências Técnicas",
    icon: "FiCode",
    color: "blue",
    description:
      "Habilidades técnicas específicas de desenvolvimento e engenharia",
    competencies: [
      {
        id: "react-frontend",
        name: "React/Frontend",
        description:
          "Desenvolvimento de interfaces com React e ecossistema frontend moderno",
        levels: [
          {
            level: 1,
            name: "Iniciante",
            description:
              "Conhecimentos básicos de React e desenvolvimento frontend",
            indicators: [
              "Criar componentes funcionais simples",
              "Usar hooks básicos (useState, useEffect)",
              "Entender JSX e props",
              "Aplicar CSS básico e responsividade",
              "Trabalhar com formulários simples",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description:
              "Desenvolvimento eficiente com React e ferramentas avançadas",
            indicators: [
              "Gerenciar estado complexo com Context API",
              "Criar hooks customizados",
              "Implementar lazy loading e code splitting",
              "Usar TypeScript efetivamente",
              "Otimizar performance (memo, callback)",
              "Integrar com APIs REST",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Expertise em React e arquitetura frontend complexa",
            indicators: [
              "Arquitetar aplicações frontend escaláveis",
              "Implementar padrões avançados (compound components, render props)",
              "Otimizar performance crítica e bundle size",
              "Mentoriar outros desenvolvedores frontend",
              "Definir padrões e arquitetura do time",
              "Contribuir para bibliotecas open source",
            ],
          },
        ],
      },
      {
        id: "backend-apis",
        name: "Backend/APIs",
        description:
          "Desenvolvimento de serviços backend, APIs e arquitetura de sistemas",
        levels: [
          {
            level: 1,
            name: "Iniciante",
            description: "Desenvolvimento de APIs básicas e operações CRUD",
            indicators: [
              "Criar endpoints REST básicos",
              "Conectar com banco de dados relacional",
              "Implementar validações de entrada",
              "Entender conceitos de HTTP e status codes",
              "Trabalhar com ORM/Query Builder básico",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "APIs robustas e escaláveis com boas práticas",
            indicators: [
              "Implementar autenticação e autorização (JWT, OAuth)",
              "Criar middlewares customizados",
              "Otimizar queries e implementar cache",
              "Documentar APIs com OpenAPI/Swagger",
              "Implementar testes unitários e integração",
              "Trabalhar com filas e jobs assíncronos",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Arquitetura de microserviços e sistemas distribuídos",
            indicators: [
              "Projetar arquiteturas distribuídas",
              "Implementar event sourcing e CQRS",
              "Otimizar performance em escala (milhões de requests)",
              "Definir contratos de API e versionamento",
              "Implementar observabilidade completa",
              "Arquitetar para alta disponibilidade",
            ],
          },
        ],
      },
      {
        id: "devops-infrastructure",
        name: "DevOps/Infraestrutura",
        description: "Automação, deploy, infraestrutura e operações",
        levels: [
          {
            level: 1,
            name: "Iniciante",
            description: "Deploy básico e containerização",
            indicators: [
              "Usar Docker para desenvolvimento",
              "Deploy manual em staging",
              "Monitoramento básico de aplicações",
              "Entender conceitos de CI/CD",
              "Trabalhar com variáveis de ambiente",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Automação e Infrastructure as Code",
            indicators: [
              "Configurar pipelines CI/CD completos",
              "Gerenciar containers em produção (K8s básico)",
              "Implementar monitoring e alertas",
              "Infrastructure as Code (Terraform, CloudFormation)",
              "Automatizar backups e restores",
              "Otimizar custos de cloud",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Arquitetura de infraestrutura e SRE",
            indicators: [
              "Projetar infraestrutura auto-escalável",
              "Implementar disaster recovery completo",
              "Otimizar performance e custos em escala",
              "Definir SLAs e implementar SRE practices",
              "Automação completa de deploy e rollback",
              "Arquitetar para multi-cloud/hybrid",
            ],
          },
        ],
      },
      {
        id: "data-analytics",
        name: "Dados e Analytics",
        description: "Análise de dados, BI e engenharia de dados",
        levels: [
          {
            level: 1,
            name: "Iniciante",
            description: "Análise básica de dados e relatórios",
            indicators: [
              "Criar queries SQL básicas",
              "Desenvolver dashboards simples",
              "Entender conceitos de ETL",
              "Trabalhar com planilhas avançadas",
              "Interpretar métricas básicas de negócio",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Pipelines de dados e análises avançadas",
            indicators: [
              "Desenvolver pipelines de ETL/ELT",
              "Criar dashboards interativos avançados",
              "Implementar data warehouse básico",
              "Análise estatística e tendências",
              "Automatizar relatórios e alertas",
              "Trabalhar com APIs de dados",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Arquitetura de dados e machine learning",
            indicators: [
              "Arquitetar data lakes e warehouses",
              "Implementar streaming de dados em tempo real",
              "Desenvolver modelos de machine learning",
              "Otimizar performance de grandes volumes",
              "Definir governança de dados",
              "Implementar data lineage e qualidade",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "soft-skills",
    name: "Competências Comportamentais",
    icon: "FiUsers",
    color: "green",
    description:
      "Habilidades interpessoais, comunicação e desenvolvimento pessoal",
    competencies: [
      {
        id: "communication",
        name: "Comunicação",
        description: "Habilidade de comunicar ideias de forma clara e efetiva",
        levels: [
          {
            level: 1,
            name: "Básico",
            description: "Comunicação clara em contextos familiares",
            indicators: [
              "Expressa ideias de forma compreensível",
              "Ouve ativamente colegas",
              "Participa ativamente em reuniões",
              "Escreve documentação clara",
              "Faz perguntas relevantes",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Comunicação efetiva em diversos contextos",
            indicators: [
              "Adapta comunicação ao público-alvo",
              "Facilita discussões produtivas",
              "Apresenta soluções técnicas para não-técnicos",
              "Resolve conflitos construtivamente",
              "Comunica status e progresso claramente",
              "Dá e recebe feedback efetivamente",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Liderança em comunicação organizacional",
            indicators: [
              "Influencia decisões estratégicas através da comunicação",
              "Comunica visão e direção organizacional",
              "Mentora outros em habilidades de comunicação",
              "Representa empresa em eventos externos",
              "Facilita alinhamento entre equipes",
              "Comunica mudanças complexas efetivamente",
            ],
          },
        ],
      },
      {
        id: "leadership",
        name: "Liderança",
        description: "Capacidade de guiar, inspirar e desenvolver equipes",
        levels: [
          {
            level: 1,
            name: "Básico",
            description: "Liderança por exemplo e iniciativa",
            indicators: [
              "Demonstra iniciativa em projetos",
              "Ajuda colegas quando necessário",
              "Assume responsabilidade por resultados",
              "Mantém qualidade e padrões altos",
              "Compartilha conhecimento proativamente",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Liderança de projetos e desenvolvimento de pessoas",
            indicators: [
              "Coordena projetos multidisciplinares",
              "Mentora desenvolvedores juniores",
              "Toma decisões sob pressão",
              "Delega responsabilidades efetivamente",
              "Desenvolve outros membros da equipe",
              "Gerencia conflitos e facilitação",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Liderança estratégica e transformacional",
            indicators: [
              "Define visão técnica da organização",
              "Desenvolve outros líderes",
              "Influencia cultura organizacional",
              "Toma decisões estratégicas complexas",
              "Lidera mudanças organizacionais",
              "Inspira e motiva equipes grandes",
            ],
          },
        ],
      },
      {
        id: "problem-solving",
        name: "Resolução de Problemas",
        description: "Capacidade de analisar e resolver problemas complexos",
        levels: [
          {
            level: 1,
            name: "Básico",
            description: "Resolução de problemas estruturados",
            indicators: [
              "Identifica problemas claros",
              "Aplica soluções conhecidas",
              "Busca ajuda quando necessário",
              "Documenta soluções encontradas",
              "Segue processos estabelecidos",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Análise crítica e soluções criativas",
            indicators: [
              "Analisa problemas de múltiplas perspectivas",
              "Desenvolve soluções criativas",
              "Avalia trade-offs e alternativas",
              "Previne problemas futuros",
              "Facilita resolução em grupo",
              "Aplica pensamento sistêmico",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Resolução estratégica e inovação",
            indicators: [
              "Resolve problemas complexos e ambíguos",
              "Inova em abordagens e metodologias",
              "Antecipa problemas sistêmicos",
              "Ensina técnicas de resolução",
              "Conecta problemas aparentemente não relacionados",
              "Lidera resolução de crises organizacionais",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "business",
    name: "Competências de Negócio",
    icon: "FiTrendingUp",
    color: "purple",
    description:
      "Compreensão de negócio, orientação a resultados e visão estratégica",
    competencies: [
      {
        id: "product-thinking",
        name: "Visão de Produto",
        description:
          "Compreensão das necessidades do usuário e estratégia de produto",
        levels: [
          {
            level: 1,
            name: "Básico",
            description: "Entende impacto das decisões técnicas no produto",
            indicators: [
              "Considera experiência do usuário nas decisões",
              "Entende requisitos de negócio básicos",
              "Questiona decisões técnicas em relação ao valor",
              "Prioriza funcionalidades por impacto",
              "Coleta feedback de usuários",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Contribui ativamente para definição de produto",
            indicators: [
              "Propõe melhorias baseadas em dados e métricas",
              "Participa de descoberta e pesquisa de produto",
              "Balanceia trade-offs técnicos e de negócio",
              "Colabora efetivamente com Product Managers",
              "Implementa experimentos e A/B tests",
              "Analisa métricas de produto",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Liderança em estratégia de produto e inovação",
            indicators: [
              "Define roadmap técnico alinhado ao negócio",
              "Identifica oportunidades de inovação",
              "Influencia estratégia de produto da empresa",
              "Valida hipóteses com experimentos complexos",
              "Desenvolve novos modelos de negócio",
              "Lidera iniciativas de transformação digital",
            ],
          },
        ],
      },
      {
        id: "project-management",
        name: "Gestão de Projetos",
        description: "Planejamento, execução e entrega de projetos complexos",
        levels: [
          {
            level: 1,
            name: "Básico",
            description: "Gestão de tarefas e entregas pessoais",
            indicators: [
              "Planeja e organiza próprias tarefas",
              "Cumpre prazos estabelecidos",
              "Comunica progresso regularmente",
              "Identifica dependências básicas",
              "Usa ferramentas de gestão de tarefas",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Gestão de projetos de média complexidade",
            indicators: [
              "Planeja projetos multidisciplinares",
              "Gerencia riscos e impedimentos",
              "Coordena múltiplas workstreams",
              "Facilita cerimônias ágeis",
              "Reporta status para stakeholders",
              "Adapta metodologias ao contexto",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Gestão de programas e portfólio",
            indicators: [
              "Gerencia múltiplos projetos interdependentes",
              "Define processos de gestão organizacional",
              "Alinha projetos com estratégia de negócio",
              "Gerencia orçamentos e recursos complexos",
              "Lidera transformações organizacionais",
              "Desenvolve PMOs e governança",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "innovation",
    name: "Inovação e Aprendizado",
    icon: "FiBulb",
    color: "orange",
    description:
      "Capacidade de inovar, aprender continuamente e adaptar-se a mudanças",
    competencies: [
      {
        id: "continuous-learning",
        name: "Aprendizado Contínuo",
        description: "Capacidade de aprender e se adaptar constantemente",
        levels: [
          {
            level: 1,
            name: "Básico",
            description: "Aprendizado estruturado e curiosidade",
            indicators: [
              "Busca ativamente novos conhecimentos",
              "Participa de cursos e treinamentos",
              "Experimenta novas tecnologias e ferramentas",
              "Lê documentação e artigos técnicos",
              "Faz perguntas para entender melhor",
            ],
          },
          {
            level: 2,
            name: "Intermediário",
            description: "Aprendizado aplicado e compartilhamento",
            indicators: [
              "Aplica novos conhecimentos em projetos reais",
              "Compartilha aprendizado com a equipe",
              "Mentora outros em áreas de expertise",
              "Contribui para comunidades técnicas",
              "Adapta rapidamente a novas metodologias",
              "Desenvolve expertises especializadas",
            ],
          },
          {
            level: 3,
            name: "Avançado",
            description: "Liderança em aprendizado organizacional",
            indicators: [
              "Define estratégias de aprendizado organizacional",
              "Cria culturas de experimentação e falha rápida",
              "Desenvolve outros como líderes de aprendizado",
              "Influencia direções tecnológicas da empresa",
              "Contribui para pesquisa e desenvolvimento",
              "Lidera adoção de tecnologias emergentes",
            ],
          },
        ],
      },
    ],
  },
];

// Funções utilitárias
export const getCompetencyById = (
  competencyId: string
): Competency | undefined => {
  for (const area of COMPETENCY_AREAS) {
    const competency = area.competencies.find((c) => c.id === competencyId);
    if (competency) return competency;
  }
  return undefined;
};

export const getAreaByCompetencyId = (
  competencyId: string
): CompetencyArea | undefined => {
  return COMPETENCY_AREAS.find((area) =>
    area.competencies.some((c) => c.id === competencyId)
  );
};

export const getAllCompetencies = (): Competency[] => {
  return COMPETENCY_AREAS.flatMap((area) => area.competencies);
};
