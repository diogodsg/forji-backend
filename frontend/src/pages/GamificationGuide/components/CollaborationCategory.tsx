import { FiHeart } from "react-icons/fi";
import { XpCategory } from "./XpCategory";
import { XpItem } from "./XpItem";

export function CollaborationCategory() {
  return (
    <XpCategory
      title="Colaboração e Mentoring"
      percentage="35% do XP total"
      description="Foco em ajudar outros a crescer"
      icon={<FiHeart className="w-8 h-8" />}
      gradient="from-brand-600 to-blue-600"
    >
      <XpItem
        title="Suporte Performance"
        xpValue="60 XP"
        description="Ajudar colegas a melhorar seu desempenho através de orientação, feedback e suporte técnico direto."
        example="Ajudar colega com dificuldades em React → Documentar melhoria → 60 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Onboarding Júnior"
        xpValue="80 XP"
        description="Dedicar tempo para integrar novos membros da equipe, ensinando processos, cultura e aspectos técnicos."
        example="Orientar novo desenvolvedor durante primeira semana → 80 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Compartilhar Conhecimento"
        xpValue="50 XP"
        description="Apresentações, workshops, documentação técnica ou qualquer atividade que distribua conhecimento para a equipe."
        example="Tech talk sobre performance em JavaScript → 50 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Career Coaching"
        xpValue="70 XP"
        description="Orientar colegas sobre desenvolvimento de carreira, habilidades e oportunidades de crescimento profissional."
        example="Sessão de coaching de carreira com desenvolvedor júnior → 70 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Colaboração Cross-Team"
        xpValue="70 XP"
        description="Trabalhar ativamente com outras equipes, facilitando projetos e quebrando silos organizacionais."
        example="Projeto conjunto entre Frontend e Backend teams → 70 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Sessão de Mentoria"
        xpValue="60 XP"
        description="Sessões estruturadas de mentoria com foco no desenvolvimento técnico e profissional de outros."
        example="Mentoria semanal com desenvolvedor em crescimento → 60 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Suporte a Pares"
        xpValue="30 XP"
        description="Apoio contínuo a colegas do mesmo nível através de code review, pair programming e consultoria técnica."
        example="Code review detalhado com sugestões de melhoria → 30 XP"
        gradient="from-brand-50 to-blue-50"
      />

      <XpItem
        title="Feedback Significativo"
        xpValue="40 XP"
        description="Feedback construtivo e detalhado que realmente ajude o destinatário a crescer (nota ≥4.0/5)."
        example="Feedback específico sobre apresentação com sugestões práticas → 40 XP"
        gradient="from-brand-50 to-blue-50"
      />
    </XpCategory>
  );
}
