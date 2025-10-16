import { useState, useEffect } from "react";
import type {
  Competency,
  UserCompetencyProgress,
  OneOnOneRecord,
  OneOnOneTemplate,
  WorkingOnOption,
  CompetencyEvidence,
} from "../types";

// Mock data para competências
const MOCK_COMPETENCIES: Competency[] = [
  {
    id: "frontend-dev",
    name: "Frontend Development",
    description:
      "Desenvolvimento de interfaces de usuário modernas e responsivas",
    category: "technical",
    subCategory: "Development",
    isCore: true,
    isCustom: false,
    icon: "Code2",
    relatedCompetencies: ["backend-dev", "ux-design"],
    levels: [
      {
        level: 1,
        name: "Básico",
        description: "Conhecimentos fundamentais de HTML, CSS e JavaScript",
        behaviors: [
          "Cria páginas HTML semânticas",
          "Aplica estilos CSS responsivos",
          "Implementa interações básicas em JavaScript",
        ],
        evidence: [
          "Projeto pessoal com HTML/CSS/JS",
          "Contribuição em projeto existente",
          "Code review aprovado por senior",
        ],
        timeEstimate: "3-6 meses",
      },
      {
        level: 2,
        name: "Intermediário",
        description: "Domínio de frameworks modernos e ferramentas de build",
        behaviors: [
          "Desenvolve aplicações React/Vue fluentemente",
          "Implementa state management efetivo",
          "Configura ferramentas de build e bundling",
        ],
        evidence: [
          "Aplicação completa com framework moderno",
          "Implementação de state management",
          "Configuração de webpack/vite do zero",
        ],
        timeEstimate: "6-12 meses",
      },
      {
        level: 3,
        name: "Avançado",
        description: "Arquitetura complexa, performance e testes",
        behaviors: [
          "Desenha arquitetura de componentes escalável",
          "Otimiza performance (Core Web Vitals)",
          "Implementa estratégias de testing abrangentes",
        ],
        evidence: [
          "Arquitetura aprovada por tech lead",
          "Melhoria documentada de performance",
          "Cobertura de testes >80%",
        ],
        timeEstimate: "12-18 meses",
      },
    ],
  },
  {
    id: "mentoring",
    name: "Mentoria e Coaching",
    description: "Desenvolvimento de pessoas através de orientação e feedback",
    category: "leadership",
    subCategory: "People Development",
    isCore: true,
    isCustom: false,
    icon: "Users",
    relatedCompetencies: ["communication", "feedback"],
    levels: [
      {
        level: 1,
        name: "Básico",
        description: "Ajuda colegas pontualmente com conhecimento técnico",
        behaviors: [
          "Responde dúvidas técnicas dos colegas",
          "Compartilha conhecimento em conversas informais",
          "Oferece ajuda proativa quando apropriado",
        ],
        evidence: [
          "Feedback positivo de colegas ajudados",
          "Documentação ou tutoriais criados",
          "Participação ativa em discussões técnicas",
        ],
        timeEstimate: "1-3 meses",
      },
      {
        level: 2,
        name: "Intermediário",
        description: "Mentoria formal e estruturada de uma pessoa",
        behaviors: [
          "Conduz sessões regulares de mentoria",
          "Define objetivos claros com o mentorado",
          "Acompanha progresso e oferece feedback construtivo",
        ],
        evidence: [
          "Mentoria formal por 3+ meses",
          "Progresso documentado do mentorado",
          "Feedback positivo do mentorado e manager",
        ],
        timeEstimate: "6-12 meses",
      },
      {
        level: 3,
        name: "Avançado",
        description:
          "Desenvolvimento de múltiplas pessoas e criação de programas",
        behaviors: [
          "Mentora múltiplas pessoas simultaneamente",
          "Cria programas e processos de desenvolvimento",
          "Treina outros mentores",
        ],
        evidence: [
          "Desenvolvimento bem-sucedido de 3+ pessoas",
          "Programa de mentoria criado/liderado",
          "Outros mentores treinados",
        ],
        timeEstimate: "12-24 meses",
      },
    ],
  },
];

