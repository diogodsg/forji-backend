import { useState, useEffect } from 'react';
import type { TimelineItem, TimelineStats } from '../types/timeline';

interface UsePdiTimelineResult {
  cycles: TimelineItem[];
  stats: TimelineStats;
  loading: boolean;
  error: string | null;
  refreshTimeline: () => void;
}

export function usePdiTimeline(userId?: string): UsePdiTimelineResult {
  const [cycles, setCycles] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = userId ? `/api/pdi/timeline/${userId}` : '/api/pdi/timeline/me';
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Falha ao carregar timeline');
      }

      const data = await response.json();
      
      // Transform backend data to timeline items
      const timelineItems: TimelineItem[] = data.cycles.map((cycle: any) => ({
        ...cycle,
        completionPercentage: calculateCompletionPercentage(cycle),
        achievedKRs: calculateAchievedKRs(cycle),
        totalKRs: cycle.pdi?.krs?.length || 0,
        badges: cycle.badges || [],
        workFocus: cycle.workFocus || [],
        achievements: cycle.achievements || [],
        challenges: cycle.challenges || [],
        feedback: cycle.feedback || [],
      }));

      setCycles(timelineItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const refreshTimeline = () => {
    fetchTimeline();
  };

  useEffect(() => {
    fetchTimeline();
  }, [userId]);

  // Calculate stats
  const stats: TimelineStats = {
    totalCycles: cycles.length,
    completedCycles: cycles.filter(c => c.status === 'completed').length,
    totalKRs: cycles.reduce((sum, c) => sum + c.totalKRs, 0),
    totalKRsAchieved: cycles.reduce((sum, c) => sum + c.achievedKRs, 0),
    averageCompletionRate: cycles.length > 0 
      ? cycles.reduce((sum, c) => sum + (c.completionPercentage || 0), 0) / cycles.length 
      : 0,
    totalBadgesEarned: cycles.reduce((sum, c) => sum + (c.badges?.length || 0), 0),
    competenciesImproved: Array.from(
      new Set(cycles.flatMap(c => c.pdi.competencies))
    ),
  };

  return {
    cycles,
    stats,
    loading,
    error,
    refreshTimeline,
  };
}

// Helper functions
function calculateCompletionPercentage(cycle: any): number {
  if (cycle.status === 'completed') return 100;
  if (cycle.status === 'planned') return 0;

  // Calculate based on milestones completion
  const milestones = cycle.pdi?.milestones || [];
  if (milestones.length === 0) return 0;

  const completedMilestones = milestones.filter((m: any) => m.completed).length;
  return Math.round((completedMilestones / milestones.length) * 100);
}

function calculateAchievedKRs(cycle: any): number {
  const krs = cycle.pdi?.krs || [];
  return krs.filter((kr: any) => kr.achieved || kr.currentStatus === 'completed').length;
}

