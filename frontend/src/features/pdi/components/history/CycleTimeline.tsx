import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiCircle,
  FiTrendingUp,
  FiPlus,
  FiMinus,
  FiFolder,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useState } from "react";

interface CycleTimelineProps {
  userId?: number;
  filters: {
    year: string;
    competency: string;
    status: string;
  };
}

interface CycleEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "completed" | "in-progress" | "not-started";
  type: "cycle" | "milestone" | "evaluation";
  competencies: string[];
  achievements?: number;
  workFocus?: string[];
  positivePoints?: string[];
  negativePoints?: string[];
  keyProjects?: string[];
}

export function CycleTimeline({
  userId: _userId,
  filters: _filters,
}: CycleTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());

  const toggleExpanded = (eventId: number) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };
  // TODO: Implementar hook para buscar dados do backend
  const events: CycleEvent[] = [
    {
      id: 1,
      title: "Ciclo Q4 2024 - Liderança Técnica",
      description: "Desenvolvimento de habilidades de liderança e mentoria",
      date: "2024-10-01",
      status: "in-progress",
      type: "cycle",
      competencies: ["Liderança", "Comunicação", "Mentoria"],
      achievements: 3,
      workFocus: [
        "Mentoria de 3 desenvolvedores júniors",
        "Definição de arquitetura do novo produto",
        "Implementação de code reviews estruturados",
        "Criação de documentação técnica",
      ],
      positivePoints: [
        "Melhoria significativa na qualidade do código da equipe",
        "Redução de 40% no tempo de onboarding de novos membros",
        "Aumento da autonomia dos desenvolvedores júniors",
      ],
      negativePoints: [
        "Dificuldade inicial em balancear mentoria com desenvolvimento",
        "Algumas reuniões de alinhamento se estenderam mais que o planejado",
      ],
      keyProjects: ["Sistema de Notificações", "API Gateway V2"],
    },
    {
      id: 2,
      title: "Avaliação de Performance Q3",
      description: "Revisão de metas e competências do terceiro trimestre",
      date: "2024-09-30",
      status: "completed",
      type: "evaluation",
      competencies: ["Todas"],
      achievements: 5,
      workFocus: [
        "Entrega do sistema de pagamentos",
        "Migração da infraestrutura para Kubernetes",
        "Implementação de monitoring avançado",
      ],
      positivePoints: [
        "Entrega 100% dentro do prazo e escopo",
        "Zero downtime durante a migração",
        "Redução de 60% nos incidentes de produção",
      ],
      negativePoints: [
        "Sobrecarga de trabalho em algumas semanas",
        "Falta de documentação durante a migração inicial",
      ],
      keyProjects: ["Payment Gateway", "K8s Migration", "Observability Stack"],
    },
    {
      id: 3,
      title: "Ciclo Q3 2024 - Arquitetura de Software",
      description: "Foco em design patterns e arquitetura de sistemas",
      date: "2024-07-01",
      status: "completed",
      type: "cycle",
      competencies: ["Arquitetura", "Design Patterns", "Sistemas"],
      achievements: 8,
      workFocus: [
        "Refatoração do monolito em microserviços",
        "Implementação de Event Sourcing",
        "Design de APIs RESTful e GraphQL",
        "Estudos de Domain Driven Design",
      ],
      positivePoints: [
        "Melhoria de 70% na performance das APIs",
        "Arquitetura mais escalável e manutenível",
        "Redução significativa do acoplamento entre módulos",
        "Aplicação bem-sucedida de DDD",
      ],
      negativePoints: [
        "Curva de aprendizado íngreme no início",
        "Algumas decisões arquiteturais precisaram ser revisadas",
        "Tempo de desenvolvimento inicial mais lento",
      ],
      keyProjects: [
        "Microservices Migration",
        "Event Store Implementation",
        "API Gateway",
      ],
    },
    {
      id: 4,
      title: "Marco: Certificação AWS",
      description: "Conclusão da certificação AWS Solutions Architect",
      date: "2024-06-15",
      status: "completed",
      type: "milestone",
      competencies: ["Cloud", "AWS", "Infraestrutura"],
      achievements: 2,
      workFocus: [
        "Estudos focados em AWS (6 meses)",
        "Implementação de infraestrutura como código",
        "Migração de serviços para AWS",
        "Otimização de custos de cloud",
      ],
      positivePoints: [
        "Certificação obtida no primeiro intento",
        "Redução de 45% nos custos de infraestrutura",
        "Melhoria na confiabilidade dos serviços",
        "Conhecimento aplicado imediatamente no projeto",
      ],
      negativePoints: [
        "Dificuldade inicial com alguns serviços mais complexos",
        "Necessidade de refatoração de algumas implementações",
      ],
      keyProjects: [
        "AWS Migration",
        "Infrastructure as Code",
        "Cost Optimization",
      ],
    },
  ];

  const getStatusIcon = (status: CycleEvent["status"]) => {
    switch (status) {
      case "completed":
        return FiCheckCircle;
      case "in-progress":
        return FiClock;
      case "not-started":
        return FiCircle;
      default:
        return FiCircle;
    }
  };

  const getStatusColor = (status: CycleEvent["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "not-started":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: CycleEvent["type"]) => {
    switch (type) {
      case "cycle":
        return FiCalendar;
      case "milestone":
        return FiTrendingUp;
      case "evaluation":
        return FiCheckCircle;
      default:
        return FiCalendar;
    }
  };

  const getTypeColor = (type: CycleEvent["type"]) => {
    switch (type) {
      case "cycle":
        return "bg-blue-500";
      case "milestone":
        return "bg-purple-500";
      case "evaluation":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Timeline de Desenvolvimento
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Ciclos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Marcos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Avaliações</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Linha vertical do timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {events.map((event) => {
            const StatusIcon = getStatusIcon(event.status);
            const TypeIcon = getTypeIcon(event.type);
            const statusColor = getStatusColor(event.status);
            const typeColor = getTypeColor(event.type);

            return (
              <div
                key={event.id}
                className="relative flex items-start space-x-4"
              >
                {/* Ícone do timeline */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${typeColor}`}
                >
                  <TypeIcon className="w-4 h-4 text-white" />
                </div>

                {/* Conteúdo do evento */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>
                              {new Date(event.date).toLocaleDateString("pt-BR")}
                            </span>
                          </span>
                          {event.achievements && (
                            <span className="flex items-center space-x-1">
                              <FiTrendingUp className="w-3 h-3" />
                              <span>{event.achievements} conquistas</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusColor}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span className="text-xs font-medium capitalize">
                            {event.status === "in-progress"
                              ? "Em andamento"
                              : event.status === "completed"
                              ? "Concluído"
                              : "Não iniciado"}
                          </span>
                        </div>

                        {(event.workFocus ||
                          event.positivePoints ||
                          event.negativePoints ||
                          event.keyProjects) && (
                          <button
                            onClick={() => toggleExpanded(event.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title={
                              expandedEvents.has(event.id)
                                ? "Recolher detalhes"
                                : "Ver detalhes"
                            }
                          >
                            {expandedEvents.has(event.id) ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Competências */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.competencies.map((competency) => (
                        <span
                          key={competency}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {competency}
                        </span>
                      ))}
                    </div>

                    {/* Detalhes expandidos */}
                    {expandedEvents.has(event.id) && (
                      <div className="space-y-4 pt-3 border-t border-gray-200">
                        {/* Foco de trabalho */}
                        {event.workFocus && event.workFocus.length > 0 && (
                          <div>
                            <h5 className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                              <FiFolder className="w-4 h-4 mr-2 text-blue-600" />
                              No que trabalhou
                            </h5>
                            <ul className="space-y-1">
                              {event.workFocus.map((item, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-600 flex items-start"
                                >
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Projetos-chave */}
                        {event.keyProjects && event.keyProjects.length > 0 && (
                          <div>
                            <h5 className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                              <FiTrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                              Projetos-chave
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {event.keyProjects.map((project, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                  {project}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Pontos positivos */}
                          {event.positivePoints &&
                            event.positivePoints.length > 0 && (
                              <div>
                                <h5 className="flex items-center text-sm font-semibold text-green-800 mb-2">
                                  <FiPlus className="w-4 h-4 mr-2 text-green-600" />
                                  Pontos Positivos
                                </h5>
                                <ul className="space-y-1">
                                  {event.positivePoints.map((point, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600 flex items-start"
                                    >
                                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* Pontos de melhoria */}
                          {event.negativePoints &&
                            event.negativePoints.length > 0 && (
                              <div>
                                <h5 className="flex items-center text-sm font-semibold text-orange-800 mb-2">
                                  <FiMinus className="w-4 h-4 mr-2 text-orange-600" />
                                  Pontos de Melhoria
                                </h5>
                                <ul className="space-y-1">
                                  {event.negativePoints.map((point, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600 flex items-start"
                                    >
                                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vazio */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros ou adicione novos ciclos para ver o histórico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