// Mock data para progresso do usuário
const MOCK_USER_PROGRESS: UserCompetencyProgress[] = [
  {
    competencyId: "frontend-dev",
    currentLevel: 2,
    targetLevel: 3,
    progress: 60,
    isActiveInCycle: true,
    startDate: "2025-01-15T00:00:00Z",
    targetDate: "2025-12-31T00:00:00Z",
    evidences: [
      {
        id: "ev-1",
        type: "project",
        title: "Dashboard Analytics com Zustand",
        description:
          "Implementação completa de state management em projeto React",
        date: "2025-09-15T00:00:00Z",
        xpAwarded: 50,
        verifiedBy: "tech-lead-ana",
      },
      {
        id: "ev-2",
        type: "milestone",
        title: "Cobertura de testes 85%",
        description: "Alcançou meta de testing no projeto Analytics",
        date: "2025-10-01T00:00:00Z",
        xpAwarded: 75,
      },
    ],
  },
  {
    competencyId: "mentoring",
    currentLevel: 1,
    targetLevel: 2,
    progress: 30,
    isActiveInCycle: true,
    startDate: "2025-10-01T00:00:00Z",
    targetDate: "2026-03-31T00:00:00Z",
    evidences: [
      {
        id: "ev-3",
        type: "1on1",
        title: "Primeira sessão de mentoria com Bruno",
        description:
          "Sessão inicial estabelecendo objetivos e plano de desenvolvimento",
        date: "2025-10-05T00:00:00Z",
        xpAwarded: 25,
      },
    ],
  },
];

// Opções para "No que estava trabalhando"
const WORKING_ON_OPTIONS: WorkingOnOption[] = [
  // Projetos
  {
    id: "project-dashboard",
    label: "Dashboard Analytics",
    category: "project",
    icon: "BarChart3",
  },
  {
    id: "project-auth",
    label: "Sistema de Autenticação",
    category: "project",
    icon: "Shield",
  },
  {
    id: "project-mobile",
    label: "App Mobile",
    category: "project",
    icon: "Smartphone",
  },

  // Aprendizado
  {
    id: "learning-react",
    label: "Estudando React Avançado",
    category: "learning",
    icon: "Book",
  },
  {
    id: "learning-aws",
    label: "Certificação AWS",
    category: "learning",
    icon: "Cloud",
  },
  {
    id: "learning-testing",
    label: "Testing Strategies",
    category: "learning",
    icon: "TestTube",
  },

  // Competências
  {
    id: "comp-frontend",
    label: "Frontend Development",
    category: "competency",
    icon: "Code2",
  },
  {
    id: "comp-mentoring",
    label: "Mentoria",
    category: "competency",
    icon: "Users",
  },
  {
    id: "comp-leadership",
    label: "Liderança Técnica",
    category: "competency",
    icon: "Crown",
  },

  // Processos
  {
    id: "process-review",
    label: "Code Review",
    category: "process",
    icon: "GitPullRequest",
  },
  {
    id: "process-planning",
    label: "Sprint Planning",
    category: "process",
    icon: "Calendar",
  },
  {
    id: "process-docs",
    label: "Documentação",
    category: "process",
    icon: "FileText",
  },

  // Outros
  {
    id: "other-team",
    label: "Colaboração em Equipe",
    category: "other",
    icon: "Users2",
  },
  {
    id: "other-custom",
    label: "Outro (especificar)",
    category: "other",
    icon: "Plus",
  },
];