// Mock data generator for development
export function generateMockTimelineData(): TimelineItem[] {
  return [
    {
      id: '1',
      title: 'Q1 2024 - Liderança e Comunicação',
      description: 'Foco em desenvolver habilidades de liderança técnica e melhorar comunicação com stakeholders',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'completed',
      completionPercentage: 100,
      achievedKRs: 3,
      totalKRs: 3,
      pdi: {
        competencies: ['Liderança Técnica', 'Comunicação', 'Gestão de Projetos'],
        milestones: [
          {
            id: 'm1',
            date: '2024-01-15',
            title: 'Apresentação para diretoria',
            summary: 'Apresentei roadmap técnico para Q1-Q2',
            workActivities: 'Preparação de slides, coleta de dados, ensaio',
            improvements: ['Melhorar storytelling', 'Usar mais dados visuais'],
            positives: ['Clareza na comunicação', 'Domínio técnico'],
          },
          {
            id: 'm2',
            date: '2024-02-28',
            title: 'Mentoria de 3 desenvolvedores junior',
            summary: 'Estabeleci programa de mentoria semanal',
            workActivities: 'Sessões 1:1, code reviews, definição de planos individuais',
            improvements: ['Documentar melhor o processo', 'Criar templates'],
            positives: ['Feedback positivo dos mentorados', 'Melhoria visível nas entregas'],
          }
        ],
        krs: [
          {
            id: 'kr1',
            description: 'Liderar 2 projetos estratégicos',
            successCriteria: 'Entregar no prazo com qualidade',
            currentStatus: 'Ambos projetos entregues com sucesso',
          },
          {
            id: 'kr2',
            description: 'Apresentar para C-level',
            successCriteria: 'Apresentação aprovada pela diretoria',
            currentStatus: 'Apresentação muito bem recebida, aprovação unânime',
          },
          {
            id: 'kr3',
            description: 'Mentorar 3 desenvolvedores',
            successCriteria: 'Feedback positivo e evolução mensurável',
            currentStatus: 'Todos os 3 foram promovidos no final do ciclo',
          }
        ],
        records: [
          {
            area: 'Liderança Técnica',
            levelBefore: 2,
            levelAfter: 4,
            evidence: 'Sucesso nos projetos liderados e feedback da equipe',
          },
          {
            area: 'Comunicação',
            levelBefore: 3,
            levelAfter: 4,
            evidence: 'Apresentação para diretoria e melhoria nas dailies',
          },
          {
            area: 'Gestão de Projetos',
            levelBefore: 3,
            levelAfter: 4,
            evidence: 'Entrega de 2 projetos complexos no prazo',
          }
        ],
      },
      workFocus: [
        'Desenvolvimento de arquitetura para sistema de pagamentos',
        'Mentoria e desenvolvimento da equipe técnica',
        'Alinhamento estratégico com produto e negócio',
      ],
      achievements: [
        'Entrega do projeto de pagamentos 2 semanas antes do prazo',
        '3 desenvolvedores promovidos sob minha mentoria',
        'Implementação de code review process que reduziu bugs em 40%',
        'Apresentação técnica aprovada unanimemente pela diretoria',
      ],
      challenges: [
        'Balancear tempo entre código e gestão de pessoas',
        'Melhorar comunicação de decisões técnicas para não-técnicos',
        'Implementar processos sem burocratizar o desenvolvimento',
      ],
      badges: [
        {
          id: 'b1',
          name: 'Tech Leader',
          icon: '👨‍💼',
          rarity: 'rare',
          earnedAt: '2024-02-15',
          description: 'Liderou projeto estratégico com sucesso',
        },
        {
          id: 'b2',
          name: 'Mentor',
          icon: '🎓',
          rarity: 'rare',
          earnedAt: '2024-03-01',
          description: 'Mentorou desenvolvedores com resultados excepcionais',
        },
        {
          id: 'b3',
          name: 'Communicator',
          icon: '🎤',
          rarity: 'epic',
          earnedAt: '2024-03-15',
          description: 'Apresentação excepcional para C-level',
        },
      ],
      feedback: [
        {
          id: 'f1',
          type: 'manager',
          author: 'Carlos Silva (CTO)',
          content: 'Excelente evolução na liderança. A forma como conduziu o projeto de pagamentos foi exemplar. Continue focando no desenvolvimento da equipe.',
          rating: 5,
          createdAt: '2024-03-30',
        },
        {
          id: 'f2',
          type: 'peer',
          author: 'Ana Costa (Product Manager)',
          content: 'Comunicação muito melhor neste ciclo. As reuniões de alinhamento ficaram mais eficientes e claras.',
          rating: 4,
          createdAt: '2024-03-28',
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-03-31',
    },
    {
      id: '2',
      title: 'Q2 2024 - Arquitetura e Inovação',
      description: 'Evolução em arquitetura de sistemas distribuídos e liderança de inovação técnica',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      status: 'active',
      completionPercentage: 75,
      achievedKRs: 2,
      totalKRs: 4,
      pdi: {
        competencies: ['Arquitetura de Software', 'Sistemas Distribuídos', 'Inovação Técnica'],
        milestones: [
          {
            id: 'm3',
            date: '2024-04-30',
            title: 'Migração para microserviços',
            summary: 'Completei migração de 60% do monolito',
            workActivities: 'Design de APIs, decomposição de serviços, testes de integração',
            positives: ['Performance melhorou 40%', 'Deploy independente funcionando'],
            improvements: ['Melhorar monitoramento', 'Documentar padrões'],
          }
        ],
        krs: [
          {
            id: 'kr4',
            description: 'Migrar 80% do monolito para microserviços',
            successCriteria: 'Serviços rodando em produção com métricas positivas',
            currentStatus: '75% migrado, performance melhorou significativamente',
          },
          {
            id: 'kr5',
            description: 'Implementar observabilidade completa',
            successCriteria: 'Logs, métricas e traces em todos os serviços',
            currentStatus: 'Completo - Grafana e Jaeger implementados',
          },
          {
            id: 'kr6',
            description: 'Tech talks mensais',
            successCriteria: 'Pelo menos 3 apresentações técnicas',
            currentStatus: 'Em andamento - 2 talks realizados',
          },
          {
            id: 'kr7',
            description: 'POC de nova tecnologia',
            successCriteria: 'Validar e documentar viabilidade',
            currentStatus: 'Planejado - GraphQL POC começando em maio',
          }
        ],
        records: [
          {
            area: 'Arquitetura de Software',
            levelBefore: 4,
            levelAfter: 5,
            evidence: 'Migração bem-sucedida para microserviços',
          },
          {
            area: 'Sistemas Distribuídos',
            levelBefore: 3,
            levelAfter: 4,
            evidence: 'Implementação de observabilidade e service mesh',
          }
        ],
      },
      workFocus: [
        'Migração arquitetural do monolito para microserviços',
        'Implementação de observabilidade e monitoramento',
        'Research e POCs de novas tecnologias',
        'Tech talks e compartilhamento de conhecimento',
      ],
      achievements: [
        'Performance da aplicação melhorou 40% após migração',
        'Zero downtime durante todas as migrações',
        'Implementação completa de observabilidade (Grafana + Jaeger)',
      ],
      challenges: [
        'Complexidade de debugging em ambiente distribuído',
        'Latência de rede entre serviços',
        'Balanceamento entre inovação e estabilidade',
      ],
      badges: [
        {
          id: 'b4',
          name: 'Architect',
          icon: '🏗️',
          rarity: 'epic',
          earnedAt: '2024-05-15',
          description: 'Projetou arquitetura de microserviços robusta',
        },
        {
          id: 'b5',
          name: 'Performance Guru',
          icon: '⚡',
          rarity: 'rare',
          earnedAt: '2024-05-01',
          description: 'Melhorou performance da aplicação em 40%',
        },
      ],
      feedback: [],
      createdAt: '2024-04-01',
      updatedAt: '2024-06-01',
    },
    {
      id: '3',
      title: 'Q3 2024 - Gestão e Escalabilidade',
      description: 'Planejamento para crescimento da equipe e padronização de processos',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      status: 'planned',
      completionPercentage: 0,
      achievedKRs: 0,
      totalKRs: 3,
      pdi: {
        competencies: ['Gestão de Equipes', 'Processos de Desenvolvimento', 'Escalabilidade'],
        milestones: [],
        krs: [
          {
            id: 'kr8',
            description: 'Contratar e onboarding de 5 desenvolvedores',
            successCriteria: 'Equipe produtiva em 30 dias',
            currentStatus: 'Planejado',
          },
          {
            id: 'kr9',
            description: 'Padronizar processos de desenvolvimento',
            successCriteria: 'Documentação e treinamentos completos',
            currentStatus: 'Planejado',
          },
          {
            id: 'kr10',
            description: 'Implementar CI/CD avançado',
            successCriteria: 'Deploy automatizado e rollback',
            currentStatus: 'Planejado',
          }
        ],
        records: [],
      },
      workFocus: [
        'Recrutamento e seleção técnica',
        'Onboarding estruturado para novos membros',
        'Documentação de processos e melhores práticas',
        'Automação de deploys e testes',
      ],
      achievements: [],
      challenges: [],
      badges: [],
      feedback: [],
      createdAt: '2024-07-01',
      updatedAt: '2024-07-01',
    },
  ];
}