// Templates para 1:1s
const ONEONONE_TEMPLATES: OneOnOneTemplate[] = [
  {
    id: "manager-template",
    name: "Manager 1:1",
    role: "manager",
    icon: "Crown",
    description: "Sessão com manager focada em performance e carreira",
    suggestedTopics: [
      "Performance atual",
      "Objetivos de carreira",
      "Desafios e bloqueios",
      "Feedback",
    ],
    defaultWorkingOn: ["project-dashboard", "comp-frontend"],
    questionPrompts: [
      {
        section: "Performance",
        questions: [
          "Como você avalia seu desempenho nas últimas semanas?",
          "Quais foram seus principais sucessos?",
          "Onde você sente que precisa de mais suporte?",
        ],
      },
      {
        section: "Desenvolvimento",
        questions: [
          "Que competências você quer desenvolver?",
          "Que oportunidades você gostaria de ter?",
          "Como posso te ajudar a crescer?",
        ],
      },
    ],
  },
  {
    id: "mentor-template",
    name: "Mentor 1:1",
    role: "mentor",
    icon: "GraduationCap",
    description: "Sessão com mentor focada em aprendizado e orientação",
    suggestedTopics: [
      "Aprendizados recentes",
      "Dúvidas técnicas",
      "Próximos estudos",
      "Carreira",
    ],
    defaultWorkingOn: ["learning-react", "comp-frontend"],
    questionPrompts: [
      {
        section: "Aprendizado",
        questions: [
          "O que você aprendeu de novo recentemente?",
          "Quais conceitos estão mais claros agora?",
          "Onde você ainda tem dúvidas?",
        ],
      },
      {
        section: "Aplicação",
        questions: [
          "Como você tem aplicado o que aprendeu?",
          "Que projetos poderiam ajudar no seu desenvolvimento?",
          "Que recursos adicionais você precisa?",
        ],
      },
    ],
  },
  {
    id: "mentee-template",
    name: "Mentorado 1:1",
    role: "mentee",
    icon: "User",
    description: "Sessão com pessoa que você está mentorando",
    suggestedTopics: [
      "Progresso do mentorado",
      "Dificuldades",
      "Próximos passos",
      "Motivação",
    ],
    defaultWorkingOn: ["comp-mentoring", "other-team"],
    questionPrompts: [
      {
        section: "Progresso",
        questions: [
          "Como você se sente sobre seu progresso?",
          "Quais foram seus principais aprendizados?",
          "Onde você está encontrando mais dificuldade?",
        ],
      },
      {
        section: "Suporte",
        questions: [
          "Como posso te ajudar melhor?",
          "Que tipo de atividade seria mais útil?",
          "Você se sente confortável para fazer perguntas?",
        ],
      },
    ],
  },
];

/**
 * Hook para gerenciar competências do usuário
 */
export function useCompetencies() {
  const [competencies] = useState<Competency[]>(MOCK_COMPETENCIES);
  const [userProgress, setUserProgress] =
    useState<UserCompetencyProgress[]>(MOCK_USER_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula loading da API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getCompetencyById = (id: string) => {
    return competencies.find((comp) => comp.id === id);
  };

  const getUserProgressByCompetency = (competencyId: string) => {
    return userProgress.find((prog) => prog.competencyId === competencyId);
  };

  const getActiveCompetencies = () => {
    return userProgress.filter((prog) => prog.isActiveInCycle);
  };

  const addEvidence = (
    competencyId: string,
    evidence: Omit<CompetencyEvidence, "id">
  ) => {
    setUserProgress((prev) =>
      prev.map((prog) => {
        if (prog.competencyId === competencyId) {
          const newEvidence: CompetencyEvidence = {
            ...evidence,
            id: `ev-${Date.now()}`,
          };
          return {
            ...prog,
            evidences: [...prog.evidences, newEvidence],
            progress: Math.min(prog.progress + 20, 100), // Simplified progress calculation
          };
        }
        return prog;
      })
    );
  };

  return {
    competencies,
    userProgress,
    loading,
    getCompetencyById,
    getUserProgressByCompetency,
    getActiveCompetencies,
    addEvidence,
  };
}

/**
 * Hook para gerenciar 1:1s
 */
export function useOneOnOnes() {
  const [oneOnOnes, setOneOnOnes] = useState<OneOnOneRecord[]>([]);
  const [templates] = useState<OneOnOneTemplate[]>(ONEONONE_TEMPLATES);
  const [workingOnOptions] = useState<WorkingOnOption[]>(WORKING_ON_OPTIONS);
  const [loading, setLoading] = useState(false);

  const createOneOnOne = async (
    data: Omit<OneOnOneRecord, "id" | "createdAt" | "updatedAt" | "createdBy">
  ) => {
    setLoading(true);

    try {
      // Simula chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newOneOnOne: OneOnOneRecord = {
        ...data,
        id: `1on1-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user-id",
      };

      setOneOnOnes((prev) => [newOneOnOne, ...prev]);
      return newOneOnOne;
    } catch (error) {
      console.error("Erro ao criar 1:1:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTemplateByRole = (role: string) => {
    return templates.find((template) => template.role === role);
  };

  const getWorkingOnOptionsByCategory = (category?: string) => {
    if (!category) return workingOnOptions;
    return workingOnOptions.filter((option) => option.category === category);
  };

  const getRecentOneOnOnes = (limit = 5) => {
    return oneOnOnes
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return {
    oneOnOnes,
    templates,
    workingOnOptions,
    loading,
    createOneOnOne,
    getTemplateByRole,
    getWorkingOnOptionsByCategory,
    getRecentOneOnOnes,
  };
}
